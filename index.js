require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/geometry/Point",
  "esri/symbols/SimpleMarkerSymbol",
  // "esri/SpatialReference"
], function(Map, MapView, Point, FeatureLayer ){
  map = new Map({
    basemap: "streets"
  });


  // map.on('load', getLocs)
  view = new MapView({
    container: "viewDiv",  // Reference to the scene div created in step 5
    map: map,  // Reference to the map object created before the scene
    zoom: 12,  // Sets the zoom level based on level of detail (LOD)
    center: [-122.41, 37.77]  // Sets the center point of view in lon/lat
  });

});

$(document).ready(function(){
  // console.log("ready!")
  // getMap()
  $('button').click(getLocs)
})


// function getMap(){
// }
   // require(["esri/layers/FeatureLayer"], function(Layer){

   //  map.add()
   //  });

function getLocs(){
  $.getJSON('/data/locations.json', function(data){
    var lat_log = []
    var iconPath = "M24.0,2.199C11.9595,2.199,2.199,11.9595,2.199,24.0c0.0,12.0405,9.7605,21.801,21.801,21.801c12.0405,0.0,21.801-9.7605,21.801-21.801C45.801,11.9595,36.0405,2.199,24.0,2.199zM31.0935,11.0625c1.401,0.0,2.532,2.2245,2.532,4.968S32.4915,21.0,31.0935,21.0c-1.398,0.0-2.532-2.2245-2.532-4.968S29.697,11.0625,31.0935,11.0625zM16.656,11.0625c1.398,0.0,2.532,2.2245,2.532,4.968S18.0555,21.0,16.656,21.0s-2.532-2.2245-2.532-4.968S15.258,11.0625,16.656,11.0625zM24.0315,39.0c-4.3095,0.0-8.3445-2.6355-11.8185-7.2165c3.5955,2.346,7.5315,3.654,11.661,3.654c4.3845,0.0,8.5515-1.47,12.3225-4.101C32.649,36.198,28.485,39.0,24.0315,39.0z";
    var initColor = "#ce641d";
    // var lat_log_html = []
    // console.log(data.data)
    // for (var i = 0; i < data.data.length; i ++){
    //   var row = data.data[i][24]
    //   lat_log_html.push(
    //     '<p>lat: ' + row[1] + ' long : ' + row[2] + '</p>'
    //   )
    //   lat_log.push([row[1], row[2]])
    // }
    // console.log(lat_log)
    // $('#locationData').append(lat_log)
    // $('#locationDate').append('adding things')
    // debugger
    console.log("hit!")
    require([
        "esri/map", "esri/geometry/Point",
        "esri/symbols/SimpleMarkerSymbol", "esri/graphic",
        "dojo/_base/array", "dojo/dom-style", "dojox/widget/ColorPicker",
      ], function(
        Map, Point,
        SimpleMarkerSymbol, Graphic,
        arrayUtils, domStyle, ColorPicker
      ){
       // var counter = new Graphic(new Point([-122.41, 37.77]), createSymbol(iconPath, initColor))
       var counter2 = new Graphic(new Point([37.77, -122.41]), createSymbol(iconPath, initColor))
       // map.graphics.add(counter)
       map.graphics.add(counter2)
      var colorPicker = new ColorPicker({}, "picker1");
        colorPicker.setColor(initColor);
        domStyle.set(colorPicker, "left", "500px");
        colorPicker.on("change", function(){
          var colorCode = this.hexCode.value;
          map.graphics.graphics.forEach(function(graphic){
            graphic.setSymbol(createSymbol(iconPath, colorCode));
          });
        });
        function createSymbol(path, color){
          var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
          markerSymbol.setPath(path);
          markerSymbol.setColor(new dojo.Color(color));
          markerSymbol.setOutline(null);
          return markerSymbol;
        }
        // console.log(counter2)
       view = new MapView({
        container: "viewDiv",  // Reference to the scene div created in step 5
        map: map,  // Reference to the map object created before the scene
        zoom: 12,  // Sets the zoom level based on level of detail (LOD)
        center: [-122.41, 37.77]  // Sets the center point of view in lon/lat
      });
    }
  // var data = JSON.parse(this.responseText)
)})}
