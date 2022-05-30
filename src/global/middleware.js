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

middlewareSession.isAuthenticatedAllPriv = (req, res, next) => {
   if (
      req.user.privilegio == 'Cajero' ||
      req.user.privilegio == 'Gerente' ||
      req.user.privilegio == 'Administrador'
   ) {
      return next();
   }
   res.redirect('/');
};

middlewareSession.isAuthenticatedCajero = (req, res, next) => {
   if (req.user.privilegio == 'Cajero') {
      return next();
   }
   res.redirect('/verification');
};

middlewareSession.isAuthenticatedGerente = (req, res, next) => {
   if (req.user.privilegio == 'Gerente') {
      return next();
   }
   res.redirect('/verification');
};

middlewareSession.isAuthenticatedAdmin = (req, res, next) => {
   if (req.user.privilegio == 'Administrador') {
      return next();
   }
   res.redirect('/verification');
};

module.exports = middlewareSession;