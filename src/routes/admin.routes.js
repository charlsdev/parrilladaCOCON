const { Router } = require('express');
const router = Router();

const {
   welcome,

   renderCajero,
   allCajero,
   renderGerente,
   allGerente,
   renderAdmin,
   allAdmin,

   newUser,
   updateUser,
   newPass,
   changeEstado

} = require('../controllers/admin.controllers');

const {
   isAuthenticated,
   isAuthenticatedAdmin,
   verificationProcess
} = require('../global/middleware');

router.get('/', isAuthenticated, isAuthenticatedAdmin, verificationProcess, welcome);

router.get('/cajeros', isAuthenticated, isAuthenticatedAdmin, verificationProcess, renderCajero);
router.get('/allCajero', isAuthenticated, isAuthenticatedAdmin, verificationProcess, allCajero);
router.get('/gerentes', isAuthenticated, isAuthenticatedAdmin, verificationProcess, renderGerente);
router.get('/allGerente', isAuthenticated, isAuthenticatedAdmin, verificationProcess, allGerente);
router.get('/admin', isAuthenticated, isAuthenticatedAdmin, verificationProcess, renderAdmin);
router.get('/allAdmin', isAuthenticated, isAuthenticatedAdmin, verificationProcess, allAdmin);


router.post('/newUser', isAuthenticated, isAuthenticatedAdmin, verificationProcess, newUser);
router.put('/updateUser', isAuthenticated, isAuthenticatedAdmin, verificationProcess, updateUser);
router.post('/newPass', isAuthenticated, isAuthenticatedAdmin, verificationProcess, newPass);
router.post('/changeEst', isAuthenticated, isAuthenticatedAdmin, verificationProcess, changeEstado);

module.exports = router;