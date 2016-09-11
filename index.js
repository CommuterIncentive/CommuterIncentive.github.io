$(document).ready(function(){
  buildMap()

  $('button#showAll').click(getLocs)
  $('button#bikeCrash').click(crashes)
  $('button#createRoute').click(calculateRouteFromAtoB)
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
    // console.log('hit')
    var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);

  // To make objects from clustering provder visible,
  // we need to add our layer to the map
    map.addLayer(clusteringLayer);
    clusteredDataProvider.addEventListener('tap', function(event) {
      // Log data bo`und to the marker that has been tapped:
      console.log(event.target.getData())
    })
    // for (var i = 0; i < data.accidents.length; i ++) {
    //   var row = data.accidents[i]
    //   var lat_long = {lat: row.lat, lng: row.lng}
    //   map.addObject(new H.map.Marker(lat_long));

    // }
  });
}

function buildMap(){
  platform = new H.service.Platform({
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

function addRouteShapeToMap(route){
  var strip = new H.geo.Strip(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    strip.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(strip, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 128, 255, 0.7)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.setViewBounds(polyline.getBounds(), true);
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToMap(route){
  var svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
    '</svg>',
    dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
    group = new  H.map.Group(),
    i,
    j;

  // Add a marker for each maneuver
  for (i = 0;  i < route.leg.length; i += 1) {
    for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];
      // Add a marker to the maneuvers group
      var marker =  new H.map.Marker({
        lat: maneuver.position.latitude,
        lng: maneuver.position.longitude} ,
        {icon: dotIcon});
      marker.instruction = maneuver.instruction;
      group.addObject(marker);
    }
  }

  group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getPosition());
    openBubble(
       evt.target.getPosition(), evt.target.instruction);
  }, false);

  // Add the maneuvers group to the map
  map.addObject(group);
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addWaypointsToPanel(waypoints){



  var nodeH3 = document.createElement('h3'),
    waypointLabels = [],
    i;


   for (i = 0;  i < waypoints.length; i += 1) {
    waypointLabels.push(waypoints[i].label)
   }

   nodeH3.textContent = waypointLabels.join(' - ');

  routeInstructionsContainer.innerHTML = '';
  routeInstructionsContainer.appendChild(nodeH3);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addSummaryToPanel(summary){
  var summaryDiv = document.createElement('div'),
   content = '';
   content += '<b>Total distance</b>: ' + summary.distance  + 'm. <br/>';
   content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';


  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft ='5%';
  summaryDiv.style.marginRight ='5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToPanel(route){



  var nodeOL = document.createElement('ol'),
    i,
    j;

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';
  nodeOL.className = 'directions';

     // Add a marker for each maneuver
  for (i = 0;  i < route.leg.length; i += 1) {
    for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];

      var li = document.createElement('li'),
        spanArrow = document.createElement('span'),
        spanInstruction = document.createElement('span');

      spanArrow.className = 'arrow '  + maneuver.action;
      spanInstruction.innerHTML = maneuver.instruction;
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    }
  }

  routeInstructionsContainer.appendChild(nodeOL);
}

function calculateRouteFromAtoB () {
  var waypoints = {}
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'shortest;pedestrian',
      representation: 'display',
      waypoint0: '37.7141,-122.4199', // St Paul's Cathedral
      waypoint1: '37.8081,-122.3985',  // Tate Modern
      waypoint2: '37.7081,-122.3985',  // Tate Modern
      routeattributes: 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action'
    };


  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}
/**
 * This function will be called once the Routing REST API provides a response
 * @param  {Object} result          A JSONP object representing the calculated route
 *
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
 */
function onSuccess(result) {
  var route = result.response.route[0];
 /*
  * The styling of the route response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addRouteShapeToMap(route);
  addManueversToMap(route);

  addWaypointsToPanel(route.waypoint);
  addManueversToPanel(route);
  addSummaryToPanel(route.summary);
  // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Ooops!');
}
