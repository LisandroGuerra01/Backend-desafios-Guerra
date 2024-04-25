import passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { usersModel } from "../dal/models/users.model.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { access } from 'fs';

//Local Strategy para loguearse
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await usersModel.findOne({ email })
        if (!user) {
            return done(null, false, { message: "Email incorrecto" })
        }
        if (!(await comparePassword(password, user.password))) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user)
    } catch (error) {
        return done(error)
    }
}));

//Local Strategy para registroarse
passport.use('Register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await usersModel.findOne({ email });
    if (user) {
        return done(null, false, { message: "El usuario ya existe" })
    }
    const newUser = new usersModel({
        email,
        password: await hashPassword(password),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age
    })
    await newUser.save();
    return done(null, newUser)
}));

//Github Strategy
passport.use('Github', new GithubStrategy({
    clientID: "Iv1.f640d6f0776533af",
    clientSecret: "0f78a8e42b24250988804538a3655d1253dfb05e",
    callbackURL: "http://localhost:9090/api/users/github/callback",
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
    }));

//Secret key
const secret = "Secretkey";
const { fromExtractors, fromAuthHeaderAsBearerToken } = ExtractJwt

//JWT Strategy
passport.use(
    "current",
    new JWTStrategy(
        {
            jwtFromRequest: fromExtractors([(req) => req.cookies.token, fromAuthHeaderAsBearerToken()]),
            secretOrKey: secret,
        },
        async (jwtPayload, done) => {
            try {
                const user = await usersModel.findById(jwtPayload.id);
                console.log(user);
                console.log(jwtPayload);
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
)

//Serializar el usuario para almacenarlo en la sesión
passport.serializeUser((user, done) => {
    done(null, user._id);
});

//Deserializar el usuario para obtenerlo de la sesión
passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
    done(null, user);
});