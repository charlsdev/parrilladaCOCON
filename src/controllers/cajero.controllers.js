const cajeroControllers = {};

require('dotenv').config();

const {
   customAlphabet
} = require('nanoid');
const nanoidFormat = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
const path = require('path');
const fse = require('fs-extra');
const nodemailer = require('nodemailer');
const pdf = require('pdf-creator-node');
const configPDF = require('../helpers/optionsPDF');
const moment = require('moment');
moment.locale('es');

const PlatosModel = require('../models/Platos');
const CategoryModel = require('../models/Categoria');
const DeskModel = require('../models/Desk');
const SalesModel = require('../models/Sales');
const InvoiceModel = require('../models/Invoice');

const { 
   validate_letras,
   validate_numeros,
   validate_code,
   validate_cedula,
   validate_letrasSpace
} = require('../validations/validations');

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

   res.render('cajero/welcome', {
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

cajeroControllers.getAllCategorias = async (req, res) => {
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

cajeroControllers.saveCategory = async (req, res) => {
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

cajeroControllers.searchCategory = async (req, res) => {
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

cajeroControllers.updateCategory = async (req, res) => {
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

cajeroControllers.deleteCategory = async (req, res) => {
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

cajeroControllers.renderPlatos = (req, res) => {
   const {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('cajero/plato', {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   });
};

cajeroControllers.getAllPlatos = async (req, res) => {
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

cajeroControllers.savePlato = async (req, res) => {
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

cajeroControllers.searchPlato = async (req, res) => {
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

cajeroControllers.updatePlato = async (req, res) => {
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

cajeroControllers.deletePlato = async (req, res) => {
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

cajeroControllers.renderMesas = (req, res) => {
   const {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('cajero/mesas', {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   });
};

cajeroControllers.getAllMesas = async (req, res) => {
   let allMesas;

   try {
      allMesas = await DeskModel
         .find()
         .select({
            numMesa: 1,
            codigo: 1,
            estado: 1
         })
         .sort({
            numMesa: 'asc'
         })
         .lean();   
      // console.log(allMesas);

      res.send(allMesas);
   } catch (e) {
      console.log(e);
   }
};

cajeroControllers.saveMesa = async (req, res) => {
   let toast = [];
   
   const {
      numMesa,
      estado
   } = req.body;

   let numMesaN = numMesa.trim(),
      estadoN = estado.trim();

   if (
      numMesaN === '' ||
      estadoN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      if (!validate_letras(estadoN)) {
         toast.push({
            tittle: 'Estado incorrecto',
            description: 'El estado es incorrecto...',
            icon: 'error'
         });
      }

      if (!validate_numeros(numMesaN)) {
         toast.push({
            tittle: 'Mesa incorrecta',
            description: 'La mesa a elegir es incorrecta...',
            icon: 'error'
         });
      }

      if (toast.length > 0) {
         res.json({
            toast,
            res: 'toast'
         });
      } else {
         const searchNumMesa = await DeskModel
            .findOne({
               numMesa: numMesaN
            })
            .exec();
         // console.log(searchNumMesa);

         if (searchNumMesa === null) {
            try {
               const fntID = async () => {
                  const IDMesa = nanoidFormat();
                  // console.log(IDMesa);

                  const searchIDMesa = await DeskModel
                     .findOne({
                        codigo: IDMesa
                     })
                     .exec();
                  // console.log(searchIDMesa);
                     
                  const searchIDDeskSale = await SalesModel
                     .find({
                        _codeMesa: IDMesa
                     })
                     .lean()
                     .exec();
                  // console.log(searchIDDeskSale);

                  if (
                     searchIDMesa != null ||
                     searchIDDeskSale.length > 1
                  ) {
                     fntID();
                  } else {
                     const newDesk = new DeskModel({
                        numMesa: numMesaN,
                        codigo: IDMesa,
                        estado: estadoN
                     });
                     // console.log(newDesk);

                     const saveMesa = await newDesk.save();
                     // console.log(saveMesa);

                     if (saveMesa) {
                        res.json({
                           tittle: `Mesa ${estadoN === 'Separar' ? 'separada' : 'reservada'}`,
                           description: `Se ha ${estadoN === 'Separar' ? 'separado' : 'reservado'} la mesa #${numMesaN} con exito!!!`,
                           icon: 'success',
                           res: 'true'
                        });
                     } else {
                        res.json({
                           tittle: `Mesa no ${estadoN === 'Separar' ? 'separada' : 'reservada'}`,
                           description: `No se ha podido ${estadoN.toLowerCase()} la mesa #${numMesaN} con exito!!!`,
                           icon: 'error',
                           res: 'false'
                        });
                     }
                  }
               };
               fntID();
            } catch (e) {
               console.log(e);

               res.json({
                  tittle: 'Problemas',
                  description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
                  icon: 'error',
                  res: 'error'
               });
            }
         } else {
            res.json({
               tittle: 'Mesa ocupada o separada',
               description: `La mesa #${numMesaN} ya se encuentra ocupada o separada!`,
               icon: 'info',
               res: 'false'
            });
         }
      }
   }
};

cajeroControllers.deleteMesa = async (req, res) => {
   let toast = [];
   
   const {
      idMesa,
      numMesa
   } = req.body;

   let idMesaN = idMesa.trim(),
      numMesaN = numMesa.trim();

   if (
      idMesaN === '' ||
      numMesaN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      if (!validate_numeros(numMesaN)) {
         toast.push({
            tittle: 'Mesa incorrecta',
            description: 'La mesa a elegir es incorrecta...',
            icon: 'error'
         });
      }

      if (toast.length > 0) {
         res.json({
            toast,
            res: 'toast'
         });
      } else {
         try {
            const searchMesa = await DeskModel
               .findOne({
                  _id: idMesaN
               })
               .select({
                  codigo: 1
               });
            // console.log(searchMesa);

            if (searchMesa) {
               const searchSales = await SalesModel
                  .find({
                     _codeMesa: searchMesa.codigo
                  })
                  .select({
                     _codeMesa: 1,
                     ventas: 1
                  })
                  .lean()
                  .exec();
               // console.log(searchSales);

               if (searchSales.length === 0 || searchSales[0].ventas.length === 0) {
                  const deleteMesa = await DeskModel
                     .deleteOne({
                        _id: idMesaN
                     });
                  // console.log(deleteMesa);

                  const deleteSale = await SalesModel
                     .deleteOne({
                        _codeMesa: searchMesa.codigo
                     });
                  // console.log(deleteSale);

                  if (
                     deleteMesa.deletedCount >= 1 ||
                     deleteSale.deletedCount >= 1
                  ) {
                     res.json({
                        tittle: `Mesa #${numMesaN} eliminada`,
                        description: `Se ha eliminado la <b>Mesa #${numMesaN}</b> con éxito!!!`,
                        icon: 'success',
                        res: 'true'
                     });
                  } else {
                     res.json({
                        tittle: `Mesa #${numMesaN} no eliminada`,
                        description: `No se ha podido eliminar la <b>Mesa #${numMesaN}</b>!!!`,
                        icon: 'error',
                        res: 'false'
                     });
                  }
               } else {
                  res.json({
                     tittle: 'Mesa no eliminada',
                     description: 'La mesa no se puede eliminar porque tiene procesos de ventas en ejecución!!!',
                     icon: 'error',
                     res: 'false'
                  });
               }
            } else {
               res.json({
                  tittle: 'Mesa no encontrada',
                  description: 'La mesa a eliminar no se encuentra registrada!!!',
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
   }
};

cajeroControllers.updateMesa = async (req, res) => {
   let toast = [];
   
   const {
      idMesa,
      numMesa,
      estado
   } = req.body;

   let idMesaN = idMesa.trim(),
      numMesaN = numMesa.trim(),
      estadoN = estado.trim();

   if (
      idMesaN === '' ||
      numMesaN === '' ||
      estadoN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      if (!validate_numeros(numMesaN)) {
         toast.push({
            tittle: 'Mesa incorrecta',
            description: 'La mesa a elegir es incorrecta...',
            icon: 'error'
         });
      }

      if (!validate_letras(estadoN)) {
         toast.push({
            tittle: 'Estado incorrecto',
            description: 'El estado de la mesa es incorrecta...',
            icon: 'error'
         });
      }

      if (toast.length > 0) {
         res.json({
            toast,
            res: 'toast'
         });
      } else {
         try {
            const searchMesa = await DeskModel
               .findOne({
                  _id: idMesaN
               })
               .select({
                  codigo: 1
               });
            // console.log(searchMesa);

            if (searchMesa) {
               const searchNumMesa = await DeskModel
                  .findOne({
                     numMesa: numMesaN
                  })
                  .select({
                     numMesa: 1
                  });
               // console.log(searchNumMesa);

               if (!searchNumMesa) {
                  const updateMesa = await DeskModel
                     .updateOne({
                        _id: idMesaN
                     }, {
                        $set: {
                           numMesa: numMesaN,
                           estado: estadoN
                        }
                     });
         
                  if (updateMesa.modifiedCount >= 1) {
                     res.json({
                        tittle: `Mesa #${numMesaN} actualizada`,
                        description: `Se ha actualizado la <b>Mesa #${numMesaN}</b> con éxito!!!`,
                        icon: 'error',
                        res: 'true'
                     });
                  } else {
                     res.json({
                        tittle: `Mesa #${numMesaN} no actualizada`,
                        description: `No se ha podido actualizar la <b>Mesa #${numMesaN}</b>!!!`,
                        icon: 'error',
                        res: 'false'
                     });
                  }
               } else {
                  res.json({
                     tittle: 'Mesa no actualizada',
                     description: 'La mesa no se puede actualizar porque ya existe!!!',
                     icon: 'error',
                     res: 'false'
                  });
               }
            } else {
               res.json({
                  tittle: 'Mesa no encontrada',
                  description: 'La mesa a editar no se encuentra registrada!!!',
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
   }
};

cajeroControllers.allPlatosList = async (req, res) => {
   let allPlatos;

   try {
      allPlatos = await PlatosModel
         .find({
            estado: 'Stock'
         })
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

cajeroControllers.saveItem = async (req, res) => {
   let toast = [];
   
   const {
      codeMesa,
      IDPlato,
      cantidadPlato
   } = req.body;

   let codeMesaN = codeMesa.trim(),
      IDPlatoN = IDPlato.trim(),
      cantidadPlatoN = cantidadPlato.trim();

   if (
      codeMesaN === '' ||
      IDPlatoN === '' ||
      cantidadPlatoN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      if (!validate_code(codeMesaN)) {
         toast.push({
            tittle: 'Código incorrecto',
            description: 'El código de la mesa es incorrecto...',
            icon: 'error'
         });
      }

      if (!validate_numeros(cantidadPlatoN)) {
         toast.push({
            tittle: 'Cantidad incorrecta',
            description: 'La cantidad ingresada es incorrecta...',
            icon: 'error'
         });
      }

      if (toast.length > 0) {
         res.json({
            toast,
            res: 'toast'
         });
      } else {
         try {
            const updateDesk = await DeskModel
               .findOneAndUpdate({
                  codigo: codeMesaN
               }, {
                  $set: {
                     estado: 'Ocupada',
                  }
               });
            // console.log(updateDesk);

            if (updateDesk) {
               const findPlato = await PlatosModel
                  .findById({
                     _id: IDPlatoN,
                     estado: 'Stock'
                  })
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
               // console.log(findPlato);
               
               if (findPlato) {
                  const products = {
                     plato: `${findPlato._idCategoría.nomCategoria}: ${findPlato.nomPlato} ${findPlato.acompañado !== '' ? `+ ${findPlato.acompañado}` : ''}`,
                     cantidad: cantidadPlatoN,
                     precioUnit: findPlato.precio,
                     precioPar: findPlato.precio * cantidadPlatoN,
                  };
                  // console.table(products);
                  
                  const saveItems = await SalesModel
                     .updateOne({
                        _codeMesa: codeMesaN
                     }, {
                        $push: {
                           ventas: products
                        }
                     }, {
                        upsert: true
                     });
                  // console.table(saveItems);

                  if (
                     saveItems.modifiedCount > 0 ||
                     saveItems.upsertedCount > 0
                  ) {
                     res.json({
                        tittle: 'Plato vendido',
                        description: 'Se ha vendido el plato con exito!!!',
                        icon: 'success',
                        res: 'true'
                     });
                  } else {
                     res.json({
                        tittle: 'Item no guardado',
                        description: 'Opss! No se ha podido vender el plato. Inténtalo mas luego.',
                        icon: 'info',
                        res: 'false'
                     });
                  }

               } else {
                  res.json({
                     tittle: 'Plato no encontrado',
                     description: 'Opss! El plato a vender no esta registrado o no está en stock.',
                     icon: 'warning',
                     res: 'false'
                  });
               }
            } else {
               res.json({
                  tittle: 'Mesa no encontrada',
                  description: 'Opss! EL codigo de la mesa es incorrecto o no está registrada.',
                  icon: 'warning',
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
   }
};

cajeroControllers.allSales = async (req, res) => {
   const {
      codeMesa
   } = req.query;

   let allSales;

   try {
      allSales = await SalesModel
         .findOne({
            _codeMesa: codeMesa
         })
         .select({
            _codeMesa: 1,
            ventas: 1
         })
         .lean();
         
      // console.table(allSales.ventas);
      res.send(allSales);
   } catch (e) {
      console.log(e);
   }
};

cajeroControllers.deleteItem = async (req, res) => {
   const {
      idItem,
      idSale
   } = req.body;

   let idItemN = idItem.trim(),
      idSaleN = idSale.trim();

   if (
      idItemN === '' ||
      idSaleN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const deleteItem = await SalesModel
            .updateOne({
               _id: idSaleN
            }, {
               $pull: {
                  ventas: {
                     _id: idItemN
                  }
               }
            });
         // console.table(deleteItem);

         if (deleteItem.modifiedCount >= 1) {
            res.json({
               tittle: 'Item eliminado',
               description: 'Se ha eliminado el ítem con éxito!!!',
               icon: 'success',
               res: 'true'
            });
         } else {
            res.json({
               tittle: 'Item no encontrada',
               description: 'No se ha podido eliminar el ítem seleccionado!!!',
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

cajeroControllers.updateItem = async (req, res) => {
   let toast = [];

   const {
      idSale,
      codeMesa,
      idItem,
      cantidadEdit
   } = req.body;

   let idSaleN = idSale.trim(),
      codeMesaN = codeMesa.trim(),
      idItemN = idItem.trim(),
      cantidadEditN = cantidadEdit.trim();

   if (
      idSaleN === '' ||
      codeMesaN === '' ||
      idItemN === '' ||
      cantidadEditN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      if (!validate_numeros(cantidadEditN)) {
         toast.push({
            tittle: 'Cantidad incorrecta',
            description: 'La cantidad es incorrecta...',
            icon: 'error'
         });
      }

      if (toast.length > 0) {
         res.json({
            toast,
            res: 'toast'
         });
      } else {
         try {
            const verifyDeskItem = await DeskModel
               .findOne({
                  codigo: codeMesaN
               })
               .select({
                  numMesa: 1,
                  codigo: 1,
                  estado: 1
               });
            // console.log(verifyDeskItem);

            if (verifyDeskItem) {
               const verifySale = await SalesModel
                  .findOne({
                     _id: idSaleN,
                     _codeMesa: codeMesaN
                  })
                  .select({
                     _codeMesa: 1,
                     ventas: 1
                  });
               // console.log(verifySale);

               if (verifySale) {
                  let items;
                  
                  verifySale.ventas.forEach(item => {
                     if (item._id.equals(idItemN)) items = item;
                  });
                  // console.log(items);

                  if (items) {
                     const updateItem = {
                        plato: items.plato,
                        cantidad: cantidadEdit,
                        precioUnit: items.precioUnit,
                        precioPar: items.precioUnit * cantidadEdit
                     };
                     // console.log(updateItem);
                     
                     /**
                      * ? Actualizar un objeto de un array - MongoDB
                      */
                     const updateItemSale = await SalesModel
                        .updateOne({
                           _id: idSaleN,
                           _codeMesa: codeMesaN
                        }, {
                           $set: {
                              'ventas.$[elem]': updateItem
                           }
                        }, {
                           arrayFilters: [{
                              'elem._id': {
                                 $eq: idItemN
                              }
                           }]
                        });
                     // console.log(updateItemSale);

                     if (updateItemSale.modifiedCount >= 1) {
                        res.json({
                           tittle: 'Item actualizado',
                           description: `Se ha actualizado la cantidad del plato <b>${updateItem.plato}</b> a <b>${updateItem.cantidad}</b> con éxito!!!`,
                           icon: 'true',
                           res: 'true'
                        });
                     } else {
                        res.json({
                           tittle: 'Item no actualizado',
                           description: `No se ha podido actualizar la cantidad del plato <b>${updateItem.plato}</b>!!!`,
                           icon: 'error',
                           res: 'false'
                        });
                     }
                  } else {
                     res.json({
                        tittle: 'Item no encontrado',
                        description: 'Opss! El item a modificar no ha sido encontrado!',
                        icon: 'error',
                        res: 'false'
                     });
                  }
               } else {
                  res.json({
                     tittle: 'Venta no encontrada',
                     description: 'Opss! La venta no se encuentra registrada!',
                     icon: 'error',
                     res: 'false'
                  });
               }
            } else {
               res.json({
                  tittle: 'Mesa no encontrada',
                  description: 'Opss! La mesa no se encuentra registrada!',
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
   }
};

cajeroControllers.generateInvoce = async (req, res) => {
   let toast = [];

   const {
      id,
      codeMesa,
      numMesa,
      cedulaCliente,
      nameCliente,
      emailCliente
   } = req.query;

   let IDN = id.trim(),
      codeMesaN = codeMesa.trim(),
      numMesaN = numMesa.trim(),
      cedulaClienteN = cedulaCliente.trim(),
      nameClienteN = nameCliente.trim(),
      emailClienteN = emailCliente.trim();

   if (
      IDN === '' ||
      codeMesaN === '' ||
      numMesaN === '' ||
      cedulaClienteN === '' ||
      nameClienteN === '' ||
      emailClienteN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {   
      if (!validate_cedula(cedulaClienteN)) {
         toast.push({
            tittle: 'Cédula incorrecta',
            description: 'La cédula que ingresó es incorrecta...',
            icon: 'error'
         });
      }

      if (!validate_letrasSpace(nameClienteN)) {
         toast.push({
            tittle: 'Formato incorrecto',
            description: 'El campo nombre no cumpl el formato requerido...',
            icon: 'error'
         });
      }

      if (!validate_numeros(numMesaN)) {
         toast.push({
            tittle: 'Mesa incorrecta',
            description: 'El número de mesa es incorrecta...',
            icon: 'error'
         });
      }
   
      if (toast.length > 0) {
         res.json({
            toast,
            res: 'toast'
         });
      } else {
         try {
            const searchDesk = await DeskModel
               .findOne({
                  _id: IDN,
                  numMesa: numMesaN,
                  codigo: codeMesaN
               })
               .select({
                  numMesa: 1,
                  codigo: 1,
                  estado: 1
               });

            if (searchDesk) {
               const searchSales = await SalesModel
                  .find({
                     _codeMesa: searchDesk.codigo
                  })
                  .select({
                     _codeMesa: 1,
                     ventas: 1
                  })
                  .lean()
                  .exec();
               // console.log(searchSales);

               if (searchSales.length === 0) {
                  res.json({
                     tittle: 'Factura no generada',
                     description: 'No se ha podido generar la factura porque no se ha hecho ninguna compra!!!',
                     icon: 'warning',
                     res: 'false'
                  });
               } else {
                  if (searchSales[0].ventas.length === 0) {
                     res.json({
                        tittle: 'Factura no generada',
                        description: 'No se ha podido generar la factura porque no se ha hecho ninguna compra!!!',
                        icon: 'warning',
                        res: 'false'
                     });
                  } else {
                     var total = 0, 
                        iva, 
                        precioPar, 
                        items = searchSales[0].ventas,
                        products = [];
                     
                     items.forEach(item => {
                        total += +item.precioPar;
                     });
                     
                     iva = total.toFixed(2) * 0.12;
                     precioPar = total.toFixed(2) - iva.toFixed(2);

                     iva = iva.toFixed(2);
                     precioPar = precioPar.toFixed(2);
                     total = total.toFixed(2);

                     const newInvoce = new InvoiceModel({
                        _idVendedor: req.user._id,
                        _codeMesa: searchDesk.codigo,
                        cedula: cedulaClienteN,
                        nomCliente: nameClienteN,
                        fecha: moment().format('L'),
                        anio: moment().format('yyyy'),
                        email: emailClienteN,
                        subtotal: precioPar,
                        iva: iva,
                        total: total,
                     });

                     const saveInvoce = await newInvoce.save();

                     if (saveInvoce) {
                        await DeskModel
                           .deleteOne({
                              codigo: searchDesk.codigo
                           });

                        /**
                         * ? Generate PDF
                         */
                        items.forEach(item => {
                           products.push(
                              {
                                 plato: item.plato,
                                 cantidad: item.cantidad,
                                 precioUnit: parseFloat(item.precioUnit).toFixed(2),
                                 precioPar: parseFloat(item.precioPar).toFixed(2)
                              }
                           );
                        });
                        
                        const allData = {
                           _codeMesa: searchDesk.codigo,
                           cedula: cedulaClienteN,
                           nomCliente: nameClienteN,
                           fecha: moment().format('ll'),
                           email: emailClienteN,
                           items: products,
                           subtotal: precioPar.toFixed(2),
                           iva: iva.toFixed(2),
                           total: total.toFixed(2),
                        };
                        // console.log(allData);

                        const html = fse.readFileSync(path.join(__dirname, '../template/docs/factura.html'), 'utf-8');
                        // const filename = 'ParrilladasCOCON - ' + moment().format('MMM D, YYYY').replace(/\b\w/g, l => l.toUpperCase()) + ' - ' + searchDesk.codigo + '.pdf';
                        const filename = 'ParrilladasCOCON - ' + searchDesk.codigo + '.pdf';

                        const document = {
                           html: html,
                           data: {
                              allData
                           },
                           path: path.join(__dirname, '../docs/') + filename
                        };

                        let data;
                        
                        try {
                           data = await pdf.create(document, configPDF);
                           path.join(__dirname, '../docs/' + filename);
                           // console.log(data);
                        } catch (e) {
                           console.log(e);
                        }

                        try {
                           const transporte = nodemailer
                              .createTransport({
                                 host: 'mail.privateemail.com',
                                 port: 587,
                                 secure: false,
                                 auth: {
                                    user: `${process.env.userMail}`,
                                    pass: `${process.env.passMail}`
                                 },
                                 tls: {
                                    rejectUnauthorized: false
                                 }
                              });
                           
                           const info = await transporte
                              .sendMail({
                                 from: `'Parrillada COCON' <${process.env.userMail}>`,
                                 to: emailClienteN,
                                 subject: 'Factura consumida',
                                 html: require('../template/emails/facturaFinal.tmp')({
                                    nameUser: `${nameClienteN}`,
                                    numFactura: `${searchDesk.codigo}`,
                                    valorTot: `${total.toFixed(2)}`
                                 }),
                                 attachments: [{
                                    filename: `${filename}`,
                                    path: path.join(__dirname, `../docs/${filename}`),
                                    contentType: 'application/pdf'
                                 }]
                              });
                           
                           console.log(info.response);
                        } catch (e) {
                           console.log(e);
                        }
                        
                        if (data) {
                           res.json({
                              tittle: 'Factura generada',
                              description: 'Se ha generado la factura con éxito!!!',
                              icon: 'success',
                              res: 'true',
                              filename
                           });
                        } else {
                           res.json({
                              tittle: 'Factura no generada',
                              description: 'Opss! No se podido generar la factura. ¡Intentelo más luego!',
                              icon: 'error',
                              res: 'false'
                           });
                        }
                     } else {
                        res.json({
                           tittle: 'Factura no generada',
                           description: 'Opss! No se podido generar la factura. ¡Intentelo más luego!',
                           icon: 'error',
                           res: 'false'
                        });
                     }
                  }
               }
            } else {
               res.json({
                  tittle: 'Mesa no encontrada',
                  description: 'La mesa no existe o no esta registrada!!!',
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
   }
};

cajeroControllers.viewPDF = (req, res) => {
   const {
      file
   } = req.params;

   res.render('cajero/pdf', { file });
};

cajeroControllers.renderFacturas = (req, res) => {
   const {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('cajero/facturas', {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   });
};

cajeroControllers.getAllInvoice = async (req, res) => {
   let allInvoice;

   try {
      allInvoice = await InvoiceModel
         .find()
         .select({
            _codeMesa: 1,
            cedula: 1,
            nomCliente: 1,
            fecha: 1,
            _idVendedor: 1,
            total: 1,
         })
         .populate({
            path: '_idVendedor',
            select: 'apellidos nombres'
         })
         .sort({
            fecha: 1
         })
         .lean()
         .exec();
         
      res.send(allInvoice);
   } catch (e) {
      console.log(e);
   }
};

cajeroControllers.reGenerateInvoice = async (req, res) => {
   const {
      codeMesa
   } = req.query;

   let codeMesaN = codeMesa.trim();

   if (
      codeMesaN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {   
      try {
         const searchSales = await SalesModel
            .findOne({
               _codeMesa: codeMesaN
            })
            .select({
               _codeMesa: 1,
               ventas: 1
            })
            .lean()
            .exec();
         // console.log(searchSales);

         if (!searchSales) {
            res.json({
               tittle: 'Factura no encontrada',
               description: 'La factura a generar no tiene ninguna compra o no existe!!!',
               icon: 'info',
               res: 'false'
            });
         } else {
            if (searchSales.ventas.length === 0) {
               res.json({
                  tittle: 'Factura no generada',
                  description: 'No se ha podido generar la factura porque no se ha hecho ninguna compra!!!',
                  icon: 'warning',
                  res: 'false'
               });
            } else {
               const searchInvoice = await InvoiceModel
                  .findOne({
                     _codeMesa: codeMesaN
                  })
                  .select({
                     _idVendedor: 1,
                     _codeMesa: 1,
                     cedula: 1,
                     nomCliente: 1,
                     fecha: 1,
                     email: 1,
                     subtotal: 1,
                     iva: 1,
                     total: 1
                  })
                  .lean()
                  .exec();
               // console.log(searchInvoice);
               
               if (searchInvoice) {
                  let products = [];

                  /**
                   * ? Generate PDF
                   */
                  searchSales.ventas.forEach(item => {
                     products.push({
                        plato: item.plato,
                        cantidad: item.cantidad,
                        precioUnit: parseFloat(item.precioUnit).toFixed(2),
                        precioPar: parseFloat(item.precioPar).toFixed(2)
                     });
                  });
                  
                  const allData = {
                     _codeMesa: searchInvoice._codeMesa,
                     cedula: searchInvoice.cedula,
                     nomCliente: searchInvoice.nomCliente,
                     fecha: moment(new Date(searchInvoice.fecha)).format('ll'),
                     email: searchInvoice.email,
                     items: products,
                     subtotal: parseFloat(searchInvoice.subtotal).toFixed(2),
                     iva: parseFloat(searchInvoice.iva).toFixed(2),
                     total: parseFloat(searchInvoice.total).toFixed(2),
                  };
                  // console.log(allData);

                  const html = fse.readFileSync(path.join(__dirname, '../template/docs/factura.html'), 'utf-8');
                  const filename = 'ParrilladasCOCON - ' + searchInvoice._codeMesa + '.pdf';

                  const document = {
                     html: html,
                     data: {
                        allData
                     },
                     path: path.join(__dirname, '../docs/') + filename
                  };

                  let data;
                  
                  try {
                     data = await pdf.create(document, configPDF);
                     path.join(__dirname, '../docs/' + filename);
                     // console.log(data);
                  } catch (e) {
                     console.log(e);
                  }
                  
                  if (data) {
                     res.json({
                        tittle: 'Factura generada',
                        description: 'Se ha generado la factura con éxito!!!',
                        icon: 'success',
                        res: 'true',
                        filename
                     });
                  } else {
                     res.json({
                        tittle: 'Factura no generada',
                        description: 'Opss! No se podido generar la factura. ¡Intentelo más luego!',
                        icon: 'error',
                        res: 'false'
                     });
                  }
               } else {
                  res.json({
                     tittle: 'Factura no generada',
                     description: 'Opss! No se podido generar la factura. ¡Intentelo más luego!',
                     icon: 'error',
                     res: 'false'
                  });
               }
            }
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

module.exports = cajeroControllers;