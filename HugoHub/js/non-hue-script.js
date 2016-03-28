$(document).ready( function() {

  $('.edit-slider').on('input', changingSlider);
  $('#delayOff').click(delayOff);

  $("#openDrawer").click(function() {
    $("body").addClass("editOpen");
  });
  $("#closeDrawer").click(function() {
    $("body").removeClass("editOpen");
  });

  scenesPanel = document.getElementById('scenes');
  var scenesPanelHammer = new Hammer(scenesPanel, {});
  scenesPanelHammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
  scenesPanelHammer.on('swipeup', function(ev) {
      $("body").addClass("editOpen");
  });

  editPanel = document.getElementById('edit-state-pane');
  var editPanelHammer = new Hammer(editPanel, {});
  editPanelHammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
  editPanelHammer.on('swipedown', function(ev) {
      $("body").removeClass("editOpen");
  });

  $("body").click(function(e) {
    $(".pulse").css({
      left : e.clientX - 50,
      top: e.clientY - 50,
      display: "block",
      "animation-name": "pulse"
    });
    setTimeout(function() {
      $(".pulse").css({
        opacity: 0,
        "animation-name": "",
        display: "none"
      });
    }, 300);
  });

  $(window).resize(updateSlant);
  updateSlant();

  $("#delayOff").click(function() {
    $("#delayOff").find(".thirty-div .colour").css("animation-name", "thirty-rotate").show();
    setTimeout(function() {
      $("#delayOff").find(".thirty-div#left .colour").css("opacity", "0.0");
    }, (25*1000))
    setTimeout(function() {
      $("#delayOff").find(".thirty-div .colour").css("animation-name", "none").hide();
      $("#delayOff").find(".thirty-div#left .colour").css("opacity", "1.0");
    }, (30*1000));
  })
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
