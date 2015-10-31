$(document).ready( function() {

  $('#scenes-tab').click(function() {
    changeTab(this);
  });

  $('#alarms-tab').click(function() {
    changeTab(this);
  });

});

function changeTab(alink) {
  $(".tab").removeClass('active');
  $(alink).parent().addClass('active');

  $('section').hide().css('opacity', '0.0');
  tab = $('#' + $(alink).attr('data-tab'));
  tab.show().css('opacity', '1.0');
}
