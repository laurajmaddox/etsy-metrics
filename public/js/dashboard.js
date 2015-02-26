/* 
============================================================= 
JS scripts for dashboard view
=============================================================
*/

/* Return the current listing sort option for Bootstrap pills */
function getUrlParameter(param) {
    var pageUrl = window.location.search.substring(1),
        urlParams = pageUrl.split('&');
    for (var i = 0; i < urlParams.length; i++) {
        var arg = urlParams[i].split('=');
        if (arg[0] === param) { return arg[1]; }
    }
}      

/* Add active class to pill for current sort option */
$(document).ready(function () {
    var sort = getUrlParameter('sort') || 'views';
    $('.nav-pills li#sort-' + sort).addClass('active');
});
