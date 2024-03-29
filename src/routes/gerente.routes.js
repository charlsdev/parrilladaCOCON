const { Router } = require('express');
const router = Router();

const {
   welcome,

   renderCajero,
   allCajero,
   newUser,
   updateUser,
   changeEstado,

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

   renderGastos,
   allGastos,
   saveGasto,
   updateGasto,
   deleteGasto,

   renderReportes,
   allVentasAnuales,
   allGastosAnuales,

   renderMensuales,
   allGanancias,

} = require('../controllers/gerente.controllers');

const {
   isAuthenticated,
   verificationProcess,
   isAuthenticatedGerente
} = require('../global/middleware');

router.get('/', isAuthenticated, isAuthenticatedGerente, verificationProcess, welcome);

router.get('/cajeros', isAuthenticated, isAuthenticatedGerente, verificationProcess, renderCajero);
router.get('/allCajero', isAuthenticated, isAuthenticatedGerente, verificationProcess, allCajero);
router.post('/newUser', isAuthenticated, isAuthenticatedGerente, verificationProcess, newUser);
router.put('/updateUser', isAuthenticated, isAuthenticatedGerente, verificationProcess, updateUser);
router.post('/changeEst', isAuthenticated, isAuthenticatedGerente, verificationProcess, changeEstado);

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

router.get('/gastos', isAuthenticated, isAuthenticatedGerente, verificationProcess, renderGastos);
router.get('/allGastos', isAuthenticated, isAuthenticatedGerente, verificationProcess, allGastos);
router.post('/saveGasto', isAuthenticated, isAuthenticatedGerente, verificationProcess, saveGasto);
router.put('/updateGasto', isAuthenticated, isAuthenticatedGerente, verificationProcess, updateGasto);
router.delete('/deleteGasto', isAuthenticated, isAuthenticatedGerente, verificationProcess, deleteGasto);

router.get('/reportes', isAuthenticated, isAuthenticatedGerente, verificationProcess, renderReportes);
router.get('/allVentasAnuales', isAuthenticated, isAuthenticatedGerente, verificationProcess, allVentasAnuales);
router.get('/allGastosAnuales', isAuthenticated, isAuthenticatedGerente, verificationProcess, allGastosAnuales);

router.get('/mensuales', isAuthenticated, isAuthenticatedGerente, verificationProcess, renderMensuales);
router.get('/allGanancias/:inicio/:fin', isAuthenticated, isAuthenticatedGerente, verificationProcess, allGanancias);

module.exports = router;