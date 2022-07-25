const { Schema, model } = require('mongoose');

const verificationSchema = new Schema ({
   _idUser: {
      type: Schema.Types.ObjectId,
      ref: 'Usuarios'
   },
   motivo: {
      type: String,
      required: true
      // changePassword
      // recoveryAccount
   },
   estado: {
      type: String,
      require: true
      // No Verificado
   }
}, {
   timestamps: true,
   versionKey: false
});

module.exports = model('Verificaciones', verificationSchema);