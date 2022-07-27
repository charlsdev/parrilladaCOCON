const { Schema, model } = require('mongoose');

const gastosSchema = new Schema ({
   _idUsuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuarios'
   },
   fechaSave: {
      type: String,
      require: true,
      maxlength: 10
   },
   fechaUpdate: {
      type: String,
      require: true,
      maxlength: 10
   },
   descripcion: {
      type: String,
      require: true
   },
   total: {
      type: String,
      require: true
   },
}, {
   timestamps: true,
   versionKey: false
});

module.exports = model('Gastos', gastosSchema);