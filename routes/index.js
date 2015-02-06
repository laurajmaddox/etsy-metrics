var express = require('express');
var request = require('request');
var router = express.Router();

var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');

var helpers = require('../lib/utils');
var Results = require('../lib/results');


/* GET index view */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* POST tag search to index route, redirect to dashboard route */
router.post('/', function(req, res, next) {
  var search_term = req.body.search_tag
    .replace(/[\.,\/#!$%\^&\*;:{}=_`~()]/g, '')
    .replace(/\s+/g, '-').toLowerCase();
  res.redirect('/tag/' + search_term);
});

/* GET dashboard view for a tag search */
router.get('/tag/:search_tag', function(req, res, next) {
  var search_term = req.params.search_tag
    .replace(/[\.,\/#!$%\^&\*;:{}=_`~()]/g, '')
    .replace(/-/g, ' ').toLowerCase();
  var url = helpers.createRequestUrl(search_term, req.app.locals.config.api_key);

  request({url: url, json: true}, function(error, response, etsy_data) { 
    if (error) { throw error; }

    res.render('dashboard', { 
      results: new Results(search_term, etsy_data.count, etsy_data.results) 
    });
  });
});


module.exports = router;
