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

   renderMesas,
   getAllMesas,
   saveMesa,
   deleteMesa,
   updateMesa,

   allPlatosList,
   saveItem,
   allSales,
   deleteItem,
   updateItem,

   generateInvoce,
   viewPDF,

   renderFacturas,
   getAllInvoice,
   reGenerateInvoice,

} = require('../controllers/cajero.controllers');

const {
   isAuthenticated,
   isAuthenticatedCajero,
   verificationProcess
} = require('../global/middleware');

router.get('/', isAuthenticated, isAuthenticatedCajero, verificationProcess, welcome);

router.get('/category', isAuthenticated, isAuthenticatedCajero, verificationProcess, renderCategorias);
router.get('/allCategorias', isAuthenticated, isAuthenticatedCajero, verificationProcess, getAllCategorias);
router.post('/saveCategory', isAuthenticated, isAuthenticatedCajero, verificationProcess, saveCategory);
router.get('/searchCategory', isAuthenticated, isAuthenticatedCajero, verificationProcess, searchCategory);
router.put('/updateCategory', isAuthenticated, isAuthenticatedCajero, verificationProcess, updateCategory);
router.delete('/deleteCategory', isAuthenticated, isAuthenticatedCajero, verificationProcess, deleteCategory);

router.get('/platos', isAuthenticated, isAuthenticatedCajero, verificationProcess, renderPlatos);
router.get('/allPlatos', isAuthenticated, isAuthenticatedCajero, verificationProcess, getAllPlatos);
router.post('/savePlato', isAuthenticated, isAuthenticatedCajero, verificationProcess, savePlato);
router.get('/searchPlato', isAuthenticated, isAuthenticatedCajero, verificationProcess, searchPlato);
router.put('/updatePlato', isAuthenticated, isAuthenticatedCajero, verificationProcess, updatePlato);
router.delete('/deletePlato', isAuthenticated, isAuthenticatedCajero, verificationProcess, deletePlato);

router.get('/mesa', isAuthenticated, isAuthenticatedCajero, verificationProcess, renderMesas);
router.get('/allMesas', isAuthenticated, isAuthenticatedCajero, verificationProcess, getAllMesas);
router.post('/saveMesa', isAuthenticated, isAuthenticatedCajero, verificationProcess, saveMesa);
router.delete('/deleteMesa', isAuthenticated, isAuthenticatedCajero, verificationProcess, deleteMesa);
router.put('/updateMesa', isAuthenticated, isAuthenticatedCajero, verificationProcess, updateMesa);

router.get('/allPlatosList', isAuthenticated, isAuthenticatedCajero, verificationProcess, allPlatosList);
router.post('/saveItem', isAuthenticated, isAuthenticatedCajero, verificationProcess, saveItem);
router.get('/allSales', isAuthenticated, isAuthenticatedCajero, verificationProcess, allSales);
router.delete('/deleteItem', isAuthenticated, isAuthenticatedCajero, verificationProcess, deleteItem);
router.put('/updateItem', isAuthenticated, isAuthenticatedCajero, verificationProcess, updateItem);

router.get('/generateInvoce', isAuthenticated, isAuthenticatedCajero, verificationProcess, generateInvoce);
router.get('/pdf/:file', isAuthenticated, isAuthenticatedCajero, verificationProcess, viewPDF);

router.get('/invoice', isAuthenticated, isAuthenticatedCajero, verificationProcess, renderFacturas);
router.get('/allInvoices', isAuthenticated, isAuthenticatedCajero, verificationProcess, getAllInvoice);
router.get('/reGenerateInvoice', isAuthenticated, isAuthenticatedCajero, verificationProcess, reGenerateInvoice);

module.exports = router;