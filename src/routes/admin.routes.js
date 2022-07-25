const { Router } = require('express');
const router = Router();

const {
   welcome,

   renderCajero,
   allCajero,
   newUser,
   updateUser

} = require('../controllers/admin.controllers');

const {
   isAuthenticated,
   isAuthenticatedAdmin
} = require('../global/middleware');

router.get('/', isAuthenticated, isAuthenticatedAdmin, welcome);

router.get('/cajeros', isAuthenticated, isAuthenticatedAdmin, renderCajero);
router.get('/allCajero', isAuthenticated, isAuthenticatedAdmin, allCajero);
router.post('/newUser', isAuthenticated, isAuthenticatedAdmin, newUser);
router.put('/updateUser', isAuthenticated, isAuthenticatedAdmin, updateUser);

module.exports = router;