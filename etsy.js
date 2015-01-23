var request = require('request');

var config = require('./local_config.json');


var url = 'https://openapi.etsy.com/v2/listings/active?api_key=' + config.api_key;

request(url, function(error, response, body) { 
    if (error) { throw error; }
    console.log(body);
});
