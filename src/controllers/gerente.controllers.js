const gerenteControllers = {};

require('dotenv').config();

// const nodemailer = require('nodemailer');
// const { customAlphabet } = require('nanoid');
// const nanoidAl = customAlphabet('1234567890_-abcdefghijklmnopqrstuvwxyz', 8);
const moment = require('moment');
moment.locale('es');

const UsersModel = require('../models/Users');
const InvoiceModel = require('../models/Invoice');
const ExpensesModel = require('../models/Expenses');
const PlatosModel = require('../models/Platos');
const CategoryModel = require('../models/Categoria');

// const { 
//    validate_letras,
//    validate_telefono,
//    validate_cedula,
//    validate_letrasSpace,
//    validate_email,
//    validate_fecha
// } = require('../validations/validations');

gerenteControllers.welcome = async (req, res) => {
   let adm = 0, caj = 0, ventas, sumV = 0, gastos, sumG = 0;

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

   try {
      adm = await UsersModel
         .find({
            privilegio: 'Administrador'
         })
         .countDocuments();
   } catch (e) {
      console.log(e);
   }

   try {
      caj = await UsersModel
         .find({
            privilegio: 'Cajero'
         })
         .countDocuments();
   } catch (e) {
      console.log(e);
   }

   try {
      ventas = await InvoiceModel
         .find()
         .select({
            total: 1
         })
         .lean();
      
      ventas.forEach(item => {
         sumV += +(item.total);
      });
   } catch (e) {
      console.log(e);
   }

   try {
      gastos = await ExpensesModel
         .find()
         .select({
            total: 1
         })
         .lean();
      
      gastos.forEach(item => {
         sumG += +(item.total);
      });
   } catch (e) {
      console.log(e);
   }

   res.render('gerente/welcome', {
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
      profile,
      caj, adm, sumV, sumG, tot: sumV - sumG
   });
};

gerenteControllers.renderCategorias = (req, res) => {
   const {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('gerente/categorias', {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   });
};

gerenteControllers.getAllCategorias = async (req, res) => {
   let allCategorias;

   try {
      allCategorias = await CategoryModel
         .find()
         .select({
            nomCategoria: 1
         })
         .lean()
         .exec();
         
      res.send(allCategorias);
   } catch (e) {
      console.log(e);
   }
};

gerenteControllers.saveCategory = async (req, res) => {
   const {
      nomCategoria
   } = req.body;

   let nomCategoriaN = nomCategoria.trim();

   if (nomCategoriaN === '') {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const newCategory = new CategoryModel({
            nomCategoria: nomCategoriaN
         });

         const saveCategory = await newCategory.save();
         
         if (saveCategory) {
            res.json({
               tittle: 'Categoría registrada',
               description: 'Se ha registrado la categoría con exito!!!',
               icon: 'success',
               res: 'true'
            });
         } else {
            res.json({
               tittle: 'Categoría no registrada',
               description: 'No se ha podido registrar la categoría!!!',
               icon: 'error',
               res: 'false'
            });
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error'
         });
      }
   }
};

gerenteControllers.searchCategory = async (req, res) => {
   const {
      idCategory
   } = req.query;

   let idCategoryN = idCategory.trim();

   if (idCategoryN === '') {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const searchCategory = await CategoryModel
            .findById({
               _id: idCategoryN
            })
            .select({
               nomCategoria: 1
            });
         
         if (searchCategory) {
            res.json({
               res: 'true',
               data: searchCategory
            });
         } else {
            res.json({
               tittle: 'Categoría no registrada',
               description: 'No se ha podido registrar la categoría!!!',
               icon: 'error',
               res: 'false'
            });
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error'
         });
      }
   }
};

gerenteControllers.updateCategory = async (req, res) => {
   const {
      idCategory,
      nomCategoria
   } = req.body;

   let idCategoryN = idCategory.trim(),
      nomCategoriaN = nomCategoria.trim();

   if (
      idCategoryN === '' ||
      nomCategoriaN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const updateCategory = await CategoryModel
            .updateOne({
               _id: idCategoryN
            }, {
               $set: {
                  nomCategoria: nomCategoriaN
               }
            });
         
         if (updateCategory.modifiedCount >= 1) {
            res.json({
               tittle: 'Categoría actualizada',
               description: 'Se ha actualizado la categoría con éxito!!!',
               icon: 'error',
               res: 'true'
            });
         } else {
            res.json({
               tittle: 'Categoría no actualizada',
               description: 'No se ha podido actualizar la categoría!!!',
               icon: 'error',
               res: 'false'
            });
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error'
         });
      }
   }
};

gerenteControllers.deleteCategory = async (req, res) => {
   const {
      idCategory
   } = req.body;

   let idCategoryN = idCategory.trim();

   if (
      idCategoryN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const deleteCategory = await CategoryModel
            .deleteOne({
               _id: idCategoryN
            });
            // console.log(deleteCategory);
         
         if (deleteCategory.deletedCount >= 1) {
            res.json({
               tittle: 'Categoría eliminada',
               description: 'Se ha eliminado la categoría con éxito!!!',
               icon: 'error',
               res: 'true'
            });
         } else {
            res.json({
               tittle: 'Categoría no eliminada',
               description: 'No se ha podido eliminar la categoría!!!',
               icon: 'error',
               res: 'false'
            });
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error'
         });
      }
   }
};

