const { Router } = require('express');
const router = Router();

const { 
   login
} = require('../controllers/index.controllers');

router.get('/', login);

module.exports = router;