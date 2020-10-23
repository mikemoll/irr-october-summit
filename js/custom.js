function ajaxRequest(url, callback, event) {

    var url = url;
    var callback = callback;
    var event = event;
    //    console.log('ajaxRequest called on event ' + event + ' | url: ' + url + ' | callback: ' + callback);
    var ajaxCall = $.ajax({
        url: url,
        error: ajaxError,
        dataType: 'json'
    }).done(function (data, textStatus, jqXHR) {
        //        console.log('AJAX done: ' + callback);
        ajaxSuccess(callback, data, textStatus, jqXHR);
    });

}
function ajaxSuccess(callback, data, textStatus, jqXHR) {
    //    console.log("callback the function [" + callback + "] on $.ajax call");
    if (typeof callback === "function") {
        callback(data);
    } else {
        window[callback](data);
    }
}
$(document).bind("ajaxSend", function(){
    NProgress.start();
  }).bind("ajaxComplete", function(){
    NProgress.done();
  });
function ajaxError() {
    console.debug("ERROR on $.ajax call");
}

$(document).ready(function (p) {
    $('*[data-event*="load"]').each(function () {
        ajaxRequest($(this).attr('data-url'), $(this).attr('data-callback'), 'load');
    });

    /* === Control tabs next and previus === */
    $('.btnNext').click(function () {
        $("#btnNextId").attr("disabled", true);
        $('.nav-tabs').find('.active').parent().next('li').find('a').trigger('click');
        setTimeout(() => {
            $("#btnNextId").attr("disabled", false);
        }, 1500)
    });

    $('.btnPrevious').click(function () {
        $("#btnPreviousId").attr("disabled", true);
        $('.nav-tabs').find('.active').parent().prev('li').find('a').trigger('click');
        setTimeout(() => {
            $("#btnPreviousId").attr("disabled", false);
        }, 1500)
    });
    /*======== notifications ===============*/
    $('#notificationsDropdown').on('click', function () {
        ajaxRequest('/api/user/notifications/unread', function (data) {
            //            console.log(data);
            var html = '';
            data.data.forEach(function (item) {
                html += '<div class="notification  ' + item.Status + ' ng-scope"  style="">';
                html += '    <div class="notification-image-wrapper">';
                html += '        <div class="notification-image">';
                html += '            ' + item.Img + '';
                html += '        </div>';
                html += '    </div>';
                html += '    <div class="notification-text ng-binding">';
                html += '        <span class="highlight ng-binding">' + item.Title + '</span> <br>' + item.Message + '';
                html += '    </div>';
                html += '</div>';
            })

            $('.dropdown-body-notifications').html(html);
        })
    });

    // #17. BOOTSTRAP RELATED JS ACTIVATIONS

    // - Activate tooltips
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });

    $('.btn-share-whatsapp').each(function () { $(this).attr('href', getWhatsappLink()) });
    $('.btn-share-facebook').each(function () { $(this).attr('href', getFacebookLink()) });
    $('.btn-share-twitter').each(function () { $(this).attr('href', getTwitterLink()) });

    /* ==========  fix tabs on top  ====================== */
    if($('.fix-top-on-scroll').length > 0){
        const num = $('.fix-top-on-scroll').offset().top;
        const height = $('.fix-top-on-scroll').height();
        $(window).bind('scroll', function () {
            if ($(window).scrollTop() > num - height) {
                $(' .fix-top-on-scroll').addClass('fixed-top');
                $('.tabs .tab-invest').show();
            } else {
                $(' .fix-top-on-scroll').removeClass('fixed-top');
                $('.tabs .tab-invest').hide();
            }
        });
    }
    /* ========== /end  fix tabs on top  ====================== */
     /* ==========  datepicker  ====================== */
     $('body').on('click','.datepicker',function(){
        var options = {
            autoclose: true,
            format: 'mm/dd/yyyy',
        }
        $(this).datepicker(options);
        $(this).datepicker('show');
    })


    if ($('.datatable').length) {
        $('.datatable').DataTable();
    }
});

function getWhatsappLink() {
    var urlParam = window.location;
    var url = "https://api.whatsapp.com/send?text=" + encodeURI(`Check this deal on @REITIUM: ${urlParam}`);
    return url;
}
function getFacebookLink() {
    //                    <a id="facebookLink" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http%3A//localhost%3A4000/properties/z25DT32CxBUg0qISqsWamKOt_aq8j4BvIkiZAcZG">
    var urlParam = window.location;
    //        https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Freitiumdemo.com%2Fproperties%2Fz25DT32CxBUg0qISqsWamKOt_aq8j4BvIkiZAcZG&quote=
    var url = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURI(`Check this deal on @REITIUM: ${urlParam}`);
    return url;
}
function getTwitterLink() {
    var urlParam = window.location;
    var url = "https://twitter.com/intent/tweet?text=" + encodeURI(`Check this deal on @REITIUM: ${urlParam}`);
    return url;
}

/** This function takes an object and outputs a JSON string with a depth of 4 by default  */
function jsonStringify(input, level) {
    if (!input)
        return input;

    level = level || 4;

    var objectsAlreadySerialized = [input],
        objDepth = [input];

    return JSON.stringify(input, function (key, value) {
        if (key) {
            if (typeof value === 'object') {
                if (objectsAlreadySerialized.indexOf(value) !== -1)
                    return undefined;

                objectsAlreadySerialized.push(value);
            }

            if (objDepth.indexOf(this) === -1)
                objDepth.push(this);
            else while (objDepth[objDepth.length - 1] !== this)
                objDepth.pop();

            if (objDepth.length > level)
                return undefined;
        }

        return value;
    });
}

function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function getDaysLeft(date) {
    today = new Date();
    if (date === undefined) {
        date = '2019-12-25';
    }
    //    console.log(date);
    //        var cmas = new Date('2018-12-25');
    var cmas = new Date(date);
    var one_day = 1000 * 60 * 60 * 24;
    //    console.log(Math.ceil((cmas.getTime() - today.getTime()) / (one_day)) +
    //            " days left until " + date);
    return Math.ceil((cmas.getTime() - today.getTime()) / (one_day));
}

// bc 
function validateEmail(sEmail) {
    var filter = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    }
    else {
        return false;
    }
}