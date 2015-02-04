module.exports.createRequestUrl = function (search_term, api_key) {
  var host = 'https://openapi.etsy.com';
  var path = '/v2/listings/active';
  var fields = {
    'limit': '100',
    'tags': search_term,
    'fields': 'title,price,tags,views,num_favorers,original_creation_tsz',
    'sort_on': 'score',
    'includes': 'MainImage',
    'api_key': api_key
  };

  var params = Object.keys(fields).map(function(key) {
    return key + '=' + fields[key];  
  }).join('&');

  return host + path + '?' + params;
}
