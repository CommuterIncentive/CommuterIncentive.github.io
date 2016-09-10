// var ArcGIS = require('arcgis')
// var ago = ArcGIS({token: 'TCSF2016'})

$(document).ready(function(){
  // $('button').click(getMQData)
  require([
    "esri/Map",
    "esri/views/MapView",
    "dojo/domReady!"
  ], function(Map, MapView) {
    // Code to create the map and view will go here
     var map = new Map({
      basemap: "streets"
    });
     var view = new MapView({
      container: "viewDiv",  // Reference to the DOM node that will contain the view
      map: map               // References the map object created in step 3
    });
  });
})

//   // $ajax.get()

// function getMapData(){

//   // ago.require(["esri/Basemap"], function(Basemap) {
//   //     console.log(Basemap)
//   //  });
//   // var mqKey = 'UShjaMayAC4UkuBJ5nu5rqFuraxzEOQU'
//   // $.get('https://www.mapquestapi.com/traffic/v2/incidents?&outFormat=json&boundingBox=39.812228252889135%2C-104.85694885253905%2C39.66438516223036%2C-105.11306762695312&key=' + mqKey, function(data){
//   //   console.log('hit')
//   //   $('body').append(data)
//   //   // debugger
//   // })
// }

