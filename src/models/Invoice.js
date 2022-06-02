const { Schema, model } = require('mongoose');

const facturaSchema = new Schema ({
   cedula: {
      type: String,
      required: true,
      maxlength: 10
   },
   nomCliente: {
      type: String,
      required: true
   },
   fecha: {
      type: String,
      require: true
   },
   _idSales: {
      type: Schema.Types.ObjectId,
      ref: 'Ventas'
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
   _idVendedor: {
      type: Schema.Types.ObjectId,
      ref: 'Usuarios'
   },
}, {
   timestamps: true,
   versionKey: false
});

module.exports = model('Factura', facturaSchema);