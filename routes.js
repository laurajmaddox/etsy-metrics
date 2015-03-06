/* 
============================================================= 
App GET + POST routes
=============================================================
*/

var express = require('express');
var router = express.Router();

var constants = require('./constants');
var dashboard = require('./dashboard');
var helpers = require('./utils');

var Results = require('./results');


/* GET index view */
router.get('/', function (req, res, next) {
    res.render('index');
});

/* GET search route, redirect to dashboard route */
router.get('/search', function (req, res, next) {
    var tag = helpers.tagToSlug(req.query.tag);
    res.redirect('/tag/' + tag);
});

/* GET dashboard view with no search term entered */
router.get('/tag', function (req, res, next) {
    var empty_results = {
        listings: [],
        viewsDaily: 0,
        tagsSorted: []
    };
    var results = new Results('?', 0, empty_results, true)    
    res.render('dashboard', { results: results });
});

/* GET dashboard view for a tag search */
router.get('/tag/:slug', function (req, res, next) {
    var tag = req.params.slug;
    var sort = req.query.sort || 'views';
    dashboard.cacheGet(tag, function (results) {
        if (results) {
            results = new Results(helpers.tagFromSlug(tag), results.total, results, true)
                .sortBy(constants.SORT_KEYS[sort]);
            res.render('dashboard', {results: results});
        } else {
            dashboard.etsyGet(
                helpers.tagFromSlug(tag),
                req.app.locals.config.apiKey,
                function (results) {
                    results = results.sortBy(constants.SORT_KEYS[sort]);
                    dashboard.cacheSet(tag, results);
                    res.render('dashboard', {results: results});
                }
            );
        }
    });
});


module.exports = router;
