$(document).ready(function () {
  $('textarea[maxlength]').keyup(function () {
    var maxLength = $(this).prop('maxlength');
    var length = $(this).val().length;
    var length = maxLength - length;
    if ($(this).next().prop('class') !== 'charcount') {
      const charcount = "<span class='charcount'> <span class='count'></span> characters remaining<span>"
      $(this).after(charcount);
    }
    const charcount = $(this).next().find('.count');
    charcount.html(length);
  });

});