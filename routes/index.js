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

function getSortedTags(listings) {
  counts = {}

  listings.forEach(function (listing) {
    for (i in listing.tags) {
      key = listing.tags[i].toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  var tags = []

  for (var key in counts) {
    tags.push([key, counts[key]]);
  } 

  return tags.sort(function(a, b) {
    return b[1] - a[1];
  });
}

function sortListings(listings, sort_by) {
  return (listings || []).sort(function(a, b) {
      return b.views - a.views;
    });
}


/* POST tag search to index route, render dashboard view */
router.post('/', function(req, res, next) {
  var search_tag = req.body.search_tag
  var url = createRequestUrl(search_tag, req.app.locals.config.api_key);

  request({url: url, json: true}, function(error, response, etsy_data) { 
    if (error) { throw error; }
    
    var listings = sortListings(etsy_data.results, 'views');
    var tags = getSortedTags(listings);
    
    res.render('dashboard', { 
      search_term: search_tag, 
      count: etsy_data.count, 
      listings: listings, 
      tags: tags 
    });
  });
});

/* GET index view */
router.get('/', function(req, res, next) {
  res.render('index');
});


module.exports = router;
