var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var url = 'https://openapi.etsy.com/v2/listings/active?limit=5&tags=feminine dog collar&fields=title,price,tags,views,num_favorers&sort_on=score&api_key=' + req.app.locals.config.api_key;
  
  request({url: url, json: true}, function(error, response, body) { 
    if (error) { throw error; }
    res.render('index', { etsy_data: JSON.stringify(body) });
  });

});

module.exports = router;
