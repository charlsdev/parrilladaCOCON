const { Schema, model } = require('mongoose');

const ventasSchema = new Schema ({
   _codeMesa: {
      type: String,
      required: true,
      maxlength: 8
   },
   ventas: [{
      plato: {
         type: String,
         require: true
      },
      cantidad: {
         type: Number,
         required: true
      },
      precioUnit: {
         type: String,
         require: true
      },
      precioPar: {
         type: String,
         require: true
      }
   }]
}, {
   timestamps: true,
   versionKey: false
});

module.exports = model('Ventas', ventasSchema);