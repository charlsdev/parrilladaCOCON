const { Router } = require('express');
const router = Router();

const {
   tempFolder
} = require('../global/createFolder');

const { 
   login,
   loginAuth,

   verification,

   renderProfile,
   updateDataProfile,
   changePhotoProfile,

   exitLogout
} = require('../controllers/index.controllers');

const {
   isAuthenticated,
   isNotAuthenticated
} = require('../global/middleware');

router.get('/', isNotAuthenticated, login);
router.post('/login', loginAuth);

router.get('/verification', isAuthenticated, verification);

router.get('/profile', isAuthenticated, renderProfile);
router.put('/profile', isAuthenticated, updateDataProfile);
router.post('/photoProfile', isAuthenticated, tempFolder.single('photoProfile'), changePhotoProfile);

router.get('/exit', isAuthenticated, exitLogout);

module.exports = router;