/* ========================================================================
 * The Ordinary #1 event page javascript
 * https://github.com/starsirius/the-ordinary-01
 *
 * Copyright 2013 Chung-Yi Chi
 * cychi1210@gmail.com
 * ======================================================================== */

(function($) {
    "use strict";

    $("#countdown").countdown({
        date: "december 28, 2013 12:00"
    });

    $('audio').mediaelementplayer({
        //audioWidth: 400,
        //audioHeight: 30, 
        features: ['playpause'], 
        alwaysShowControls: true, 
        iPadUseNativeControls: false,
        iPhoneUseNativeControls: false,
        AndroidUseNativeControls: false, 
        success: function(mediaElement, domObject, player) {
            var $buttonPlay = $(player.controls).find(".mejs-playpause-button > button"), 
            $buttonNext = $(player.container).closest(".step").find(".btn-next");
            $buttonPlay.addClass("icon-play");
            $(mediaElement).on("playing", function() {
                $buttonPlay.removeClass("icon-play").addClass("icon-pause");
            });
            $(mediaElement).on("pause ended", function() {
                $buttonPlay.removeClass("icon-pause").addClass("icon-play");
            });
            $(mediaElement).on("ended", function() {
                $buttonPlay.addClass("btn-secondary");
                $buttonNext.removeClass("hidden");
            });
        }
    });

    /******************
     * Steps transition
     ******************/
    $('.step').each(function(index) {
        var $btnNext = $(this).find('.btn-next'), 
            $self = $(this), $next = $self.next();

        if (index > 0) $self.hide();
        if ($next.length > 0) {
            $btnNext.click(function(){
                $self.hide();
                $next.show();
            });
        }
    });

    /******************
     * Device specific
     ******************/
    // Display customized UI for better mobile UX.
    var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent), 
        isAndroid = /(Android)/g.test(navigator.userAgent);

    if (isIOS) {
        $('.btn-pic-ios').show();
    } else if (isAndroid) {
        $('.btn-pic-android').show();
    } else {} 

    // Instagram
    var tagName    = 'theordinary01',
        count      = 30, 
        clientId   = '8738482a23134b12a365afc165e722fb', 
        baseUrl    = 'https://api.instagram.com/v1/', 
        endpoints  = { 
            tag: 'tags/' + tagName, 
            recent_media_with_tag: 'tags/' + tagName + '/media/recent'
        }, 
        tagApiUrl  = baseUrl + endpoints.tag + '?client_id=' + clientId,
        recentMediaWithTagApiUrl = baseUrl + endpoints.recent_media_with_tag + '?count=' + count + '&client_id=' + clientId; 

    // Get the media count first
    $.get(tagApiUrl, function(data) {
        $('#media_count').text(data.data.media_count);
        $('#hash_tag').text(tagName);
    }, 'jsonp');

    // Append the images to the gallery with pagination
    appendPaginatedInstagramPhotos('#gallery', '#view-more', recentMediaWithTagApiUrl);

    // Bind event handler to the view-more button
    $('#view-more').click(function(e) {
        var apiUrl = $(this).attr("data-api-url");
        e.preventDefault();
        appendPaginatedInstagramPhotos('#gallery', '#view-more', apiUrl);
    });

    function appendPaginatedInstagramPhotos($gallery, $more, apiUrl, template) {
        var template = template || '<a href="{{link}}" target="_blank"><img src="{{image}}" class="gallery-item"></a>';
        $.get(apiUrl, function(data) {
            var html = "", imageString = "", i, image;
            for (i = 0; i < data.data.length; i++) {
                image = data.data[i];
                imageString = _makeTemplate(template, {
                    model: image,
                    id: image.id,
                    link: image.link,
                    image: image.images.thumbnail.url,
                    caption: image.caption ? image.caption.text : '',
                    likes: image.likes.count,
                    comments: image.comments.count
                });
                html += imageString;
            }
            $($gallery).append(html);
            $($more).attr('data-api-url', (data.pagination.next_url || ''));
            if (!data.pagination.hasOwnProperty('next_url')) $($more).hide();
        }, 'jsonp');

        function _makeTemplate (template, data) {
            var output, pattern, varName, varValue, _ref;
            pattern = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/;
                output = template;
                while (pattern.test(output)) {
                    varName = output.match(pattern)[1];
                    varValue = data.hasOwnProperty(varName) ? data[varName] : "";
                    output = output.replace(pattern, "" + varValue);
                }
                return output;
        };
    }
})(jQuery); 
