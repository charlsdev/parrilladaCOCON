const { Router } = require('express');
const router = Router();

const {
   welcome
} = require('../controllers/cajero.controllers');

const {
   isAuthenticated,
   isAuthenticatedCajero
} = require('../global/middleware');

router.get('/', isAuthenticated, isAuthenticatedCajero, welcome);

module.exports = router;