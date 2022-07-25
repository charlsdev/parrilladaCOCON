const adminControllers = {};

require('dotenv').config();

const nodemailer = require('nodemailer');
const moment = require('moment');
moment.locale('es');

const UsersModel = require('../models/Users');
const VerificationsModel = require('../models/Verifications');

const { 
   validate_letras,
   validate_telefono,
   validate_cedula,
   validate_letrasSpace,
   validate_email,
   validate_fecha
} = require('../validations/validations');

adminControllers.welcome = async (req, res) => {
   let all = 0, caj = 0, ger = 0, adm = 0;

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
      all = await UsersModel
         .find()
         .countDocuments();

      // console.log('Totales ==> ' + all);
   } catch (e) {
      console.log(e);
   }

   try {
      adm = await UsersModel
         .find({
            privilegio: 'Administrador'
         })
         .countDocuments();

      // console.log('Administradores ==> ' + adm);
   } catch (e) {
      console.log(e);
   }

   try {
      ger = await UsersModel
         .find({
            privilegio: 'Gerente'
         })
         .countDocuments();

      // console.log('Gerente ==> ' + ger);
   } catch (e) {
      console.log(e);
   }

   try {
      caj = await UsersModel
         .find({
            privilegio: 'Cajero'
         })
         .countDocuments();

      // console.log('Cajero ==> ' + caj);
   } catch (e) {
      console.log(e);
   }

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
      profile,
      all, caj, ger, adm
   });
};

adminControllers.renderCajero = async (req, res) => {
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

   res.render('admin/cajero', {
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

adminControllers.allCajero = async (req, res) => {
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

adminControllers.newUser = async (req, res) => {
   const toast = [];

   const {
      cedula,
      apellidos,
      nombres,
      genero,
      email,
      fech_nacimiento,
      telefono,
      direccion,
      privilegio
   } = req.body;

   let cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      generoN = genero.trim(),
      emailN = email.trim().toLowerCase(),
      fech_nacimientoN = fech_nacimiento.trim().replace(/\./g, '/'),
      telefonoN = telefono.trim(),
      direccionN = direccion.trim(),
      privilegioN = privilegio.trim();

   if (
      cedulaN === '' ||
      apellidosN === '' ||
      nombresN === '' ||
      generoN === '' ||
      emailN === '' ||
      fech_nacimientoN === '' ||
      telefonoN === '' ||
      direccionN === '' ||
      privilegioN === ''
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

      if (!validate_letras(privilegioN)) {
         toast.push({
            tittle: 'Rol incorrecto',
            description: 'El rol es incorrecto...',
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
                  privilegio: privilegioN,
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

adminControllers.updateUser = async (req, res) => {
   const toast = [];

   const {
      id,
      apellidos,
      nombres,
      genero,
      email,
      fech_nacimiento,
      telefono,
      direccion,
      privilegio
   } = req.body;

   let idN = id.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      generoN = genero.trim(),
      emailN = email.trim().toLowerCase(),
      fech_nacimientoN = fech_nacimiento.trim().replace(/\./g, '/'),
      telefonoN = telefono.trim(),
      direccionN = direccion.trim(),
      privilegioN = privilegio.trim();

   if (
      idN === '' ||
      apellidosN === '' ||
      nombresN === '' ||
      generoN === '' ||
      emailN === '' ||
      fech_nacimientoN === '' ||
      telefonoN === '' ||
      direccionN === '' ||
      privilegioN === ''
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

      if (!validate_letras(privilegioN)) {
         toast.push({
            tittle: 'Rol incorrecto',
            description: 'El rol es incorrecto...',
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
         console.log(searchAccount);

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
               try {
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
                           telefono: telefonoN,
                           privilegio: privilegioN,
                        }
                     });
   
                  if (updateUser) {
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
   }
};

module.exports = adminControllers;