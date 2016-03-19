function turnOnLamp(domain, username, lampNum) {
  put_request(domain, username, "lights/" + lampNum + "/state", '{"on": true}' );
  updateFabButton(true);
}

function setColor(domain, username, lampNum, hue, sat, bri) {
  json = '{"on": true, "hue": ' + hue + ', "sat": ' + sat + ', "bri": ' + bri + '}';
  put_request(domain, username, "lights/" + lampNum + "/state", json );
  updateFabButton(true);
}

function turnOffLamp(domain, username, lampNum) {
  put_request(domain, username, "lights/" + lampNum + "/state", '{"on": false}' )
  updateFabButton(false);
}

function post_request(domain, username, url, data) {
  jQuery.ajax({
         type: "POST",
         url: domain + '/' + username + '/' + url,
         contentType: "application/json; charset=utf-8",
         data: data,
         dataType: "json",
         success: function (data, status, jqXHR) {
             // do something
             console.log(data)
         },
         error: function (jqXHR, status) {
             // error handler
             console.log(status)
         }
   });
}


function put_request(domain, username, url, data) {
  jQuery.ajax({
         type: "PUT",
         url: domain + '/' + username + '/' + url,
         contentType: "application/json; charset=utf-8",
         data: data,
         dataType: "json",
         success: function (data, status, jqXHR) {
             // do something
             console.log(data)
         },
         error: function (jqXHR, status) {
             // error handler
             console.log(status)
         }
   });
}

function get_request(domain, username, url, success) {
  jQuery.ajax({
         type: "GET",
         url: domain + '/' + username + '/' + url,
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             // do something
             success(data);
         },
         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
   });
}

function get_lamp_status(domain, username, lightNum, success) {
  get_status_url = "lights/" + lightNum;
  return(get_request(domain, username, get_status_url, success));
}

function get_all_scenes(domain, username, success) {
  get_scenes_url = "scenes";
  return(get_request(domain, username, get_scenes_url, success))
}

function HueToHSL(value, component, rounded) {
  if(typeof(rounded) === "undefined")
    rounded = false;
  if(component === "hue") {
    ret = value/(265*265)*360
  } else {
    ret = value/265*100
  }
  if(rounded)
    return(Math.round(ret))
  else {
    return(ret);
  }
}

function HSLToHue(value, component) {
  if(component == "hue") {
    return(value/360*(265*265))
  } else {
    return(value/100*265)
  }
}

function createAlarm(domain, username, data ) {
  post_request(domain, username, "schedules/", data);
}
