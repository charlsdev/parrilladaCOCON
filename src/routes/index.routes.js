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

   exitLogout
} = require('../controllers/index.controllers');

const {
   isAuthenticated,
   isNotAuthenticated,
   isAuthenticatedAllPriv
} = require('../global/middleware');

router.get('/', isNotAuthenticated, login);
router.post('/login', loginAuth);

router.get('/verification', isAuthenticated, isAuthenticatedAllPriv, verification);

router.get('/profile', isAuthenticated, isAuthenticatedAllPriv, renderProfile);
router.put('/profile', isAuthenticated, isAuthenticatedAllPriv, updateDataProfile);
router.post('/photoProfile', isAuthenticated, isAuthenticatedAllPriv, tempFolder.single('photoProfile'), changePhotoProfile);

router.get('/password', isAuthenticated, isAuthenticatedAllPriv, renderChangePassword);
router.post('/password', isAuthenticated, isAuthenticatedAllPriv, changePassword);

router.get('/exit', isAuthenticated, isAuthenticatedAllPriv, exitLogout);

module.exports = router;