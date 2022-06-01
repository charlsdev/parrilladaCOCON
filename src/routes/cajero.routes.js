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
   updatePlato

} = require('../controllers/cajero.controllers');

const {
   isAuthenticated,
   isAuthenticatedCajero
} = require('../global/middleware');

router.get('/', isAuthenticated, isAuthenticatedCajero, welcome);

router.get('/category', isAuthenticated, isAuthenticatedCajero, renderCategorias);
router.get('/allCategorias', isAuthenticated, isAuthenticatedCajero, getAllCategorias);
router.post('/saveCategory', isAuthenticated, isAuthenticatedCajero, saveCategory);
router.get('/searchCategory', isAuthenticated, isAuthenticatedCajero, searchCategory);
router.put('/updateCategory', isAuthenticated, isAuthenticatedCajero, updateCategory);
router.delete('/deleteCategory', isAuthenticated, isAuthenticatedCajero, deleteCategory);

router.get('/platos', isAuthenticated, isAuthenticatedCajero, renderPlatos);
router.get('/allPlatos', isAuthenticated, isAuthenticatedCajero, getAllPlatos);
router.post('/savePlato', isAuthenticated, isAuthenticatedCajero, savePlato);
router.get('/searchPlato', isAuthenticated, isAuthenticatedCajero, searchPlato);
router.put('/updatePlato', isAuthenticated, isAuthenticatedCajero, updatePlato);

module.exports = router;