const { Router } = require('express');
const router = Router();

const {
   welcome,

   renderCategorias,
   getAllCategorias,
   saveCategory,
   searchCategory,
   updateCategory,
   deleteCategory,

   renderPlatos,
   getAllPlatos,
   savePlato,
   searchPlato,
   updatePlato,
   deletePlato,

} = require('../controllers/gerente.controllers');

const {
   isAuthenticated,
   verificationProcess,
   isAuthenticatedGerente
} = require('../global/middleware');

router.get('/', isAuthenticated, isAuthenticatedGerente, verificationProcess, welcome);

router.get('/category', isAuthenticated, isAuthenticatedGerente, verificationProcess, renderCategorias);
router.get('/allCategorias', isAuthenticated, isAuthenticatedGerente, verificationProcess, getAllCategorias);
router.post('/saveCategory', isAuthenticated, isAuthenticatedGerente, verificationProcess, saveCategory);
router.get('/searchCategory', isAuthenticated, isAuthenticatedGerente, verificationProcess, searchCategory);
router.put('/updateCategory', isAuthenticated, isAuthenticatedGerente, verificationProcess, updateCategory);
router.delete('/deleteCategory', isAuthenticated, isAuthenticatedGerente, verificationProcess, deleteCategory);

router.get('/platos', isAuthenticated, isAuthenticatedGerente, verificationProcess, renderPlatos);
router.get('/allPlatos', isAuthenticated, isAuthenticatedGerente, verificationProcess, getAllPlatos);
router.post('/savePlato', isAuthenticated, isAuthenticatedGerente, verificationProcess, savePlato);
router.get('/searchPlato', isAuthenticated, isAuthenticatedGerente, verificationProcess, searchPlato);
router.put('/updatePlato', isAuthenticated, isAuthenticatedGerente, verificationProcess, updatePlato);
router.delete('/deletePlato', isAuthenticated, isAuthenticatedGerente, verificationProcess, deletePlato);

// router.get('/cajeros', isAuthenticated, isAuthenticatedGerente, verificationProcess,renderCajero);
// router.get('/allCajero', isAuthenticated, isAuthenticatedGerente, verificationProcess,allCajero);
// router.get('/gerentes', isAuthenticated, isAuthenticatedGerente, verificationProcess,renderGerente);
// router.get('/allGerente', isAuthenticated, isAuthenticatedGerente, verificationProcess,allGerente);
// router.get('/admin', isAuthenticated, isAuthenticatedGerente, verificationProcess,renderAdmin);
// router.get('/allAdmin', isAuthenticated, isAuthenticatedGerente, verificationProcess,allAdmin);


// router.post('/newUser', isAuthenticated, isAuthenticatedGerente, verificationProcess,newUser);
// router.put('/updateUser', isAuthenticated, isAuthenticatedGerente, verificationProcess,updateUser);
// router.post('/newPass', isAuthenticated, isAuthenticatedGerente, verificationProcess,newPass);
// router.post('/changeEst', isAuthenticated, isAuthenticatedGerente, verificationProcess,changeEstado);

module.exports = router;