'use strict';

/* 
============================================================= 
Results object for listings + stats from Etsy API response
=============================================================
*/

var Results = function (searchTerm, total, results, from_cache) {
    this.searchTerm = searchTerm;
    this.total = total < 50000 ? total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '50,000+';

    if (from_cache) {
        this.listings = results.listings;
        this.viewsDaily = results.viewsDaily;
        this.tagsSorted = results.tagsSorted;
    } else {
        this.viewsDaily = 0;
        var creationDate, i, k, key, listing, listingAge,
            listingViewsDaily, relevancy, tagCounts;
        tagCounts = {};

        for (i = 0; i < results.length; i += 1) {
            listing = results[i];
            listing.relevancy = results.length - i;

            // Add readable creation date to listing object
            creationDate = new Date(listing.original_creation_tsz * 1000);
            listing.creationDate = creationDate.toDateString().slice(4);

            // Calculate + add average daily views to listing object
            listingAge = Math.round((Date.now() - creationDate) / 86400000) || 1;
            listingViewsDaily = Math.round(listing.views / listingAge);

            listing.viewsDaily = listingViewsDaily;
            this.viewsDaily += listingViewsDaily;

            // Tally listing's tags in total counts
            for (k = 0; k < listing.tags.length; k += 1) {
                key = listing.tags[k].toLowerCase();
                tagCounts[key] = (tagCounts[key] || 0) + 1;
            }
        }
        this.viewsDaily = (this.viewsDaily / (results.length || 1)).toFixed(1);
        this.listings = results;
        this.tagsSorted = this.sortTags(tagCounts);
    }
};

Results.prototype.sortTags = function (counts) {
    var key, tags;
    tags = [];

    for (key in counts) {
        if (counts.hasOwnProperty(key)) {
            tags.push([key, counts[key]]);
        }
    }
    return tags.sort(function (a, b) {
        return b[1] - a[1];
    });
};

Results.prototype.sortBy = function (sort_by) {
    this.listings = (this.listings || []).sort(function (a, b) {
        return b[sort_by] - a[sort_by];
    });
    return this;
};


module.exports = Results;
