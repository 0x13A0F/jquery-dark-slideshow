window.myNameSpace = window.myNameSpace || {};

$(function () {


    // load images
    $.fn.addImage = function (filename, description) {
        var img = document.createElement('img');
        img.src = "images/" + filename;
        img.alt = description;
        img.className = "thumbnail";
        $(this).append(img);
    }

    // check if element is hidden after scrollbar
    $.fn.overflown = function () {
        var limitLeft = $('.wrapper').offset().left;
        var limitRight = limitLeft + $('.wrapper').width();
        var elemOffsetLeft = $(this[0]).offset().left;
        var elemOffsetRight = elemOffsetLeft + $(this[0]).width() / 2;
        return (elemOffsetRight > limitRight || elemOffsetLeft < limitLeft) ? true : false;
    }

    // scroll to the end of element
    function scrollToElement(el, direction) {
        element_width = el.width();
        scroll_left = $('.wrapper')[0].scrollLeft;
        if (direction == 'next')
            $('.wrapper')[0].scrollTo(scroll_left + element_width, 0);
        else if (direction == 'prev')
            $('.wrapper')[0].scrollTo(scroll_left - element_width, 0);
    }

    function showNextImg() {
        clearInterval(interv);
        interv = setInterval(showNextImg, 1500);

        var el = $('.selected');
        var counter = $('.counter');
        if (el.next().length != 0) {
            counter.text(el.index() + 1);
            if (el.next().overflown())
                scrollToElement(el, 'next');
            el.fadeOut(200, () => {
                el.next().trigger('click');
                el.show();
            });
        }
        else {
            $('.thumbnail:first').trigger('click');
            $('.wrapper')[0].scrollTo(0, 0);
            counter.text('1');
        }
        $('.toggleDiapo').attr('src', 'icons/pause_diapo.png');
    }

    function showPrevImg() {
        clearInterval(interv);
        interv = setInterval(showNextImg, 1500);

        var el = $('.selected');
        var counter = $('.counter');
        if (el.prev().length != 0) {
            counter.text(el.index() + 1);
            if (el.prev().overflown())
                scrollToElement(el, 'prev');
            el.prev().trigger('click');
        }
        else {
            $('.thumbnail:last').trigger('click');
            $('.wrapper')[0].scrollTo($('.wrapper')[0].scrollWidth, 0);
            counter.text($('.thumbnail:last').index() + 1);
        }
        $('.toggleDiapo').attr('src', 'icons/pause_diapo.png');
    }

    function previewImg(e) {
        if (e.originalEvent !== undefined) {
            $('.toggleDiapo').attr('src', 'icons/play_diapo.png');
            interv = clearInterval(interv);
        }
        var wrapper = $('.wrapper');
        var index = $(this).index();
        $('.selected').toggleClass('selected');
        $(this).toggleClass('selected')
        $("#caption").text($('.selected').attr('alt'));
        $('.counter').text(index + 1);
        var src = $(this).attr('src');
        $('#preview').fadeOut('fast', () => {
            $('#preview').attr('src', src);
            $('#preview').fadeIn('fast');
        });
    }

    function toggleDiapo() {
        interv = (interv != null) ? clearInterval(interv) : setInterval(showNextImg, 1500);
        var src = $('.toggleDiapo').attr('src');
        if (src == "icons/play_diapo.png")
            $('.toggleDiapo').attr('src', 'icons/pause_diapo.png');
        else
            $('.toggleDiapo').attr('src', 'icons/play_diapo.png');
    }

    function goFullscreen() {
        $('.toggleDiapo').attr('src', 'icons/play_diapo.png');
        interv = clearInterval(interv);

        var selected = $('.selected').attr('src');
        var container = $('.fullscreen-container');
        $('.fullscreen-div').css({
            'background-image': 'url(' + selected + ')',
            'background-size': 'cover'
        });
        container.fadeIn('slow');
        container.on('click', function () {
            $(this).fadeOut('slow');
        });
    }


    // show first image
    var first = $('.thumbnail:first').toggleClass('selected');
    $('.counter').text('1');
    $('#preview').attr('src', first.attr('src'));
    $("#caption").text(first.attr('alt'));
    // start auto diapo
    var interv;
    interv = setInterval(showNextImg, 1500);

    // setup event listeners
    $('.next').on('click', showNextImg);
    $('.prev').on('click', showPrevImg);
    $('.thumbnail').on('click', previewImg);
    $('.toggleDiapo').on('click', toggleDiapo);
    $('.fullscreen').on('click', goFullscreen);


});