const validate_email = (correo) => {
   var emailRegex =
      /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   if (emailRegex.test(correo)) {
      return true;
   }
   return false;
};

function validarAd(cad) {
   var total = 0;
   var longitud = cad.length;
   var longcheck = longitud - 1;
   for (var i = 0; i < longcheck; i++) {
      if (i % 2 === 0) {
         var aux = cad.charAt(i) * 2;
         if (aux > 9) aux -= 9;
         total += aux;
      } else {
         total += parseInt(cad.charAt(i));
      }
   }
   total = total % 10 ? 10 - total % 10 : 0;
   if (cad.charAt(longitud - 1) == total) {
      return true;
   } else {
      return false;
   }
}

const validate_cedula = (cedula) => {
   var cedulaRegex =
      /^[0-9]+$/;
   if (cedulaRegex.test(cedula)) {
      if (cedula.length === 10) {
         const result = validarAd(cedula);
         return result;
      } else {
         return false;
      }
   }
   return false;
};

function validate_fecha(fecha) {
   var fechaRegex =
      /^\d{1,2}\/\d{1,2}\/\d{4}$/;
   if (fechaRegex.test(fecha)) {
      return true;
   }
   return false;
}

const validate_telefono = (telefono) => {
   var telefonoRegex =
      /^[0-9]+$/;
   if (telefonoRegex.test(telefono)) {
      if (telefono.length === 10) {
         return true;
      } else {
         return false;
      }
   }
   return false;
};

const validate_letras = (letras) => {
   var letrasRegex =
      /^[A-Z]+$/i;
   if (letrasRegex.test(letras)) {
      return true;
   }
   return false;
};

const validate_letrasSpace = (letras) => {
   var letrasRegex =
      /^[A-Zá-ü ]+$/i;
   if (letrasRegex.test(letras)) {
      return true;
   }
   return false;
};

const validate_decimal = (decimal) => {
   var decimalRegex =
      /^([0-9]{1,4})?(.)?([0-9]{2,2})$/;
   if (decimalRegex.test(decimal)) {
      return true;
   }
   return false;
};

const validate_letterYnumbers = (words) => {
   var letnumRegex =
      /^[A-Zá-ü0-9 ]+$/i;
   if (letnumRegex.test(words)) {
      return true;
   }
   return false;
};

const validate_hora = (hora) => {
   var horaRegex =
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
   if (horaRegex.test(hora)) {
      return true;
   }
   return false;
};

const validate_ID = (word, sli, tam, ini) => {
   var idRegex =
      /^[a-z0-9_-]{20}$/i;

   let pre = word.slice(0, sli),
      suf = word.slice(sli);

   if (word.length === tam) {
      if (idRegex.test(suf)) {
         if (pre === ini) {
            return true;
         }
      }
   }
   return false;
};

const validate_numeros = (numero) => {
   var numeroRegex =
      /^[0-9]+$/;
   if (numeroRegex.test(numero)) {
      return true;
   }
   return false;
};

const validate_code = (code) => {
   var codeRegex =
      /^[0-9a-zA-Z]{8}$/i;
   if (codeRegex.test(code)) {
      if (code.length === 8) {
         return true;
      } else {
         return false;
      }
   }
   return false;
};

module.exports = ({
   validate_email,
   validate_cedula,
   validate_fecha,
   validate_telefono,
   validate_letras,
   validate_letrasSpace,
   validate_decimal,
   validate_letterYnumbers,
   validate_hora,
   validate_ID,
   validate_numeros,
   validate_code
});