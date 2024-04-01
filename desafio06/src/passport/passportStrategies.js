import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { usersModel } from "../db/models/users.model.js";
import { hashPassword } from "../bcrypt/bcrypt.js";


    //Configurar passport para usar una estrategia local (para autenticar usuarios con email y contraseña)
    passport.use(
        "Register",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                const user = await usersModel.findOne({ email });
                if (user) {
                    return done(null, false, {
                        message: "Email already registered",
                    });
                }
                const newUser = new usersModel({
                    email,
                    password: await hashPassword(password),
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    age: req.body.age,
                });
                await newUser.save();
                return done(null, newUser);
            }
        )
    );

    //Configurar passport para usar una estrategia con github (para autenticar usuarios con github)
    passport.use(
        "Github",
        new GithubStrategy(
            {
                clientID: "Iv1.128d199a177c8226",
                clientSecret: "4d2c45054943c03da83de76d6f43a9a4061ac574",
                callbackURL: "http://localhost:8080/api/users/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                const user = await usersModel.findOne({ email: profile._json.email });
                if (user) {
                    return done(null, user);
                }
                const newUser = new usersModel({
                    email: profile._json.email,
                    password: ' ',
                    first_name: profile._json.name.split(' ')[0],
                    last_name: profile._json.name.split(' ')[1] || ' ',
                    age: 0,
                });
                await newUser.save();
                return done(null, newUser);
            }
        )
    );

    //Serializar el usuario para almacenarlo en la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    //Deserializar el usuario para obtenerlo de la sesión
    passport.deserializeUser(async (id, done) => {
        const user = await usersModel.findById(id);
        done(null, user);
    })