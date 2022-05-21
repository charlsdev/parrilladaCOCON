const middlewareSession = {};

middlewareSession.isAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }
   req.flash('warning_msg', 'No estas autorizado. Inicia sesión.');
   res.redirect('/');
};

middlewareSession.isNotAuthenticated = (req, res, next) => {
   if (!req.isAuthenticated()) {
      return next();
   }
   res.redirect('/verification');
};

middlewareSession.isAuthenticatedCajero = (req, res, next) => {
   if (req.user.privilegio == 'Cajero') {
      return next();
   }
   res.redirect('/verification');
};

module.exports = middlewareSession;