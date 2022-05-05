const { gql } = require('@urql/core');

const GET_ALL_BOLETOS = gql`
   query 
      allBoletos($password: String!) {
         allBoletos(pass: $password) {
            _id
            apellidos
            nombres
         }
      }
`;

module.exports = {
   GET_ALL_BOLETOS
};