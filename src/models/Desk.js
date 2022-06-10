const { Schema, model } = require('mongoose');

const mesaSchema = new Schema ({
   numMesa: {
      type: Number,
      required: true,
      maxlength: 3
   },
   codigo: {
      type: String,
      required: true,
      maxlength: 8
   },
   estado: {
      type: String,
      require: true,
      maxlength: 10
      // Ocupada
      // Reservada
   }
}, {
   timestamps: true,
   versionKey: false
});

module.exports = model('Mesa', mesaSchema);