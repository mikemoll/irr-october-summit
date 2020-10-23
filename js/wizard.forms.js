$(document).ready(function () {
    $('body').on('click', "[data-toggle]", function () {
        var target = $(this).data('target');
        var disable = $(this).data('disable');
        if ($(this).data('toggle') === 'toggle') {
            $(disable).attr('disabled', !$(disable).attr('disabled')).focus();
            $(target).toggle();
        } else if ($(this).data('toggle') === 'show') {
            $(disable).attr('disabled', false).focus();
            $(target).removeClass('hidden');
        } else {
            $(disable).attr('disabled', true);
            $(target).addClass('hidden');
        }
    })






    $(".actions a").click(function () {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(".wizard").offset().top - 50
        }, 500);
    });


    if (item) {
        $("form select,input[type='text']").each(function () {
            var name = $(this).prop('name');
            // console.log(`name`, name);
            var deepName = name.split(']').join('').split('[')
            var value = getValueFromDeepName(item, deepName, 0);
            console.log(`value`, name, value);
            $(this).val(value);
            console.log(`$(this).val()`, $(this).val());
            console.log(`-------------------------------------`);
        });
        $("form input[type='radio']").each(function () {
            // console.log(`$(this)`, $(this));
            var name = $(this).prop('name');
            // console.log(`name`, name);
            var deepName = name.split(']').join('').split('[')
            // console.log(`deepNames`, deepName);

            var value = getValueFromDeepName(item, deepName, 0);
            // console.log(`value`, value);
            // console.log(`$(this).val()`, $(this).val());
            // console.log(`-------------------------------------`);
            if ($(this).val() === `${value}`) {
                // $(this).click().attr("checked","checked");;
                $(this).trigger('click');
            }
            // return;
        });
    }

    function getValueFromDeepName(item, deepName, step) {
        // console.log(`item`, item);
        // console.log(`deepName[step]`, deepName, step, deepName[step]);
        const element = item[deepName[step]];
        // console.log(`element1`, element, typeof element);
        if (element === null) {
            return '';
        } else if (typeof element !== 'object') {
            // console.log(`return element`, element);
            return element;
        } else {
            // console.log(`getValueFromDeepName(element, deepName,step++)`, element, deepName, step);
            return getValueFromDeepName(element, deepName, ++step)
        }
    }

    $("input[type='text'], select").each(function () {
        $(this).after(`<span class="filled"><i class="fa fa-check"></i></span>`)
    })

    //add "green checkmark" to all selects selected
    $("select").children("option:selected").each(function () {
        // console.log(`$(this)`, $(this));
        if ($(this).val() !== '') {
            $(this).parent().addClass('filled-field')
            $(this).parent().next().css('display', 'block')
        } else {
            $(this).parent().removeClass('filled-field')
            $(this).parent().next().css('display', 'none')
        }
    })
    //add "green checkmark" to all selects selected
    $("select").children("optgroup").each(function () {
        // console.log(`$(this)`, $(this));
        $(this).children("option:selected").each(function () {
            // console.log(`$(this)`, $(this));
            if ($(this).val() !== '') {
                $(this).parent().css('display', 'block')
                $(this).parent().parent().addClass('filled-field')
                $(this).parent().parent().next().css('display', 'block')
            } else {
                $(this).parent().parent().removeClass('filled-field')
                $(this).parent().parent().next().css('display', 'none')
            }
        })

    })

    // $('.actions').addClass('fix-bottom-on-scroll');

    //start progress bar at 0
    changeProgressbar(totalFieldsNotEmpty, totalFields)
    //start listener for changes on fields to save everithing
    startListenerSaveOnChange();

});

/**
 * save the whole form on field blur
 */
function startListenerSaveOnChange() {
    var inputValue = []
    $(".auto-save").on('focus', 'input', function () {
        //save value form field on focus to test latter if it had changed
        inputValue[$(this).prop('name')] = $(this).val();
    })
    $(".auto-save").on('change', " input[type='radio'], select,input[type='checkbox'] ", function () {
        //save form everytime you click a radio
        saveForm();
        //after save the form, add the "green ckeck mark" to the field
        if ($(this).children("option:selected").val() !== '') {
            $(this).addClass('filled-field')
            $(this).next().css('display', 'block')
        } else {
            $(this).removeClass('filled-field')
            $(this).next().css('display', 'none')

        }

    })
    $(".auto-save").on('blur', 'input', function () {
        //test if the field value haas changed on field Blur
        if (inputValue[$(this).prop('name')] !== $(this).val()) {
            //save form
            saveForm();
        }
    })

} /* end document ready */

function changeProgressbar(step, total) {
    const percent = step / total * 100;
    $('.progress-horizontal__progress').css('width', `${percent}%`)
    $('.progress-horizontal__label__value').html(`${number_format(percent, 0)}`)
}


function saveForm(finish) {
    finish = (typeof finish === 'undefined' ? false : true);
    $('.save-status').html('Saving...')
    const formData = new FormData(document.getElementById('form'));
    //it'll only save on Fabric if is the Finish button clicked
    formData.append('saveOnFabric', finish);
    if ($('#form').prop('action')) {
        $.ajax({
            url: $('#form').prop('action'),
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                let next = $('#form').data('next-url')
                if (finish) {
                    if (typeof next === 'undefined')
                        next = '/';
                    if (result.data.kycCompleted) {
                        openSuccessModal(result.data.message, next)
                        return;
                    }
                    window.location = next
                }
                $('.save-status').html('(All changes saved!)')
            },
            error: function (error) {
                $('.save-status').html('(Something wrong happened...)')
                console.log(`error`, error);
                // openErrorModal(error)
            },
        });
    }
}