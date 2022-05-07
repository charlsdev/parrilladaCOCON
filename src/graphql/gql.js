require('isomorphic-unfetch');

const { 
   createClient
} = require('@urql/core');

const client = createClient({
   url: 'https://biinggql.herokuapp.com/graphql',
   maskTypename: true   // Remove __typename of the result data
});

module.exports = {
   client
};