const indexControllers = {};

require('dotenv').config();

const passport = require('passport');
const path = require('path');
const fse = require('fs-extra');
const {
   nanoid
} = require('nanoid');
const nodemailer = require('nodemailer');

const VerificationModel = require('../models/Verifications');
const UsersModel = require('../models/Users');

const {
   validate_letrasSpace,
   validate_letras,
   validate_fecha,
   validate_email,
   validate_telefono
} = require('../validations/validations');

indexControllers.login = (req, res) => {
   res.render('login');
};

indexControllers.loginAuth = passport.authenticate('local.login', {
   failureRedirect: '/',
   successRedirect: '/verification',
   badRequestMessage: 'Credenciales desconocidas!!!',
   failureFlash: true
});

indexControllers.verification = async (req, res) => {
   const {
      _id: IDUser,
      privilegio
   } = req.user;

   const userVer = await VerificationModel
      .findOne({
         _idUser: IDUser
      }, {
         motivo: 1,
         estadoV: 1
      });

   console.log(userVer);

   if (userVer) {
      if (userVer.motivo === 'changePassword') {
         res.redirect('/password');
      } else {
         req.logout();
         req.flash('warning_msg', 'No estas autorizado. Inicia sesión...');
         res.redirect('/');
      }
   } else {
      if (privilegio === 'Cajero') {
         res.redirect('/c');
      } else {
         if (privilegio === 'Gerente') {
            res.redirect('/g');
         } else {
            if (privilegio === 'Administrador') {
               res.redirect('/a');
            } else {
               req.logout();
               req.flash('warning_msg', 'No estas autorizado. Inicia sesión.');
               res.redirect('/');
            }
         }
      }
   }
};

