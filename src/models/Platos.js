const { Schema, model } = require('mongoose');

const platosSchema = new Schema ({
   _idCategoría: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria'
   },
   nomPlato: {
      type: String,
      required: true
   },
   acompañado: {
      type: String,
      // required: true
   },
   precio: {
      type: String,
      required: true
   },
   estado: {
      type: String,
      require: true
      // Stock
      // Sin stock
      // Not Sale
   }
}, {
   timestamps: true,
   versionKey: false
});

module.exports = model('Platos', platosSchema);