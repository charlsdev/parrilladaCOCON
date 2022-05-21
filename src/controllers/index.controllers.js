const indexControllers = {};

require('dotenv').config();

const passport = require('passport');

const VerificationModel = require('../models/Verifications');

indexControllers.login = (req, res) => {
   res.render('login');
};

indexControllers.loginAuth = passport.authenticate('local.login', {
   failureRedirect: '/',
   successRedirect: '/verification',
   badRequestMessage: 'Credenciales desconocidas!!!',
   failureFlash: true
});

indexControllers.verification = async (req, res) => {
   const {
      _id: IDUser,
      privilegio
   } = req.user;

   const userVer = await VerificationModel
      .findOne({
         _idUser: IDUser
      }, {
         motivo: 1,
         estadoV: 1
      });

   console.log(userVer);

   if (userVer) {
      if (userVer.motivo === 'changePassword') {
         res.redirect('/password');
      } else {
         req.logout();
         req.flash('warning_msg', 'No estas autorizado. Inicia sesión...');
         res.redirect('/');
      }
   } else {
      if (privilegio === 'Cajero') {
         res.redirect('/c');
      } else {
         if (privilegio === 'Gerente') {
            res.redirect('/g');
         } else {
            if (privilegio === 'Administrador') {
               res.redirect('/a');
            } else {
               req.logout();
               req.flash('warning_msg', 'No estas autorizado. Inicia sesión.');
               res.redirect('/');
            }
         }
      }
   }
};

indexControllers.renderProfile = (req, res) => {
   var
      date = new Date(),
      d = date.getDate(),
      m = date.getMonth() + 1,
      a = date.getFullYear();

   const {
      _id,
      cedula,
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('profile', {
      _id,
      cedula,
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email,
      privilegio,
      estado,
      profile,
      d, m, a
   });
};





indexControllers.exitLogout = (req, res) => {
   req.logout();
   req.flash('warning_msg', 'Sesión cerrada. Vuelva pronto...');
   res.redirect('/');
};

module.exports = indexControllers;