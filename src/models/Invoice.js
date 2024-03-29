const { Schema, model } = require('mongoose');

const facturaSchema = new Schema ({
   _idVendedor: {
      type: Schema.Types.ObjectId,
      ref: 'Usuarios'
   },
   _codeMesa: {
      type: String,
      required: true,
      maxlength: 8
   },
   cedula: {
      type: String,
      maxlength: 10
   },
   nomCliente: {
      type: String,
      required: true
   },
   fecha: {
      type: String,
      require: true,
      maxlength: 10
   },
   anio: {
      type: Number,
      require: true,
      maxlength: 4
   },
   email: {
      type: String,
   },
   subtotal: {
      type: String,
      require: true
   },
   iva: {
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

module.exports = model('Factura', facturaSchema);