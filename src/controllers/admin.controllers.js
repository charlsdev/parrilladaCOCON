const cajeroControllers = {};

require('dotenv').config();

// const {
//    customAlphabet
// } = require('nanoid');
// const nanoidFormat = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
// const path = require('path');
// const fse = require('fs-extra');
// const nodemailer = require('nodemailer');
// const pdf = require('pdf-creator-node');
// const configPDF = require('../helpers/optionsPDF');
const moment = require('moment');
moment.locale('es');

// const UsersModel = require('../models/Users');
// const CategoryModel = require('../models/Categoria');
// const DeskModel = require('../models/Desk');
// const SalesModel = require('../models/Sales');
// const InvoiceModel = require('../models/Invoice');

// const { 
//    validate_letras,
//    validate_numeros,
//    validate_code,
//    validate_cedula,
//    validate_letrasSpace
// } = require('../validations/validations');

cajeroControllers.welcome = (req, res) => {
   const {
      _id,
      cedula,
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('admin/welcome', {
      _id,
      cedula,
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email,
      privilegio,
      estado,
      profile
   });
};

cajeroControllers.renderCategorias = (req, res) => {
   const {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('cajero/categorias', {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   });
};

module.exports = cajeroControllers;