const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/Users');

passport.use('local.login', new localStrategy({
   usernameField: 'cedula',
   passwordField: 'password',
   passReqToCallback: true,
   // session: false
}, async (req, cedula, password, done) => {

   // Confirmar si coincide el username
   const user = await User
      .findOne({
         cedula
      });
   
   if (!user) {
      // return done(null, false, { message: 'Usuario y/o contraseña no existentes...'});
      return done(null, false, { message: 'Usuario y/o contraseña incorrectas...'});
   } else {
      // Validar la contraseña
      const passLog = await user.matchPassword(password);
      if (passLog) {
         // console.log(user);
         if (user.estado == 'Disabled') {
            return done(null, false, { message: '¡Usuario desactivado! Comuniquese con el administrador del sitema...'});
         } else {
            return done(null, user);
         }
      } else {
         return done(null, false, { message: 'Usuario y/o contraseña incorrectas...'});
      }
   }
}));

passport
   .serializeUser((user, done) => {
   // console.log(user);
      done(null, user.id);
   });

passport
   .deserializeUser(async (id, done) => {
      await User.findById(id, (err, user) => {
         done(err, user);
      });
   });