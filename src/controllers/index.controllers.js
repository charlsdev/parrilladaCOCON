const indexControllers = {};

require('dotenv').config();

const passport = require('passport');

indexControllers.login = (req, res) => {
   res.render('login');
};

indexControllers.loginAuth = passport.authenticate('local.login', {
   failureRedirect: '/',
   successRedirect: '/verification',
   badRequestMessage: 'Credenciales desconocidas!!!',
   failureFlash: true
});

indexControllers.verification = (req, res) => {
   console.log(req.user);
   res.render('welcome');
};

indexControllers.exitLogout = (req, res) => {
   req.logout();
   req.flash('warning_msg', 'Sesión cerrada. Vuelva pronto...');
   res.redirect('/');
};

module.exports = indexControllers;