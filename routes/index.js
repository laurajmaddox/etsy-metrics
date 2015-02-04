var express = require('express');
var request = require('request');
var router = express.Router();

var helpers = require('../lib/utils');
var Results = require('../lib/results');


/* POST tag search to index route, render dashboard view */
router.post('/', function(req, res, next) {
  var search_term = req.body.search_tag
  var url = helpers.createRequestUrl(search_term, req.app.locals.config.api_key);

  request({url: url, json: true}, function(error, response, etsy_data) { 
    if (error) { throw error; }

    res.render('dashboard', { 
      results: new Results(search_term, etsy_data.count, etsy_data.results) 
    });
  });
});

/* GET index view */
router.get('/', function(req, res, next) {
  res.render('index');
});


module.exports = router;
