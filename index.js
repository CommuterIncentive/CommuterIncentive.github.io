// var ArcGIS = require('arcgis')
// var ago = ArcGIS({token: 'TCSF2016'})

$(document).ready(function(){
  console.log("ready!")
  getMap()
  $('button').click(getLocs)
})


function getMap(){
  require([
    "esri/Map",
    "esri/views/MapView",
    "dojo/domReady!"
  ], function(Map, MapView){
    var map = new Map({
      basemap: "streets"
    });
    var view = new MapView({
      container: "viewDiv",  // Reference to the scene div created in step 5
      map: map,  // Reference to the map object created before the scene
      zoom: 12,  // Sets the zoom level based on level of detail (LOD)
      center: [-122.41, 37.77]  // Sets the center point of view in lon/lat
    });
  });
}

// var oReq = new XMLHttpRequest();
// oReq.onload = reqListener;
// oReq.open("get", "yourFile.txt", true);
// oReq.send();

function getLocs(){
  $.getJSON('/data/locations.json', function(data){
    var lat_log = []
    // console.log(data.data)
    for (var i = 0; i < data.data.length; i ++){
      var row = data.data[i][24]
      lat_log.push(
        '<p>lat: ' + row[1] + ' long : ' + row[2] + '</p>'
      )
    }
    console.log(lat_log)
    $('#locationData').append(lat_log)
    $('#locationDate').append('adding things')
    // debugger

  })
  // var data = JSON.parse(this.responseText)
}
