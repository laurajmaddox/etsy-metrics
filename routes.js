'use strict';

/* 
============================================================= 
App GET + POST routes
=============================================================
*/

var express = require('express');
var router = express.Router();

var Hashes = require('jshashes');
var Results = require('./results');

var constants = require('./constants');
var dashboard = require('./dashboard');
var helpers = require('./utils');


/* GET index view */
router.get('/', function (req, res, next) {
    res.render('index');
});

/* GET search route, clean tag, redirect to dashboard route */
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

    res.render('dashboard', {
        results: results,
        error: constants.ERRORS.invalidTag
    });

});

/* GET dashboard view for a tag search */
router.get('/tag/:tag', function (req, res, next) {
    if (!helpers.isValid(req.params.tag)) {
        return res.status(404).render('404');
    }

    var tag = helpers.clean(req.params.tag),
        cacheKey = new Hashes.SHA1().hex(tag),
        sort = req.query.sort || 'views';

    dashboard.cacheGet(cacheKey, function (results) {

        if (results && results.searchTerm === tag) {

            results = new Results(tag, results.total, results, true)
                .sortBy(constants.SORT_KEYS[sort]);

            res.render('dashboard', {
                results: results,
                title: results.searchTerm + ' - ',
                error: helpers.checkEmpty(results.listings)
            });

        } else {
            dashboard.etsyGet(
                tag,
                process.env.API_KEY,
                function (results, error) {
                    if (!error) {
                        error = helpers.checkEmpty(results.listings);
                        results = results.sortBy(constants.SORT_KEYS[sort]);
                        dashboard.cacheSet(cacheKey, results);
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