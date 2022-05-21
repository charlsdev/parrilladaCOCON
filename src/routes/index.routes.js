const { Router } = require('express');
const router = Router();

const { 
   login,
   loginAuth,

   verification,

   renderProfile,

   exitLogout
} = require('../controllers/index.controllers');

const {
   isAuthenticated,
   isNotAuthenticated
} = require('../global/middleware');

router.get('/', isNotAuthenticated, login);
router.post('/login', loginAuth);

router.get('/verification', isAuthenticated, verification);

router.get('/profile', isAuthenticated, renderProfile);

router.get('/exit', isAuthenticated, exitLogout);

module.exports = router;