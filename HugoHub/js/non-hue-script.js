$(document).ready( function() {

  $('.edit-slider').on('input', changingSlider);
  $('#delayOff').click(delayOff);

  $("#openDrawer").click(function() {
    $("body").addClass("editOpen");
  });
  $("#closeDrawer").click(function() {
    $("body").removeClass("editOpen");
  });

  $("body").click(function(e) {
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

  $(window).resize(updateSlant);
  updateSlant();
});

function updateSlant() {
  HEIGHT_OF_SLANT = 45;
  slantAngle = Math.atan(HEIGHT_OF_SLANT / $(window).width());
  $("#scenes #slant").css("transform", "rotateZ(" + slantAngle + "rad)")
}

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
  correctSliders();
}

function changingSlider() {
  updatePreview($('#hue-slider').val(), $('#sat-slider').val(), $('#bri-slider').val() );
}

function updatePreview(hue, sat, bri) {
  $('#edit-state-pane').css("background-color", "hsl(" + Math.round(HueToHSL(hue, 'hue')) + "," + Math.round(HueToHSL(sat, 'sat')) + "%," + Math.round(HueToHSL(bri, 'bri')) + "%)" );
  $('#statusLabel').html("hsl(" + Math.round(HueToHSL(hue, 'hue')) + "," + Math.round(HueToHSL(sat, 'sat')) + "%," + Math.round(HueToHSL(bri, 'bri')) + "%)");
}