gerenteControllers.renderPlatos = (req, res) => {
   const {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('gerente/plato', {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   });
};

gerenteControllers.getAllPlatos = async (req, res) => {
   let allPlatos;

   try {
      allPlatos = await PlatosModel
         .find()
         .select({
            _idCategoría: 1,
            nomPlato: 1,
            acompañado: 1,
            precio: 1,
            estado: 1
         })
         .lean()
         .populate({
            path: '_idCategoría',
            select: 'nomCategoria'
         });
         
      // console.log(allPlatos);
      res.send(allPlatos);
   } catch (e) {
      console.log(e);
   }
};

gerenteControllers.savePlato = async (req, res) => {
   const {
      categoria,
      tipoPlato,
      acompañadoPlato,
      precioPlato,
      estado
   } = req.body;

   let categoriaN = categoria.trim(),
      tipoPlatoN = tipoPlato.trim(),
      acompañadoPlatoN = acompañadoPlato.trim(),
      precioPlatoN = precioPlato.trim(),
      estadoN = estado.trim();

   if (
      categoriaN === '' ||
      tipoPlatoN === '' ||
      precioPlatoN === '' ||
      estadoN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const newPlato = new PlatosModel({
            _idCategoría: categoriaN,
            nomPlato: tipoPlatoN,
            acompañado: acompañadoPlatoN,
            precio: precioPlatoN,
            estado: estadoN
         });

         const savePlato = await newPlato.save();
         
         if (savePlato) {
            res.json({
               tittle: 'Plato registrado',
               description: 'Se ha registrado el plato con exito!!!',
               icon: 'success',
               res: 'true'
            });
         } else {
            res.json({
               tittle: 'Plato no registrado',
               description: 'No se ha podido registrar el plato!!!',
               icon: 'error',
               res: 'false'
            });
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error'
         });
      }
   }
};

gerenteControllers.searchPlato = async (req, res) => {
   const {
      idPlato
   } = req.query;

   let idPlatoN = idPlato.trim();

   if (idPlatoN === '') {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const searchPlato = await PlatosModel
            .findById({
               _id: idPlatoN
            })
            .select({
               _idCategoría: 1,
               nomPlato: 1,
               acompañado: 1,
               precio: 1,
               estado: 1
            });
         // console.log(searchPlato);
         
         if (searchPlato) {
            res.json({
               res: 'true',
               data: searchPlato
            });
         } else {
            res.json({
               tittle: 'Plato no registrado',
               description: 'El plato a editar no se encuentra registrado!!!',
               icon: 'error',
               res: 'false'
            });
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error'
         });
      }
   }
};

gerenteControllers.updatePlato = async (req, res) => {
   const {
      idPlato,
      categoria,
      tipoPlato,
      acompañadoPlato,
      precioPlato,
      estado
   } = req.body;

   let idPlatoN = idPlato.trim(),
      categoriaN = categoria.trim(),
      tipoPlatoN = tipoPlato.trim(),
      acompañadoPlatoN = acompañadoPlato.trim(),
      precioPlatoN = precioPlato.trim(),
      estadoN = estado.trim();

   if (
      idPlatoN === '' ||
      categoriaN === '' ||
      tipoPlatoN === '' ||
      precioPlatoN === '' ||
      estadoN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const updateCategory = await PlatosModel
            .updateOne({
               _id: idPlatoN
            }, {
               $set: {
                  _idCategoría: categoriaN,
                  nomPlato: tipoPlatoN,
                  acompañado: acompañadoPlatoN,
                  precio: precioPlatoN,
                  estado: estadoN
               }
            });
         
         if (updateCategory.modifiedCount >= 1) {
            res.json({
               tittle: 'Plato actualizado',
               description: 'Se ha actualizado el plato con éxito!!!',
               icon: 'error',
               res: 'true'
            });
         } else {
            res.json({
               tittle: 'Plato no actualizado',
               description: 'No se ha podido actualizar el plato!!!',
               icon: 'error',
               res: 'false'
            });
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error'
         });
      }
   }
};

gerenteControllers.deletePlato = async (req, res) => {
   const {
      idPlato
   } = req.body;

   let idPlatoN = idPlato.trim();

   if (
      idPlatoN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const platoDelete = await PlatosModel
            .deleteOne({
               _id: idPlatoN
            });
         // console.log(platoDelete);
         
         if (platoDelete.deletedCount >= 1) {
            res.json({
               tittle: 'Plato eliminado',
               description: 'Se ha eliminado el plato con éxito!!!',
               icon: 'error',
               res: 'true'
            });
         } else {
            res.json({
               tittle: 'Plato no eliminado',
               description: 'No se ha podido eliminar el plato!!!',
               icon: 'error',
               res: 'false'
            });
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error'
         });
      }
   }
};


module.exports = gerenteControllers;