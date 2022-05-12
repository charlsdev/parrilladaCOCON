const { Router } = require('express');
const router = Router();

const {
   welcome
} = require('../controllers/cajero.controllers');

router.get('/', welcome);

module.exports = router;