const gerenteControllers = {};

require('dotenv').config();

const nodemailer = require('nodemailer');
const moment = require('moment');
moment.locale('es');

const UsersModel = require('../models/Users');
const InvoiceModel = require('../models/Invoice');
const ExpensesModel = require('../models/Expenses');
const PlatosModel = require('../models/Platos');
const CategoryModel = require('../models/Categoria');
const VerificationsModel = require('../models/Verifications');

const { 
   validate_letras,
   validate_telefono,
   validate_cedula,
   validate_letrasSpace,
   validate_email,
   validate_fecha,
   validate_decimal
} = require('../validations/validations');

gerenteControllers.welcome = async (req, res) => {
   let adm = 0, caj = 0, ventas, sumV = 0, gastos, sumG = 0, tot = 0;

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

   tot = sumV - sumG;
   tot = tot.toFixed(2); 

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
      caj, adm, sumV, sumG, tot
   });
};

gerenteControllers.renderCajero = async (req, res) => {
   let date = new Date(),
      d = date.getDate(),
      m = date.getMonth() + 1,
      a = date.getFullYear();

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

   res.render('gerente/cajero', {
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
      d, m, a
   });
};

gerenteControllers.allCajero = async (req, res) => {
   let allCajero;

   try {
      allCajero = await UsersModel
         .find({
            privilegio: 'Cajero'
         })
         .select({
            cedula: 1,
            apellidos: 1,
            nombres: 1,
            fechaNacimiento: 1,
            genero: 1,
            direccion: 1,
            telefono: 1,
            email: 1,
            privilegio: 1,
            estado: 1,
            profile: 1
         })
         .lean();

      res.status(201).send(allCajero);
   } catch (e) {
      console.log(e);
   }
};

