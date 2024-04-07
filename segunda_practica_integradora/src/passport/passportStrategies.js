import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { usersModel } from "../db/models/users.model.js";
import { hashPassword, comparePassword } from "../bcrypt/bcrypt.js";


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
            try {
                const user = await usersModel.findOne({ email });
                if (user) {
                    return done(null, false, {
                        message: "Email already registered",
                    });
                }
                const newUser = new usersModel({
                    email,
                    password: hashPassword(password),
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    age: req.body.age,
                });
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);

//Configurar passport para usar una estrategia local (para logear usuarios con email y contraseña)
passport.use(
    "Login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (username, password, done) => {
            const user = await usersModel.findOne({ email: username });
            // console.log("CONSOLELOG!: " + user);
            if (!user) {
                return done(null, false, { message: "Incorrect email" });
            }
            if (!(comparePassword(password, user.password))) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);

        }
    )
);

//Configurar passport para usar una estrategia con github (para autenticar usuarios con github)
passport.use(
    "Github",
    new GithubStrategy(
        {
            clientID: "Iv1.f640d6f0776533af",
            clientSecret: "0f78a8e42b24250988804538a3655d1253dfb05e",
            callbackURL: "http://localhost:8080/api/users/github/callback",
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