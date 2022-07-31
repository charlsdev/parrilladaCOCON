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

   renderChangePassword,
   changePassword,

   renderPlatos,

   exitLogout,
} = require('../controllers/index.controllers');

const {
   isAuthenticated,
   isNotAuthenticated,
   isAuthenticatedAllPriv,
   verificationProcess
} = require('../global/middleware');

router.get('/', isNotAuthenticated, login);
router.post('/login', loginAuth);

router.get('/verification', isAuthenticated, isAuthenticatedAllPriv, verification);

router.get('/profile', isAuthenticated, isAuthenticatedAllPriv, verificationProcess, renderProfile);
router.put('/profile', isAuthenticated, isAuthenticatedAllPriv, verificationProcess, updateDataProfile);
router.post('/photoProfile', isAuthenticated, isAuthenticatedAllPriv, verificationProcess, tempFolder.single('photoProfile'), changePhotoProfile);

router.get('/password', isAuthenticated, isAuthenticatedAllPriv, renderChangePassword);
router.post('/password', isAuthenticated, isAuthenticatedAllPriv, changePassword);

router.get('/cartola', renderPlatos);

router.get('/exit', isAuthenticated, isAuthenticatedAllPriv, exitLogout);

module.exports = router;