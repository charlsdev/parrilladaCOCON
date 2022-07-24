const { Router } = require('express');
const router = Router();

const {
   welcome,

} = require('../controllers/admin.controllers');

const {
   isAuthenticated,
   isAuthenticatedAdmin
} = require('../global/middleware');

router.get('/', isAuthenticated, isAuthenticatedAdmin, welcome);

module.exports = router;