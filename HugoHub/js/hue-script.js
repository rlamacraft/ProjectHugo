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
  getAllAlarms();
}

function updateFabButton(state) {
  if(state) {
    $('#FAB').css('background-color', '#F5F7F7').css('color', '#3CAA9C');
  } else {
    $('#FAB').css('background-color', '#3CAA9C').css('color', '#F5F7F7');
  }
}

function setScene() {
  tappedScene = $(this);
  hue = tappedScene.data('hue');
  sat = tappedScene.data('sat');
  bri = tappedScene.data('bri');
  setColor(url, username, defaultLight, hue, sat, bri);
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

function getAllAlarms() {
  get_request(url, username, "schedules", renderAllAlarms);
}

function renderAllAlarms(data) {
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      colours = data[key].command.body;
      if(colours.on === false) {
        hue = "0";
        sat = "100";
        bri = "0";
      } else {
        hue = Math.round(HueToHSL(colours.hue, 'hue'));
        sat = Math.round(HueToHSL(colours.sat, 'sat'));
        bri = Math.round(HueToHSL(colours.bri, 'bri'));
      }
      splotColour = 'hsl(' + hue + ',' + sat + '%,' + bri + '%)';
      splot = '<div class="splot" style="background-color:' + splotColour + '"></div>';
      nameLabel = '<h3>' + data[key].name + '</h3>';
      timeLabel = '<h5>' + data[key].time + '</h5>';
      labels = '<div class="labels">' + nameLabel + timeLabel + '</div>';

      $('#alarms-list').append('<li class="alarm" title="' + data[key].description + '">' + splot + labels + '</li>');
    }
  }
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
  var day = packTwoDigits(date.getDay());
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
