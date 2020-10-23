

$('body').on('submit', '[class*="ajax-upload"]', uploadFile);
$('body').on('click', '.remove', removeFile);
$('body').on('click', '.approve', approveFile);
$('body').on('click', '.reject', rejectFile);

function startLoading() {
    NProgress.start();
    $('.btn').attr('disabled', 'disabled');
}
function doneLoading() {
    NProgress.done();
    $('[disabled]').removeAttr('disabled');
}

function removeFile(event) {
    event.preventDefault(); // Totally stop stuff happening

    var url = $(this).attr('data-href');
//        $('.progress-bar').show();
    startLoading()
    $.get(url, function (data) {
        console.log(data);
        if (typeof data.error === 'undefined')
        {
            // Success so call function to process the form
            console.log('DELETE SUCCESS');
            resetFileForm(data);
        } else {
            alert(data.error)
        }
        doneLoading()
    });

}
function approveFile(event) {
    event.preventDefault(); // Totally stop stuff happening

    var url = $(this).attr('data-href');
//        $('.progress-bar').show();
    startLoading()
    $.get(url, function (data) {
        console.log(data);
        if (typeof data.error === 'undefined')
        {
            // Success so call function to process the form
            console.log('Approve SUCCESS');
            approveFileForm(data);
        } else {
            alert(data.error)
        }
        doneLoading()
    });

}
function rejectFile(event) {
    event.preventDefault(); // Totally stop stuff happening

    var url = $(this).attr('data-href');
//        $('.progress-bar').show();
    startLoading()
    $.get(url, function (data) {
        console.log(data);
        if (typeof data.error === 'undefined')
        {
            // Success so call function to process the form
            console.log('Reject SUCCESS');
            rejectFileForm(data);
        } else {
            alert(data.error)
        }
        doneLoading()
    });

}

// Catch the form submit and upload the files
function uploadFile(event)
{
    event.stopPropagation(); // Stop stuff happening
    event.preventDefault(); // Totally stop stuff happening

    var form = $(this)[0];
    startLoading()
    $.ajax({
        // Your server script to process the upload
        url: form.action,
        type: 'POST',

        // Form data
        data: new FormData($(this)[0]),

        // Tell jQuery not to process data or worry about content-type
        // You *must* include these options!
        cache: false,
        contentType: false,
        processData: false,

        // Custom XMLHttpRequest
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                // For handling the progress of the upload
                myXhr.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        percent = e.loaded * 100 / e.total;
                        NProgress.inc(1 / percent);
                    }
                }, false);
            }

            return myXhr;
        },
        success: function (data, textStatus, jqXHR)
        {
            if (typeof data.error === 'undefined')
            {
                // Success so call function to process the form
                console.log('SUCCESS: ');
                console.log(data);
                setFileForm(data, data.OwnerID, data.OwnerName);

            } else
            {
                // Handle errors here
                console.log('ERRORS: ' + data.error);
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
        },
        complete: function ()
        {
            doneLoading()
            console.log('STOP LOADING SPINNER ');
            // STOP LOADING SPINNER
        },

    });

}



function approveFileForm(doc, id, owner) {
    console.log(doc);
    form = $('form[data-doc-name="' + doc.DocumentType.replace("/", "-") + '"]');
    form.find('.badge').removeClass('badge-info').removeClass('badge-danger').addClass('badge-success').html(doc.Status);
    form.find('.send').hide();
//    form.find('.remove').hide();
    form.find('.approve').hide();
    form.find('.reject').show();
}

function rejectFileForm(doc, id, owner) {
    form = $('form[data-doc-name="' + doc.DocumentType.replace("/", "-") + '"]');
    form.find('.badge').removeClass('badge-info').removeClass('badge-success').addClass('badge-danger').html(doc.Status);
    form.find('.send').hide();
//    form.find('.remove').hide();
    form.find('.reject').hide();
    form.find('.approve').show();
}
function setFileForm(doc, id, owner) {

    form = $('form[data-doc-name="' + doc.DocumentType.replace("/", "-") + '"]');
    form.find('.badge').html(doc.Status);
    form.find('a.open').html(getFileName(doc.DocumentFile));
    form.find('a.open').attr('href', doc.DocumentFile);
    form.find('.btn-open').attr('href', doc.DocumentFile).show();
    form.find('input[name="documentFile"]').hide();
    form.find('.send').hide();
    form.find('.remove').show().attr('data-href', '/' + owner + '/document/delete/' + id + '/' + doc.DocumentID + '/' + doc.DocumentType.replace("/", "-"));
    form.find('.approve').show().attr('data-href', '/' + owner + '/document/approve/' + id + '/' + doc.DocumentID + '/' + doc.DocumentType.replace("/", "-"));
    form.find('.reject').show().attr('data-href', '/' + owner + '/document/reject/' + id + '/' + doc.DocumentID + '/' + doc.DocumentType.replace("/", "-"));
    if (doc.Status === 'Approved') {
        return approveFileForm(doc);
    } else
    if (doc.Status === 'Rejected') {
        return rejectFileForm(doc);

    }
}
function resetFileForm(doc) {
    form = $('form[data-doc-name="' + doc.DocumentType + '"]');
    form.find('.badge').html('');
    form.find('a.open').html('').hide().attr('href', '');
    form.find('a.btn-open').attr('href', '').hide();
    form.find('input[name="documentFile"]').show();
    form.find('.send').show();
    form.find('.remove').hide().attr('data-href', '');
    form.find('.approve').hide().attr('data-href', '');
    form.find('.reject').hide().attr('data-href', '');
}
function getFileName(filePath) {
    return decodeURI(filePath.split("/").pop());
}