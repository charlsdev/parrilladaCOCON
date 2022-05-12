const cajeroControllers = {};

require('dotenv').config();

cajeroControllers.welcome = (req, res) => {
   res.render('cajero/welcome');
};

module.exports = cajeroControllers;