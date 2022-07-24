const moment = require('moment');
moment.locale('es');

module.exports = {
   formate: 'A4',
   orientation: 'portrait',
   border: '5mm',
   header: {
      height: '5mm',
      contents: ''
   },
   footer: {
      height: '20mm',
      contents: {
         default: 
            `<table>
               <tr>
                  <td>
                     <center><div class="green" style="height: 3px; width: 95%; background-color: #ffbe81;"></div></center>
                  </td>
                  <td>
                     <center><div class="green" style="height: 3px; width: 95%; background-color: #54ac54;"></div></center>
                  </td>
                  <td>
                     <center><div class="red" style="height: 3px; width: 95%; background-color: #ffbe81;"></div></center>
                  </td>
               </tr>
            </table>
            <table>
               <tbody>
                  <tr class="descriptions" style="font-size: 11px; margin: 0 5px;">
                     <th>
                        <div class="leters IZ" style="font-weight: 500; margin: 0 10px; text-align: left;">
                           <b style="font-weight: bold;">Fuente :</b>
                           Parrillada del COCO
                        </div>
                     </th>
                  </tr>
               </tbody>            
            </table>
            
            <table style="margin-bottom: 10px; padding-top: 2px !important; width: 100%;">
               <tbody>
                  <tr class="descriptions" style="font-size: 11px; margin: 0 5px;">
                     <th style="width: 33.3%">
                        <div class="leters IZ" style="font-weight: 500; margin: 0 10px; text-align: left;">
                           <b style="font-weight: bold;">Fecha de impresión :</b>
                           `+ moment().format('MMMM D, YYYY').replace(/\b\w/g, l => l.toUpperCase()) +`
                        </div>
                     </th>
                     <th style="width: 33.3%">
                        <div class="leters CEN" style="font-weight: 500; margin: 0 10px; text-align: center;">
                           <b style="font-weight: bold;">Hora de impresión :</b>
                           `+ moment().format('HH:mm:ss') +`
                        </div>
                     </th>
                     <th style="width: 33.3%">
                        <div class="leters DER" style="font-weight: 500; margin: 0 10px; text-align: right;">
                           <b style="font-weight: bold;">N° Página :</b>
                           {{page}} / {{pages}}
                        </div>
                     </th>
                  </tr>
               </tbody>            
            </table>`
      }
   }
};