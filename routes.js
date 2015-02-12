var express = require('express');
var router = express.Router();

var dashboard = require('./dashboard');
var helpers = require('./utils')

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

/* GET dashboard view for a tag search */
router.get('/tag/:slug', function (req, res, next) {
    var tag = req.params.slug;
    dashboard.cacheGet(tag, function (results) {
        if (!results) {
            dashboard.etsyGet(
                helpers.tagFromSlug(tag),
                req.app.locals.config.apiKey,
                function (results) {
                    dashboard.cacheSet(tag, results);
                    res.render('dashboard', {results: results});
                }
            );
        } else {
            res.render('dashboard', {results: results});
        }   
    });
});


module.exports = router;
