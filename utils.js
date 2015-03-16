'use strict';

/*
============================================================= 
Helper functions for routes + dashboard controller
=============================================================
*/

var constants = require('./constants');


/* Return error message for dashboard page if no lising for tag */
module.exports.checkEmpty = function (listings) {
    if (listings.length === 0) {
        return constants.ERRORS.noResults;
    }
};

/* Returns lowercase tag with invalid characters removed */
module.exports.clean = function (tag) {
    tag = tag.toLowerCase()
        .replace(/-/g, ' ')
        .replace(/[`~!@#$%\^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .trim();
    return tag.length ? tag : null;
};

/* Checks if a tag meets Etsy's valid character requirements */
module.exports.isValid = function (tag) {
    return tag.charAt(0) !== '-' &&
        !(/[`~!@#$%\^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi.test(tag));
};
