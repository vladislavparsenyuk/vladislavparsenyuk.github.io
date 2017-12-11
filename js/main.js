$(function () {
    'use strict';

    var $cv = $('#cv');
    var $tree = $('#tree');
    var $about = $cv.find('.about');
    var $name = $cv.find('.header-name');
    var $es6 = $cv.find('.skills > span:eq(1)');
    var $experience = $cv.find('.experience');
    var $screenshot = $cv.find('.record:first .screenshot:last');
    var $lastRecord = $cv.find('.record:last');
    var $email = $cv.find('.contacts > ul > li:first');
    var $feedback = $cv.find('.feedback:eq(0)');
    var $photoshop = $cv.find('.skills > span:last');
    var $entanglement = $cv.find('.main .entanglement');

    new Butterfly({
        container: $cv,
        points: [
            { el: $about, x: -44, y: 2, id: 'topPoint' },
            { el: $name, x: 300, y: 63 },
            { el: $es6, x: 31, y: 10 },
            { el: $experience, x: 1, y: 16 },
            { el: $screenshot, x: 200, y: 0 },
            { el: $lastRecord, x: 1, y: 16 },
            { el: $tree, x: 33, y: 36, id: 'bottomPoint' },
            { el: $email, x: 9, y: 5 },
            { el: $feedback, x: 272, y: 36 },
            { el: $experience, x: 1, y: 16 },
            { el: $photoshop, x: 95, y: 12 },
        ],
    });

    $entanglement.entangle({ radius: 200 });


    // Tree animation
    $tree
        .on('click', () => $tree.addClass('rocking'))
        .on('animationend', () => $tree.removeClass('rocking'));
    
    
    // Toggle screenshot size & launch video
    $cv.on('click touchend', '.screenshot', (e) => {
        // on mobile devices video without controls
        // could be launched only by touch event and in full-screen mode
        var $screenshot = $(e.currentTarget);
        var video = $screenshot.find('video')[0];

        if (video) {
            e.preventDefault();
            video.paused ? video.play() : video.pause();
        }

        if (e.type == 'click') {
            $screenshot.toggleClass('full-size');
            $screenshot.find('.mac-scroll').scrollTop(0);
        }
    });
});