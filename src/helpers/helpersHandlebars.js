const { format, register } = require('timeago.js');

const moment = require('moment');
moment.locale('es');

const helpersHandlebars = {};

const localeFunc = (number, index) => {
   return [
      ['justo ahora', 'en un rato'],
      ['hace %s segundos', 'en %s segundos'],
      ['hace 1 minuto', 'en 1 minuto'],
      ['hace %s minutos', 'en %s minutos'],
      ['hace 1 hora', 'en 1 hora'],
      ['hace %s horas', 'en %s horas'],
      ['hace 1 día', 'en 1 día'],
      ['hace %s días', 'en %s días'],
      ['hace 1 semana', 'en 1 semana'],
      ['hace %s semanas', 'en %s semanas'],
      ['hace 1 mes', 'en 1 mes'],
      ['hace %s meses', 'en %s meses'],
      ['hace 1 año', 'en 1 año'],
      ['hace %s años', 'en %s años'],
   ][index];
};

register('es_ES', localeFunc);

helpersHandlebars.timeago = (timestamp) => {
   return format(timestamp, 'es_ES');
};

helpersHandlebars.isCajero = (priv, opts) => {
   return priv == 'Cajero' ? opts.fn(this) : opts.inverse(this);
};

helpersHandlebars.isGerente = (priv, opts) => {
   return priv == 'Gerente' ? opts.fn(this) : opts.inverse(this);
};

helpersHandlebars.isAdmin = (priv, opts) => {
   return priv == 'Administrador' ? opts.fn(this) : opts.inverse(this);
};

helpersHandlebars.status = (a, opts) => {
   return a == 'Stock' ? opts.fn(this) : opts.inverse(this);
};

module.exports = helpersHandlebars;