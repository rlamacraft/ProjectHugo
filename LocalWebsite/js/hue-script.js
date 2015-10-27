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
  console.log(fabState);
}

function other_init() {
  //set fab to current state of lampNum
  get_lamp_status(url, username, defaultLight, function(data) {
      fabState = data.state.on;
      updateFabButton(fabState);
  });

  //get all scenes
  get_all_scenes(url, username, function(data) {
    console.log(data);
    $.each(data, function(index, value) {
      console.log(value);
      hue = value.hue;
      console.log(hue);
      newSceneHTML = '<li class="scene"><div class="splot" style="background-color:blue"></div><h3>' + value.name + '</h3></li>'
      $('#scene-list').append(newSceneHTML);
    })
  })
}

function updateFabButton(state) {
  if(state) {
    $('#FAB').css('background-color', '#F5F7F7').css('color', '#3CAA9C');
  } else {
    $('#FAB').css('background-color', '#3CAA9C').css('color', '#F5F7F7');
  }
}
