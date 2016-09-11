$(document).ready(function(){
  buildMap()

  $('button#showAll').click(getLocs)
  $('button#bikeCrash').click(crashes)
})

function crashes(){
  $.getJSON('/data/bikecrash.json', function(data){
    var dataPoints = data.accidents.map(function (item) {
      return new H.clustering.DataPoint(item.lat, item.lng);
    });
    // var clusterSvgTemplate = '<svg xmlns="http://www.w3.org/2000/svg" height="{diameter}" width="{diameter}">' +
    //   '<circle cx="{radius}px" cy="{radius}px" r="{radius}px" fill="red" />' +
    //   '</svg>';
    // console.log('hit')
    var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
      clusteringOptions: {
        // Maximum radius of the neighbourhood
        eps: 25,
        // minimum weight of points required to form a cluster
        minWeight: 1,
      },
      theme: {
    getClusterPresentation: function(cluster) {
    // Use cluster weight to change the icon size
      var weight = cluster.getWeight()
      // Calculate circle size
      radius = weight * 2,
      diameter = radius * 2,

      // Replace variables in the icon template
      // svgString = clusterSvgTemplate.replace(/\{radius\}/g, radius).replace(/\{diameter\}/g, diameter);

      // Create an icon
      // Note that we create a different icon depending from the weight of the cluster
      clusterIcon = new H.map.Icon('/img/x.svg', {
      size: {w: diameter, h: diameter},
      anchor: {x: radius, y: radius}
      }),

      // Create a marker for the cluster
      clusterMarker = new H.map.Marker(cluster.getPosition(), {
      icon: clusterIcon,

      // Set min/max zoom with values from the cluster, otherwise
      // clusters will be shown at all zoom levels
      min: cluster.getMinZoom(),
      max: cluster.getMaxZoom()
      });

    // Bind cluster data to the marker
    clusterMarker.setData(cluster);

    return clusterMarker;
    },
  getNoisePresentation: function(noisePoint) {
    // Create a marker for noise points:
    var noiseSvg = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px"><circle cx="5px" cy="5px" r="5px" fill="green" /></svg>';
    var noiseIcon = new H.map.Icon(noiseSvg, {
      size: { w: 20, h: 20 },
      anchor: { x: 10, y: 10},
      });

    var noiseMarker = new H.map.Marker(noisePoint.getPosition(), {
      icon: noiseIcon,

      // Use min zoom from a noise point to show it correctly at certain zoom levels
      min: noisePoint.getMinZoom()
      })
      noiseMarker.setData(noisePoint);
      return noiseMarker;
      }
    }})
    console.log('hit')
    var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);

  // To make objects from clustering provder visible,
  // we need to add our layer to the map
    map.addLayer(clusteringLayer);
    // for (var i = 0; i < data.accidents.length; i ++) {
    //   var row = data.accidents[i]
    //   var lat_long = {lat: row.lat, lng: row.lng}
    //   map.addObject(new H.map.Marker(lat_long));

    // }
  });
}

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
      var row = data.data[i][24]
      var icon = data.data[i][14] == 'Installed' ? new H.map.Icon('img/yellow.png') : new H.map.Icon('img/r_bike.png')
      map.addObject(new H.map.Marker({lat: row[1], lng: row[2]}, {icon: icon}));
    }
})}