indexControllers.renderProfile = async (req, res) => {
   var
      date = new Date(),
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

   res.render('profile', {
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

indexControllers.changePhotoProfile = async (req, res) => {
   console.log(req.file);

   if (!req.file) {
      if (req.file) {
         const tempPathFiles = req.file.path;
         await fse.unlink(tempPathFiles);
      }
      res.json({
         tittle: 'Imagen no válida',
         description: 'Se ha enviado una imagen no válida o vacía!',
         icon: 'warning',
         res: 'false'
      });
   } else {
      try {
         const nameIMG = `${nanoid(20)}`;
         const extFiles = path.extname(req.file.originalname).toLowerCase();

         if (extFiles === '.jpg' || extFiles === '.jpeg' || extFiles === '.png') {
            const nameEndFiles = `${nameIMG}${extFiles}`;
            const destinationFiles = path.resolve(`src/public/profile/${nameEndFiles}`);
            const tempPathFiles = req.file.path;

            await fse.copy(tempPathFiles, destinationFiles);

            const imgID = async () => {
               const reviewIMG = await UsersModel
                  .find({
                     profile: nameEndFiles
                  })
                  .lean();
               
               if (reviewIMG.length > 0) {
                  imgID();
               } else {
                  const saveImage = await UsersModel
                     .updateOne({
                        cedula: req.user.cedula,
                     }, {
                        $set: {
                           profile: nameEndFiles
                        }
                     });

                  if (saveImage.modifiedCount > 0) {
                     res.json({
                        tittle: 'Perfil actualizado',
                        description: 'Se ha actualizado la foto de perfil con éxito!!!',
                        icon: 'success',
                        res: 'true'
                     });
                  } else {
                     res.json({
                        tittle: 'Perfil no actualizado',
                        description: 'No se ha podido actualizar la foto de perfil!!!',
                        icon: 'error',
                        res: 'false'
                     });
                  }
               }
            };
            
            imgID();
            await fse.unlink(tempPathFiles);
         } else {
            if (req.file) {
               const tempPathFiles = req.file.path;
               await fse.unlink(tempPathFiles);
            }

            res.json({
               tittle: 'Extensión no válida',
               description: 'La extensión de la imagen no es válida!',
               icon: 'warning',
               res: 'false'
            });
         }
      } catch (e) {
         console.log(e);

         if (req.file) {
            const tempPathFiles = req.file.path;
            await fse.unlink(tempPathFiles);
         }

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error'
         });
      }
   }
};

indexControllers.updateDataProfile = async (req, res) => {
   const toast = [];

   const {
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email
   } = req.body;

   let apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      fechaNacimientoN = fechaNacimiento.trim().replace(/\./g, '/'),
      generoN = genero.trim(),
      direccionN = direccion.trim(),
      telefonoN = telefono.trim(),
      emailN = email.trim().toLowerCase();

   if (
      apellidosN === '' ||
      nombresN === '' ||
      fechaNacimientoN === '' ||
      generoN === '' ||
      direccionN === '' ||
      telefonoN === '' ||
      emailN === ''
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
      if (!validate_fecha(fechaNacimientoN)) {
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
            const updateData = await UsersModel
               .updateOne({
                  _id: req.user.id
               }, {
                  $set: {
                     apellidos: apellidosN,
                     nombres: nombresN,
                     fechaNacimiento: fechaNacimientoN,
                     genero: genero,
                     direccion: direccionN,
                     telefono: telefonoN,
                     email: emailN
                  }
               });

            if (updateData.modifiedCount === 1) {
               res.json({
                  tittle: 'Datos actualizados',
                  description: 'Se ha actualizado lo datos de la cuenta con exito!!!',
                  icon: 'success',
                  res: 'true'
               });
            } else {
               res.json({
                  tittle: 'Datos no actualizados',
                  description: 'No se ha podido actualizar los datos de la cuenta!!!',
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

indexControllers.renderChangePassword = async (req, res) => {
   var
      date = new Date(),
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

   res.render('password', {
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

indexControllers.changePassword = async (req, res, next) => {
   const toast = [];

   const {
      oldPassword,
      newPassword,
      confNewPassword
   } = req.body;

   let oldPasswordN = oldPassword.trim(),
      newPasswordN = newPassword.trim(),
      confNewPasswordN = confNewPassword.trim();
   
   if (
      oldPasswordN === '' ||
      newPasswordN === '' ||
      confNewPasswordN === ''
   ) {
      toast.push({
         tittle: 'Campos vacios',
         icon: 'error',
         description: 'Los campos no pueden ir vacíos o con espacios...'
      });
   }

   if (
      newPasswordN != confNewPasswordN
   ) {
      toast.push({
         tittle: 'Contraseña no coincide',
         icon: 'warning',
         description: 'La nueva contraseña no coincide con la confirmada...'
      });
   }

   if (toast.length > 0) {
      res.json({
         toast,
         res: 'toast'
      });
   } else {
      const user = await UsersModel
         .findOne({
            cedula: req.user.cedula
         });

      const passCompare = await user.matchPassword(newPasswordN);
         
      if (passCompare) {
         toast.push({
            tittle: 'Contraseñas iguales',
            icon: 'info',
            description: 'La nueva contraseña debe de ser diferente a la actual...'
         });
      } else {
         const comparePassAnt = await user.matchPassword(oldPasswordN, user.password);
         
         if (!comparePassAnt) {
            toast.push({
               tittle: 'Contraseña incorrecta',
               icon: 'info',
               description: 'La contraseña actual no coincide o es incorrecta...'
            });
         }
      }
      
      if (toast.length > 0) {
         res.json({
            toast,
            res: 'toast'
         });
      } else {
         const passNewEncrypt = await user.encryptPassword(newPasswordN);

         try {
            const updatePass = await UsersModel
               .updateOne({
                  cedula: req.user.cedula
               }, {
                  $set: {
                     password: passNewEncrypt
                  }
               });
      
            if (updatePass.modifiedCount >= 1) {
               try {
                  await VerificationModel
                     .deleteOne({
                        _idUser: req.user.id
                     });
               } catch (e) {
                  console.log(e);
               }

               try {
                  const transporte = nodemailer
                     .createTransport({
                        host: 'mail.privateemail.com',
                        port: 465,
                        secure: true,
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
                        to: req.user.email,
                        subject: 'Contraseña Actualizada',
                        html: require('../template/emails/changePass.tmp')({
                           nameUser: `${req.user.nombres} ${req.user.apellidos}`
                        })
                     });
                  console.log(info.response);
               } catch (e) {
                  console.log(e);
               }
               
               req.logout(req.user, err => {
                  if(err) return next(err);
               });

               res.json({
                  tittle: 'Contraseña actualizada',
                  description: 'Se ha actualizado la contraseña de la cuenta con exito!!!',
                  icon: 'success',
                  res: 'true'
               });
            } else {
               res.json({
                  tittle: 'Contraseña no actualizada',
                  description: 'No se ha podido actualizar la contraseña de la cuenta!!!',
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

indexControllers.exitLogout = (req, res, next) => {
   req.logout(req.user, err => {
      if(err) return next(err);
      req.flash('warning_msg', 'Sesión cerrada. Vuelva pronto...');
      res.redirect('/');
   });
};

module.exports = indexControllers;