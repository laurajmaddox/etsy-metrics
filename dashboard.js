'use strict';

/*
============================================================= 
Dashboard view controller + helper functions
=============================================================
*/

var request = require('request');

var Results = require('./results');
var constants = require('./constants');

var memjs = require('memjs');
var client = memjs.Client.create(process.env.MEMCACHEDCLOUD_SERVERS, {
    username: process.env.MEMCACHEDCLOUD_USERNAME,
    password: process.env.MEMCACHEDCLOUD_PASSWORD
});


/* Creates URL string for Etsy API request */
var createRequestUrl = function (searchTerm, apiKey) {
    var fields, host, params, path;
    host = 'https://openapi.etsy.com';
    path = '/v2/listings/active';
    fields = {
        'limit': '100',
        'tags': searchTerm,
        'fields': 'title,price,tags,views,num_favorers,original_creation_tsz,url',
        'sort_on': 'score',
        'includes': 'MainImage(url_170x135)',
        'api_key': apiKey
    };

    params = Object.keys(fields).map(function (key) {
        return key + '=' + fields[key];
    }).join('&');

    return host + path + '?' + params;
};

/* Check cache for Results object matching tag */
module.exports.cacheGet = function (key, callback) {
    client.get(key, function (err, data) {
        if (data) { 
            data = JSON.parse(data.toString()); 
        }
        return callback(data);
    });
};

/* Add Results from Etsy API request to cache */
module.exports.cacheSet = function (key, value, timeout) {
    timeout = timeout || 600;
    client.set(key, JSON.stringify(value), function (err, response) { 
        if (err) { console.log(err); }
    }, timeout);
};

/* Etsy API GET request for listings matching tag */
module.exports.etsyGet = function (tag, apiKey, callback, next) {
    var url = createRequestUrl(tag, apiKey);

    request({url: url, json: true}, function (err, response, etsyData) {
        if (response.statusCode === 200) {
            return callback(new Results(tag, etsyData.count, etsyData.results));
        } else if (response.statusCode === 403) {
            return callback(
                new Results(tag, 0, constants.EMPTY_RESULTS_OBJECT),
                constants.ERRORS.apiLimit
            );
        } else {
            return next({statusCode: response.statusCode, message: etsyData});
        }
    });
};