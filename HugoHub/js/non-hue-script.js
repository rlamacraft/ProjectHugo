$(document).ready( function() {

  $('#scenes-tab').click(function() {
    changeTab(this);
  });

  $('#alarms-tab').click(function() {
    changeTab(this);
  });

  $('#edit-icon').click(editState);
  $('#edit-state-close').click(closeEditState);
  $('#edit-state-save').click(saveEditState);
  $('.edit-slider').on('input', changingSlider);

});

function changeTab(alink) {
  $(".tab").removeClass('active');
  $(alink).parent().addClass('active');

  $('section').hide().css('opacity', '0.0');
  tab = $('#' + $(alink).attr('data-tab'));
  tab.show().css('opacity', '1.0');
}

function editState() {
  $('#edit-state-pane').show('slow');
  correctSliders();
}

function closeEditState() {
  $('#edit-state-pane').hide('slow');
}

function saveEditState() {
  closeEditState();
  saveEdits();
}

function changingSlider() {
updatePreview($('#hue-slider').val(), $('#sat-slider').val(), $('#bri-slider').val() );
}

function updatePreview(hue, sat, bri) {
  $('#edit-preview').css("background-color", "hsl(" + Math.round(HueToHSL(hue, 'hue')) + "," + Math.round(HueToHSL(sat, 'sat')) + "%," + Math.round(HueToHSL(bri, 'bri')) + "%)" );
}
