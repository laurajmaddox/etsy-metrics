'use strict';

/* 
============================================================= 
JS scripts for dashboard view
=============================================================
*/

/* Return the current listing sort option for Bootstrap pills */
function getUrlParameter(param) {
    var pageUrl = window.location.search.substring(1),
        urlParams = pageUrl.split('&'),
        i = 0,
        arg = '';

    for (i = 0; i < urlParams.length; i += 1) {
        arg = urlParams[i].split('=');
        if (arg[0] === param) { return arg[1]; }
    }
}

$(document).ready(function () {
    // Add active class to pill for current sort option
    var sort = getUrlParameter('sort') || 'views';
    $('.nav-pills li#sort-' + sort).addClass('active');

    // Toggle scroll to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scroll-top').fadeIn();
        } else {
            $('.scroll-top').fadeOut();
        }
    });
    
    //Click event to scroll to top
    $('.scroll-top').click(function () {
        $('html, body').animate({scrollTop : 0}, 500);
        return false;
    });
});
