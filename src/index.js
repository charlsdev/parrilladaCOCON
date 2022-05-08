require('dotenv').config();

/** 
 * @description Modulo de la conexion a la DB 
 */
require('./database');

/**
 * @description Configuración del servidor
 */
const app = require('./server');

/**
 * @description Iniciamos el server
 */
app.listen(app.get('port'), () => {
   console.log(
      `[${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] - Servidor en el puerto ${app.get('port')}`
   );
});