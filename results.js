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
        var tagCounts = {};

        for (i in results) {
            var listing = results[i];

            // Add readable creation date to listing object
            var creationDate = new Date(listing.original_creation_tsz * 1000);
            listing['creationDate'] = creationDate.toDateString().slice(4)

            // Calculate + add average daily views to listing object
            var listingAge = Math.round((Date.now() - creationDate) / 86400000) || 1;
            var listingViewsDaily = Math.round(listing.views / listingAge);

            listing['viewsDaily'] = listingViewsDaily;
            this.viewsDaily += listingViewsDaily;

            // Tally listing's tags in total counts
            for (k in listing.tags) {
                key = listing.tags[k].toLowerCase();
                tagCounts[key] = (tagCounts[key] || 0) + 1;
            }
        }
        this.viewsDaily = (this.viewsDaily / (results.length || 1)).toFixed(1);
        this.listings = results;
        this.tagsSorted = this.sortTags(tagCounts);
    }
}

Results.prototype.sortTags = function (counts) {
    var tags = [];
    for (var key in counts) {
        tags.push([key, counts[key]]);
    } 
    return tags.sort(function(a, b) {
        return b[1] - a[1];
    });
}

Results.prototype.sortBy = function (sort_by) {
    this.listings = (this.listings || []).sort(function (a, b) {
        return b[sort_by] - a[sort_by];
    });
    return this;
};


module.exports = Results;
