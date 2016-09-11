$(document).ready(function(){
  buildMap()

  $('button').click(getLocs)
})

function buildMap(){
  var platform = new H.service.Platform({
    app_id: 'fdi5SvLAHRMOjrOobXsP',
    app_code: 'bjcmfvUu0dLGYD23ZDtePA',
    useCIT: true,
    useHTTPS: true
  });
  var defaultLayers = platform.createDefaultLayers()
    map = new H.Map(document.getElementById('map'),
      defaultLayers.terrain.map,{
      center: {lat:37.77, lng:-122.41},
      zoom: 13
    });
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);
}

function getLocs(){
  $.getJSON('/data/locations.json', function(data){
    for (var i = 0; i < data.data.length; i ++){
      console.log(data.data[i][14] === 'Installed')
      console.log(data.data[i][154])
      var row = data.data[i][24]

       var icon = data.data[i][14] == 'Installed' ? new H.map.Icon('img/yellow.png') : new H.map.Icon('img/r_bike.png')
        map.addObject(new H.map.Marker({lat: row[1], lng: row[2]}, {icon: icon}));
      }
  })}
