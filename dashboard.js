'use strict';

/*
============================================================= 
Dashboard view controller + helper functions
=============================================================
*/

var request = require('request');

var Results = require('./results');

var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');


/* Creates URL string for Etsy API request */
var createRequestUrl = function (search_term, api_key) {
    var host = 'https://openapi.etsy.com';
    var path = '/v2/listings/active';
    var fields = {
        'limit': '100',
        'tags': search_term,
        'fields': 'title,price,tags,views,num_favorers,original_creation_tsz,url',
        'sort_on': 'score',
        'includes': 'MainImage(url_170x135)',
        'api_key': api_key
    };

    var params = Object.keys(fields).map(function (key) {
        return key + '=' + fields[key];
    }).join('&');

    return host + path + '?' + params;
};

/* Check cache for Results object matching tag */
module.exports.cacheGet = function (key, callback) {
    memcached.get(key, function (err, data) {
        return callback(data);
    });
};

/* Add Results from Etsy API request to cache */
module.exports.cacheSet = function (key, value, timeout) {
    timeout = timeout || 600;
    memcached.set(key, value, timeout, function (err, response) { });
};

/* Etsy API GET request for listings matching tag */
module.exports.etsyGet = function (tag, api_key, callback, next) {
    var url = createRequestUrl(tag, api_key);
    request({url: url, json: true}, function (err, response, etsy_data) {
        if (response.statusCode == 200) {
            return callback(new Results(tag, etsy_data.count, etsy_data.results));
        } else {
            return next({statusCode: response.statusCode, message: etsy_data});
        }
    });
};