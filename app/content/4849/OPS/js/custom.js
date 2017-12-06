$(function () {
var mediaSyncHotspot = $('.highlightElement');
    mediaSyncHotspot.each(function () {
        console.error($(this).css('left'), $(this).css('top'));
        $(this).css('left', parseInt($(this).css('left'), 10) - 8 + 'px');
        $(this).css('top', parseInt($(this).css('top'), 10) - 8 + 'px');
        console.error($(this).css('left'), $(this).css('top'));
    });
});
