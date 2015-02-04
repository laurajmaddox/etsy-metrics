// Results object for stats + listings from Etsy API response

var Results = function (search_term, total, results) {
    this.listings = results;
    this.search_term = search_term;
    this.total = total;

    this.sortBy('views');
    this.sorted_tags = this.getSortedTags();
}

Results.prototype.getListings = function () {
    return this.listings;
}

Results.prototype.getSortedTags = function () {
    var counts = {};
    var tags = [];

    this.listings.forEach(function (listing) {
        for (i in listing.tags) {
            key = listing.tags[i].toLowerCase();
            counts[key] = (counts[key] || 0) + 1;
        }
    });
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

