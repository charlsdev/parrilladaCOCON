const path = require('path');
const multer = require('multer');

const tempFolder = multer({
   dest: path.join(__dirname, '../public/temp')
});

multer({
   dest: path.join(__dirname, '../public/slider')
});

multer({
   dest: path.join(__dirname, '../public/docs')
});

multer({
   dest: path.join(__dirname, '../docs')
});

module.exports = {
   tempFolder
};