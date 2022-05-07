const indexControllers = {};

indexControllers.login = (req, res) => {
   res.render('login');
};

module.exports = indexControllers;