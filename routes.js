/* 
============================================================= 
App GET + POST routes
=============================================================
*/

var express = require('express');
var Hashes = require('jshashes');
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
    var tag = helpers.clean(req.query.tag);
    if (tag) {
        res.redirect('/tag/' + tag);
    } else {
        res.redirect('/tag/');
    }
});

/* GET empty dashboard view for empty or invalid tag query */
router.get('/tag/', function (req, res, next) {
    var results = new Results('&nbsp;', 0, constants.EMPTY_RESULTS_OBJECT);
    var error = 'Oops! It looks like your search was empty or included'
        + ' an invalid tag. Try starting a new search with a different tag.'
    res.render('dashboard', {results: results, error: error});
});

/* GET dashboard view for a tag search */
router.get('/tag/:tag', function (req, res, next) {
    if (!helpers.is_valid(req.params.tag)) {
        return res.status(404).render('404');
    }
    var tag = helpers.clean(req.params.tag);
    var sort = req.query.sort || 'views';
    var cache_key = new Hashes.SHA1().hex(tag);

    dashboard.cacheGet(cache_key, function (results) {
        if (results && results.searchTerm === tag) {
            results = new Results(tag, results.total, results, true)
                .sortBy(constants.SORT_KEYS[sort]);
            res.render('dashboard', {
                results: results,
                title: results.searchTerm + ' - ',
                error: helpers.check_empty(results.listings)
            });
        } else {
            dashboard.etsyGet(
                tag,
                req.app.locals.config.apiKey,
                function (results, error) {
                    if (!error) {
                        var error = helpers.check_empty(results.listings);
                        results = results.sortBy(constants.SORT_KEYS[sort]);
                        dashboard.cacheSet(cache_key, results);
                    }
                    res.render('dashboard', {
                        results: results,
                        title: results.searchTerm + ' - ',
                        error: error
                    });
                },
                next
            );
        }
    });
});

router.get('/about', function (req, res, next) {
    res.render('about', {title: 'About - '});
});

router.get('/help', function (req, res, next) {
    res.render('help', {title: 'Help - '});
});

router.get('/contact', function (req, res, next) {
    res.render('contact', {title: 'Contact - '});
});

module.exports = router;
