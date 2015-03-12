/*
============================================================= 
Helper functions for routes + dashboard controller
=============================================================
*/

/* Return error message for dashboard page if no lising for tag */
module.exports.check_empty = function (listings) {
    if (listings.length === 0) {
        return 'Looks like your tag is one of a kind! Etsy couldn\'t find any ' 
            + 'listings using that search term. Check to make sure your tag '
            + 'wasn\'t misspelled or longer than 20 characters.'
    }
}

/* Returns lowercase tag with invalid characters removed */
module.exports.clean = function (tag) {
    tag = tag.toLowerCase()
        .replace(/-/g, ' ')
        .replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .trim();
    if (tag.length > 0) {
        return tag;
    } else {
        return null;
    }
}

/* Checks if a tag meets Etsy's valid character requirements */
module.exports.is_valid = function (tag) {
    return tag.charAt(0) !== '-' && !(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi.test(tag));
}

/* Returns readable search term from URL slug */
module.exports.tagify = function (slug) {
    return slug.toLowerCase()
        .replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .replace(/-/g, ' ')
        .trim();
};

/* Returns slug from search term without spaces or invalid characters */
module.exports.slugify = function (search_term) {
    return search_term.toLowerCase()
        .replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .trim()
        .replace(/\s+/g, '-')
};
