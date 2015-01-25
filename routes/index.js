var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var host = 'https://openapi.etsy.com';
  var path = '/v2/listings/active';
  var fields = {
    'limit': '100',
    'tags': 'dog collar',
    'fields': 'title,price,tags,views,num_favorers',
    'sort_on': 'score',
    'includes': 'MainImage',
    'api_key': req.app.locals.config.api_key
  };
  
  var params = Object.keys(fields).map(function(key) {
    return key + '=' + fields[key];  
  }).join('&');

  var url = host + path + '?' + params;

  request({url: url, json: true}, function(error, response, etsy_data) { 
    if (error) { throw error; }
    console.log(etsy_data);
    
    var sorted_results = (etsy_data.results || []).sort(function(a, b) {
      return b.views - a.views;
    });

    res.render('index', { count: etsy_data.count, results: sorted_results });
  });

});

module.exports = router;
