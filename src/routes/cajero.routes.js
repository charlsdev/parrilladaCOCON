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
   getAllPlatos

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

router.get('/products', isAuthenticated, isAuthenticatedCajero, renderPlatos);
router.get('/allProducts', isAuthenticated, isAuthenticatedCajero, getAllPlatos);

module.exports = router;