gerenteControllers.newUser = async (req, res) => {
   const toast = [];

   const {
      cedula,
      apellidos,
      nombres,
      genero,
      email,
      fech_nacimiento,
      telefono,
      direccion
   } = req.body;

   let cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      generoN = genero.trim(),
      emailN = email.trim().toLowerCase(),
      fech_nacimientoN = fech_nacimiento.trim().replace(/\./g, '/'),
      telefonoN = telefono.trim(),
      direccionN = direccion.trim();

   if (
      cedulaN === '' ||
      apellidosN === '' ||
      nombresN === '' ||
      generoN === '' ||
      emailN === '' ||
      fech_nacimientoN === '' ||
      telefonoN === '' ||
      direccionN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      if (!validate_cedula(cedulaN)) {
         toast.push({
            tittle: 'Cédula incorrecta',
            description: 'La cédula es incorrecta...',
            icon: 'error'
         });
      }

      if (!validate_letrasSpace(apellidosN)) {
         toast.push({
            tittle: 'Apellido incorrecto',
            description: 'El apellido escrito no cumple el formato...',
            icon: 'error'
         });
      }

      if (!validate_letrasSpace(nombresN)) {
         toast.push({
            tittle: 'Nombre incorrecto',
            description: 'El nombre escrito no cumple el formato...',
            icon: 'error'
         });
      }

      if (!validate_telefono(telefonoN)) {
         toast.push({
            tittle: 'Telefono incorrecto',
            description: 'El telefono ingresado es incorrecto...',
            icon: 'error'
         });
      }

      if (!validate_letras(generoN)) {
         toast.push({
            tittle: 'Género incorrecto',
            description: 'El genero elegido no cumple el formato...',
            icon: 'error'
         });
      }

      if (!validate_email(emailN)) {
         toast.push({
            tittle: 'Email incorrecto',
            description: 'El email ingresado no es correcto...',
            icon: 'error'
         });
      }

      if (!validate_fecha(fech_nacimientoN)) {
         toast.push({
            tittle: 'Fecha incorrecta',
            description: 'La fecha ingresada es incorrecta...',
            icon: 'error'
         });
      }

      if (toast.length > 0) {
         res.json({
            toast,
            res: 'toast'
         });
      } else {
         const searchAccount = await UsersModel
            .find({
               $or: [{
                  cedula: cedulaN
               }, {
                  email: emailN
               }]
            })
            .select({
               cedula: 1,
               apellidos: 1,
               nombres: 1,
               email: 1
            })
            .lean();
         // console.log(searchAccount);

         if (searchAccount.length > 0) {
            res.json({
               tittle: 'Cuenta ya registrada',
               description: 'Cédula o email ya se encuentran registrado dentro del sistema!!!',
               icon: 'info',
               res: 'false'
            });
         } else {
            try {
               const newData = new UsersModel({
                  cedula: cedulaN,
                  apellidos: apellidosN,
                  nombres: nombresN,
                  fechaNacimiento: fech_nacimientoN,
                  genero: generoN,
                  direccion: direccionN,
                  email: emailN,
                  telefono: telefonoN,
                  privilegio: 'Cajero',
                  password: cedulaN,
                  estado: 'Enabled',
                  profile: 'profile.svg'
               });

               newData.password = await newData.encryptPassword(cedulaN);
               const saveUser = await newData.save();
   
               if (saveUser) {
                  try {
                     await VerificationsModel
                        .updateOne({
                           _idUser: saveUser._id,
                           motivo: 'changePassword'
                        }, {
                           $setOnInsert: {
                              _idUser: saveUser._id,
                              motivo: 'changePassword',
                              estado: 'No Verificado'
                           }
                        }, {
                           upsert: true
                        });
                  } catch (e) {
                     console.log(e);
                  }

                  try {
                     // Enviar correos electronicos de registro a los usuarios
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
                           from: `'Parrillada del COCO' <${process.env.userMail}>`,
                           to: saveUser.email,
                           subject: 'Cuenta Registrada - Parrillada del COCO',
                           html: require('../template/emails/register.tmp')({
                              nameUser: `${saveUser.nombres} ${saveUser.apellidos}`
                           })
                        });

                     console.log(info.response);
                  } catch (e) {
                     console.log(e);
                  }

                  res.json({
                     tittle: 'Cuenta creada',
                     description: 'Se ha creado la cuenta con exito!!!',
                     icon: 'success',
                     res: 'true'
                  });
               } else {
                  res.json({
                     tittle: 'Cuenta no creada',
                     description: 'No se ha podido crear la cuenta!!!',
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
   }
};

gerenteControllers.updateUser = async (req, res) => {
   const toast = [];

   const {
      id,
      apellidos,
      nombres,
      genero,
      email,
      fech_nacimiento,
      telefono,
      direccion
   } = req.body;

   let idN = id.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      generoN = genero.trim(),
      emailN = email.trim().toLowerCase(),
      fech_nacimientoN = fech_nacimiento.trim().replace(/\./g, '/'),
      telefonoN = telefono.trim(),
      direccionN = direccion.trim();

   if (
      idN === '' ||
      apellidosN === '' ||
      nombresN === '' ||
      generoN === '' ||
      emailN === '' ||
      fech_nacimientoN === '' ||
      telefonoN === '' ||
      direccionN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      if (!validate_letrasSpace(apellidosN)) {
         toast.push({
            tittle: 'Apellido incorrecto',
            description: 'El apellido escrito no cumple el formato...',
            icon: 'error'
         });
      }

      if (!validate_letrasSpace(nombresN)) {
         toast.push({
            tittle: 'Nombre incorrecto',
            description: 'El nombre escrito no cumple el formato...',
            icon: 'error'
         });
      }

      if (!validate_telefono(telefonoN)) {
         toast.push({
            tittle: 'Telefono incorrecto',
            description: 'El telefono ingresado es incorrecto...',
            icon: 'error'
         });
      }

      if (!validate_letras(generoN)) {
         toast.push({
            tittle: 'Género incorrecto',
            description: 'El genero elegido no cumple el formato...',
            icon: 'error'
         });
      }

      if (!validate_email(emailN)) {
         toast.push({
            tittle: 'Email incorrecto',
            description: 'El email ingresado no es correcto...',
            icon: 'error'
         });
      }

      if (!validate_fecha(fech_nacimientoN)) {
         toast.push({
            tittle: 'Fecha incorrecta',
            description: 'La fecha ingresada es incorrecta...',
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
            const searchAccount = await UsersModel
               .find({
                  email: emailN,
                  _id: {
                     $not: {
                        $eq: idN
                     }
                  }
               })
               .select({
                  cedula: 1,
                  apellidos: 1,
                  nombres: 1,
                  email: 1
               })
               .lean();
            // console.log(searchAccount);

            if (searchAccount.length > 0) {
               res.json({
                  tittle: 'Correo ya registrado',
                  description: 'El correo a actualizar ya se encuentran registrado dentro del sistema!!!',
                  icon: 'warning',
                  res: 'false'
               });
            } else {
               const searchAccount = await UsersModel
                  .findOne({
                     _id: id
                  })
                  .select({
                     cedula: 1,
                     apellidos: 1,
                     nombres: 1,
                     email: 1
                  })
                  .lean();
               // console.log(searchAccount);

               if (!searchAccount) {
                  res.json({
                     tittle: 'Cuenta no existente',
                     description: 'La cuenta no se encuentra registrada dentro del sistema!!!',
                     icon: 'info',
                     res: 'false'
                  });
               } else {
                  const updateUser = await UsersModel
                     .updateOne({
                        _id: id
                     }, {
                        $set: {
                           apellidos: apellidosN,
                           nombres: nombresN,
                           fechaNacimiento: fech_nacimientoN,
                           genero: generoN,
                           direccion: direccionN,
                           email: emailN,
                           telefono: telefonoN
                        }
                     });
   
                  if (updateUser.modifiedCount >= 1) {
                     res.json({
                        tittle: 'Cuenta actualizada',
                        description: 'Se ha actualizado la cuenta con exito!!!',
                        icon: 'success',
                        res: 'true'
                     });
                  } else {
                     res.json({
                        tittle: 'Cuenta no actualizada',
                        description: 'No se ha podido actualizar la cuenta!!!',
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
   }
};

gerenteControllers.changeEstado = async (req, res) => {
   const {
      id
   } = req.body;

   let idN = id.trim();

   if (
      idN === ''
   ) {
      return res.status(500).json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const searchAccount = await UsersModel
            .findOne({
               _id: idN
            })
            .select({
               cedula: 1,
               apellidos: 1,
               nombres: 1,
               estado: 1,
               privilegio: 1
            })
            .lean();
         // console.log(searchAccount);

         if (!searchAccount) {
            res.json({
               tittle: 'Cuenta no existente',
               description: 'La cuenta no se encuentra registrada dentro del sistema!!!',
               icon: 'info',
               res: 'false'
            });
         } else {
            const updateUser = await UsersModel
               .updateOne({
                  _id: id
               }, {
                  $set: {
                     estado: (searchAccount.estado === 'Enabled') ? 'Disabled' : 'Enabled'
                  }
               });
            // console.log(updateUser);
               
            if (updateUser.modifiedCount >= 1) {
               res.json({
                  tittle: `${(searchAccount.privilegio).toUpperCase()} ${((searchAccount.estado === 'Enabled') ? 'Desactivado' : 'Activado').toUpperCase()}`,
                  description: `Se ha ${((searchAccount.estado === 'Enabled') ? 'Desactivado' : 'Activado').toLowerCase()} la cuenta con exito!!!`,
                  icon: 'success',
                  res: 'true'
               });
            } else {
               res.json({
                  tittle: `${(searchAccount.privilegio).toUpperCase()} NO ${((searchAccount.estado === 'Enabled') ? 'Desactivado' : 'Activado').toUpperCase()}`,
                  description: `No se ha podido ${((searchAccount.estado === 'Enabled') ? 'Desactivar' : 'Activar').toLowerCase()} la contraseña!!!`,
                  icon: 'error',
                  res: 'false'
               });
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

gerenteControllers.renderGastos = (req, res) => {
   const {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('gerente/gastos', {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   });
};

gerenteControllers.allGastos = async (req, res) => {
   let allGastos;

   try {
      allGastos = await ExpensesModel
         .find()
         .select({
            _idUsuario: 1,
            fechaSave: 1,
            fechaUpdate: 1,
            descripcion: 1,
            total: 1
         })
         .lean()
         .populate({
            path: '_idUsuario',
            select: 'nombres apellidos'
         });
         
      // console.log(allGastos);
      res.send(allGastos);
   } catch (e) {
      console.log(e);
   }
};

gerenteControllers.saveGasto = async (req, res) => {
   const toast = [];

   const {
      descripcionGastos,
      totalGastos
   } = req.body;

   let descripcion = descripcionGastos.trim(),
      total = totalGastos.trim();

   if (
      descripcion === '' ||
      total === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      if (!validate_decimal(total)) {
         toast.push({
            tittle: 'Precio incorrecta',
            description: 'El precio ingresado es incorrecto...',
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
            total = parseFloat(total).toFixed(2);

            const newGasto = new ExpensesModel({
               _idUsuario: req.user.id,
               fechaSave: moment().format('DD-MM-YYYY'),
               fechaUpdate: moment().format('DD-MM-YYYY'),
               anio: moment().format('yyyy'),
               descripcion,
               total
            });

            const saveGasto = await newGasto.save();

            if (saveGasto) {
               res.json({
                  tittle: 'Gasto registrado',
                  description: 'Se ha registrado el gasto con exito!!!',
                  icon: 'success',
                  res: 'true'
               });
            } else {
               res.json({
                  tittle: 'Gasto no registrado',
                  description: 'No se ha podido registrar el gasto!!!',
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

gerenteControllers.updateGasto = async (req, res) => {
   let toast = [];
   
   const {
      id,
      descripcionGastos,
      totalGastos
   } = req.body;

   let idN = id.trim(),
      descripcion = descripcionGastos.trim(),
      total = totalGastos.trim();

   if (
      idN === '' ||
      descripcion === '' ||
      total === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      if (!validate_decimal(total)) {
         toast.push({
            tittle: 'Precio incorrecta',
            description: 'El precio ingresado es incorrecto...',
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
            const searchG = await ExpensesModel
               .find({
                  _id: idN
               })
               .lean();
            
            if (searchG.length > 0) {
               total = parseFloat(total).toFixed(2);

               const updateG = await ExpensesModel
                  .updateOne({
                     _id: idN
                  }, {
                     $set: {
                        _idUsuario: req.user.id,
                        fechaUpdate: moment().format('DD-MM-YYYY'),
                        descripcion,
                        total
                     }
                  });
               
               if (updateG.modifiedCount >= 1) {
                  res.json({
                     tittle: 'Gasto actualizado',
                     description: 'Se ha actualizado el registro con éxito!',
                     icon: 'success',
                     res: 'true'
                  });
               } else {
                  res.json({
                     tittle: 'Gasto no actualizado',
                     description: 'El registro no se ha podido actualizar!',
                     icon: 'error',
                     res: 'false'
                  });
               }
            } else {
               res.json({
                  tittle: 'Gasto no encontrado',
                  description: 'Opss! El registro a modificar no se encuentra registrado!',
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

gerenteControllers.deleteGasto = async (req, res) => {
   const {
      idG
   } = req.body;

   let id = idG.trim();

   if (
      id === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const searchG = await ExpensesModel
            .find({
               _id: id
            })
            .lean();
            
         if (searchG.length > 0) {
            const deleteG = await ExpensesModel
               .deleteOne({
                  _id: id
               });
               
            if (deleteG.deletedCount >= 1) {
               res.json({
                  tittle: 'Gasto eliminado',
                  description: 'Se ha eliminado el registro con éxito!',
                  icon: 'success',
                  res: 'true'
               });
            } else {
               res.json({
                  tittle: 'Gasto no eliminado',
                  description: 'El registro no se ha podido eliminar!',
                  icon: 'error',
                  res: 'false'
               });
            }
         } else {
            res.json({
               tittle: 'Gasto no encontrado',
               description: 'Opss! El registro a modificar no se encuentra registrado!',
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
};

gerenteControllers.renderReportes = (req, res) => {
   const {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('gerente/reportes', {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   });
};

gerenteControllers.allVentasAnuales = async (req, res) => {
   const {
      anio
   } = req.query;

   let anioN, 
      allVentas;

   (anio !== undefined) 
      ? anioN = anio.trim() 
      : anioN = moment().format('yyyy');

   try {
      allVentas = await InvoiceModel
         .find({
            anio: anioN
         })
         .select({
            fecha: 1,
            total: 1
         })
         .lean();
         
      res.json(allVentas);
   } catch (e) {
      console.log(e);
   }
};

gerenteControllers.allGastosAnuales = async (req, res) => {
   const {
      anio
   } = req.query;

   let anioN, 
      allGastosAnuales;

   (anio !== undefined) 
      ? anioN = anio.trim() 
      : anioN = moment().format('yyyy');

   try {
      allGastosAnuales = await ExpensesModel
         .find({
            anio: anioN
         })
         .select({
            fechaSave: 1,
            total: 1
         })
         .lean();
         
      res.json(allGastosAnuales);
   } catch (e) {
      console.log(e);
   }
};

gerenteControllers.renderMensuales = (req, res) => {
   let date = new Date(),
      d = date.getDate(),
      m = date.getMonth() + 1,
      a = date.getFullYear();

   m = (m > 9) ? m : `0${m}`;
   d = (d > 9) ? d : `0${d}`;

   const {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile
   } = req.user;

   res.render('gerente/mensuales', {
      _id,
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      profile,
      d, m, a
   });
};

gerenteControllers.allGanancias = async (req, res) => {
   const {
      inicio,
      fin
   } = req.params;

   let allGanancias;

   try {
      allGanancias = await InvoiceModel
         .find({
            createdAt: {
               // Mayor o igual
               $gte: new Date(inicio),
               // Menor o igual
               $lte: new Date(fin),
            }
         })
         .select({
            _idVendedor: 1,
            fecha: 1,
            total: 1
         })
         .lean()
         .populate({
            path: '_idVendedor',
            select: 'nombres apellidos'
         });
         
      res.send(allGanancias);
   } catch (e) {
      console.log(e);
   }
};


module.exports = gerenteControllers;