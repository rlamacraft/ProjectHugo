$(document).ready( function() {

  changeTab("#scenes-tab");

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
  $('#delayOff').click(delayOff);

  $("body").click(function(e) {
    console.log(e);
    $(".pulse").css({
      left : e.clientX - 50,
      top: e.clientY - 50,
      "animation-name": "pulse"
    });
    setTimeout(function() {
      $(".pulse").css({
        opacity: 0,
        "animation-name": ""
      });
    }, 300);
  });
});

function changeTab(alink) {
  //update tab bar
  $(".tab").removeClass('active');
  $(alink).parent().addClass('active');

  //update tabs
  $('.tabPane').removeClass('showTab')
  tab = $('#' + $(alink).attr('data-tab'));
  console.log(tab);
  tab.addClass('showTab');
}

function editState() {
  $('#edit-state-pane').addClass('show');
  correctSliders();
}

function closeEditState() {
  $('#edit-state-pane').removeClass('show');
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
