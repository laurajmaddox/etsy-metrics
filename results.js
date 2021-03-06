'use strict';

/* 
============================================================= 
Results object for listings + stats from Etsy API response
=============================================================
*/

var Results = function (searchTerm, total, results, fromCache) {
    this.searchTerm = searchTerm;
    this.total = total;

    var tagCounts = {};

    function countTags(tags) {
        var k, key;
        for (k = 0; k < tags.length; k += 1) {
            key = tags[k].toLowerCase();
            tagCounts[key] = (tagCounts[key] || 0) + 1;
        }
    }

    function sortTags(counts, total) {
        var key, tags, percent;
        tags = [];
        total = total > 100 ? 100 : total;

        for (key in counts) {
            if (counts.hasOwnProperty(key)) {
                percent = Math.round(counts[key] / total * 100);
                tags.push([key, percent]);
            }
        }

        return tags.sort(function (a, b) {
            return b[1] - a[1];
        });
    }

    if (fromCache) {

        this.listings = results.listings;
        this.viewsDaily = results.viewsDaily;
        this.tagsSorted = results.tagsSorted;

    } else {

        this.viewsDaily = 0;
        var creationDate, i, listing, listingAge, listingViewsDaily, nonemptyListings;

        nonemptyListings = [];
        tagCounts = {};

        for (i = 0; i < results.length; i += 1) {
            listing = results[i];

            // Check for the occasional empty listing
            if (!listing.url) {
                continue;
            }

            listing.relevancy = results.length - i;

            // Add shop info for listing
            listing.shop = listing.Shop

            // Save thumbnail URL or replace with blank if no image
            listing.imageUrl = listing.MainImage ? listing.MainImage.url_170x135 : 'image/blank_thumbnail.png';

            // Add readable creation date to listing object
            creationDate = new Date(listing.original_creation_tsz * 1000);
            listing.creationDate = creationDate.toDateString().slice(4);

            // Calculate + add average daily views to listing object
            listingAge = Math.round((Date.now() - creationDate) / 86400000) || 1;
            listingViewsDaily = Math.round((listing.views || 0) / listingAge);

            listing.viewsDaily = listingViewsDaily;
            this.viewsDaily += listingViewsDaily;

            // Tally listing's tags in total counts
            listing.tags = listing.tags || [];
            countTags(listing.tags);

            // Add to nonempty array    
            nonemptyListings.push(listing);
        }

        // Save the array of listings that contained data
        this.listings = nonemptyListings;

        this.viewsDaily = (this.viewsDaily / (nonemptyListings.length || 1)).toFixed(1);
        this.tagsSorted = sortTags(tagCounts, total);
    }
};

Results.prototype.sortBy = function (sortOption) {
    this.listings = (this.listings || []).sort(function (a, b) {
        return b[sortOption] - a[sortOption];
    });
    return this;
};

Results.prototype.stringifyTotal = function () {
    return this.total < 50000 ?
        this.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '50,000+';
};

module.exports = Results;
