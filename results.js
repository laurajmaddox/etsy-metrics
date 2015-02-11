/* 
============================================================= 
Results object for stats + listings from Etsy API response
=============================================================
*/ 

var Results = function (search_term, total, results) {
    results = this.processListings(results)

    this.avg_views = results.avg_views;
    this.listings = results.listings;
    this.search_term = search_term;
    this.total = total;

    this.sortBy('views');
    
    this.sorted_tags = this.getSortedTags(results.tag_counts);
}

// Calculate average views + tag counts for Etsy API listing results
Results.prototype.processListings = function (results) {
    var avg_total = 0;
    var tag_counts = {};

    for (var i = 0; i < results.length; i++) {
        var listing = results[i];

        // Calculate average views per listing
        listing['avg_views'] = Math.round(
            listing.views/((Date.now() / 1000 - listing.original_creation_tsz)/ 86400)
        );
        avg_total += listing['avg_views'];
        
        // Increment tag counts
        for (var k = 0; k < listing.tags.length; k++) {
            key = listing.tags[k].toLowerCase();
            tag_counts[key] = (tag_counts[key] || 0) + 1;
        }
    }
    return {
        avg_views: (avg_total / 100).toFixed(1), 
        listings: results,
        tag_counts: tag_counts
    };
}

Results.prototype.getSortedTags = function (counts) {
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
};


module.exports = Results;

