var url = "";
var username = "";
var defaultLight = "";
var fabState = true; //TODO: Use get request

$(document).ready( function() {
  //get config data like IP and username of Hue Bridge
  getConfigData();

  //Hue Utility functions
  $.getScript("js/hue-utils.js", function(){
   console.log("Loaded Hue Utils");
   other_init()
 });

 $('.scene').click(setScene);
 $("#accept").click(saveEdits);
});

function getConfigData() {
  $.getJSON( "config.json", function( data ) {
    url = "http://" + data.ip + '/api';
    username = data.username;
    defaultLight = data.defaultLight;
    registerHueEvents();
  });
}

function registerHueEvents() {
  $('#FAB').click(FabClick);
}

function FabClick() {
  if(fabState) {
    turnOffLamp(url, username, defaultLight)
  } else {
    turnOnLamp(url, username, defaultLight);
  }
  fabState = !fabState;
}

function other_init() {
  //set fab to current state of lampNum
  get_lamp_status(url, username, defaultLight, function(data) {
      fabState = data.state.on;
      updateFabButton(fabState);
  });

  setSplotColours();
  correctSliders();

  // getAllAlarms();
}

function updateFabButton(state) {
  if(state) {
    $('#FAB').css('background-color', '#F5F7F7').css('color', '#607D8B').html("<span>ON</span>");
    // $('#FAB').css('background-color', '#F5F7F7').css('color', '#607D8B');
  } else {
    $('#FAB').css('background-color', '#607D8B').css('color', '#F5F7F7').html("<span>OFF</span>");
    // $('#FAB').css('background-color', '#607D8B').css('color', '#F5F7F7');
  }
}

function setScene() {
  tappedScene = $(this);
  hue = tappedScene.data('hue');
  sat = tappedScene.data('sat');
  bri = tappedScene.data('bri');
  setColor(url, username, defaultLight, hue, sat, bri);
  updatePreview(hue, sat, bri);
}

function setSplotColours() {
  allSplots = $('.splot');
  allSplots.each(function(eachSplot) {
    eachScene = $($(this).parent().parent());
    hue = Math.round(HueToHSL(eachScene.data('hue'), 'hue'));
    sat = Math.round(HueToHSL(eachScene.data('sat'), 'sat'));
    bri = Math.round(HueToHSL(eachScene.data('bri'), 'bri'));
    $(this).css("background-color", "hsl(" + hue + "," + sat + "%," + bri + "%)");
  });
}

function correctSliders() {
  get_request(url, username, "lights/" + defaultLight + "/", function( light ) {
    console.log(light.state);
    $('#hue-slider').val(light.state.hue);
    $('#sat-slider').val(light.state.sat);
    $('#bri-slider').val(light.state.bri);
    updatePreview(light.state.hue, light.state.sat, light.state.bri);
  })
}

function saveEdits() {
  var hue = $('#hue-slider').val();
  var sat = $('#sat-slider').val();
  var bri = $('#bri-slider').val();
  setColor(url, username, defaultLight, hue, sat, bri);
}

function delayOff() {
  var date = new Date();
  date.setSeconds(date.getSeconds() + 25);

  var packTwoDigits = function(str) {
    tmp = "00" + str;
    return(tmp.slice(-2,tmp.length));
  }
  var month = packTwoDigits(date.getMonth() + 1);
  var day = packTwoDigits(date.getDate());
  var hour = packTwoDigits(date.getHours());
  var minute = packTwoDigits(date.getMinutes());
  var seconds = packTwoDigits(date.getSeconds());

  var timestamp = date.getFullYear() + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + seconds;

  createAlarm(
    url,
    username,
    JSON.stringify({
      "name": "tmp30",
      "description" : "temporary alarm to turn off light in 30 seconds",
      "command" : {
        "address": "/api/" + username + "/lights/" + defaultLight + "/state",
        "method": "PUT",
        "body": {
          "on" : false,
          "transitiontime" : 50
        }
      },
      "localtime" : timestamp,
      "autodelete" : true
    })
  )
}
