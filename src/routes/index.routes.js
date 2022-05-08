const { Router } = require('express');
const router = Router();

const { 
   login,
   loginAuth,

   verification,

   exitLogout
} = require('../controllers/index.controllers');

router.get('/', login);
router.post('/login', loginAuth);

router.get('/verification', verification);

router.get('/exit', exitLogout);

module.exports = router;