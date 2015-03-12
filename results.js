'use strict';

/* 
============================================================= 
Results object for listings + stats from Etsy API response
=============================================================
*/

var Results = function (searchTerm, total, results, from_cache) {
    this.searchTerm = searchTerm;
    this.total = total;

    if (from_cache) {
        this.listings = results.listings;
        this.viewsDaily = results.viewsDaily;
        this.tagsSorted = results.tagsSorted;
    } else {
        this.viewsDaily = 0;
        var creationDate, i, k, key, listing, listingAge,
            listingViewsDaily, relevancy, tagCounts;
        tagCounts = {};

        var nonempty_listings = [];

        for (i = 0; i < results.length; i += 1) {
            listing = results[i];

            // Check if listing is empty before proceeding    
            if (listing.title && listing.views) {

                listing.relevancy = results.length - i;

                // Save thumbnail URL or replace with blank if no image
                listing.image_url = listing.MainImage ? listing.MainImage.url_170x135 : 'image/blank_thumbnail.png';

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
                for (k = 0; k < listing.tags.length; k += 1) {
                    key = listing.tags[k].toLowerCase();
                    tagCounts[key] = (tagCounts[key] || 0) + 1;
                }
            // Add to nonempty list    
            nonempty_listings.push(listing);
            }
        }

        // Save the array of listings that contained data
        this.listings = nonempty_listings;
        
        this.viewsDaily = (this.viewsDaily / (nonempty_listings.length || 1)).toFixed(1);
        this.tagsSorted = this.sortTags(tagCounts, total);
    }
};

Results.prototype.sortTags = function (counts, total) {
    var key, tags, percent;
    tags = [];

    for (key in counts) {
        if (counts.hasOwnProperty(key)) {
            total = total > 100 ? 100 : total;
            percent = Math.round(counts[key] / total * 100);
            tags.push([key, percent]);
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

Results.prototype.stringify_total = function () {
    return this.total < 50000 ? this.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '50,000+';
}

module.exports = Results;
