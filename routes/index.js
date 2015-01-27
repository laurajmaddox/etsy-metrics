var express = require('express');
var request = require('request');
var router = express.Router();


function createRequestUrl(search_tag, api_key) {
  var host = 'https://openapi.etsy.com';
  var path = '/v2/listings/active';
  var fields = {
    'limit': '100',
    'tags': search_tag,
    'fields': 'title,price,tags,views,num_favorers',
    'sort_on': 'score',
    'includes': 'MainImage',
    'api_key': api_key
  };
  
  var params = Object.keys(fields).map(function(key) {
    return key + '=' + fields[key];  
  }).join('&');

  return url = host + path + '?' + params;
}


router.post('/', function(req, res, next) {
  var url = createRequestUrl(req.body.search_tag, req.app.locals.config.api_key);

  request({url: url, json: true}, function(error, response, etsy_data) { 
    if (error) { throw error; }
   
    var sorted_results = (etsy_data.results || []).sort(function(a, b) {
      return b.views - a.views;
    });

    tags = {}

    sorted_results.forEach(function(listing) {
      for (i in listing.tags) {
        tags[listing.tags[i]] = (tags[listing.tags[i]] || 0) + 1;
      }
    });

    var sorted_tags = []

    for (var key in tags) {
      sorted_tags.push([key, tags[key]]);
    } 

    sorted_tags = sorted_tags.sort(function(a, b) {
      return b[1] - a[1];
    });

    res.render('index', { count: etsy_data.count, results: sorted_results, tags: sorted_tags });
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  var url = createRequestUrl('blue hat', req.app.locals.config.api_key);

  res.render('index', { count: 0, results: [] });
});


module.exports = router;
