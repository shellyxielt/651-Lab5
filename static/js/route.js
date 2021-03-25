var nav = new mapboxgl.NavigationControl();
 
var directions = new MapboxDirections({
accessToken: mapboxgl.accessToken,
unit: 'metric',
profile: 'mapbox/driving',
alternatives: 'false',
geometries: 'geojson'
});
 
map.scrollZoom.enable();
map.addControl(directions, 'top-right');
 
 
map.on('load', function (e) { 
//Create sources and layers for the returned routes.
//There will be a maximum of 3 results from the Directions API.
//We use a loop to create the sources and layers.
for (i = 0; i <= 2; i++) {
map.addSource('route' + i, {
type: 'geojson',
data: {
type: 'Feature'
}
});
 
map.addLayer({
id: 'route' + i,
type: 'line',
source: 'route' + i,
layout: {
'line-join': 'round',
'line-cap': 'round'
},
paint: {
'line-color': '#cccccc',
'line-opacity': 0.5,
'line-width': 13,
'line-blur': 0.5
}
});
}
});
 
directions.on('route', (e) => {
var reports = document.getElementById('reports');
reports.innerHTML = '';
var report = reports.appendChild(document.createElement('div'));
let routes = e.route;
 
//Hide all routes by setting the opacity to zero.
for (i = 0; i < 3; i++) {
map.setLayoutProperty('route' + i, 'visibility', 'none');
}
 
routes.forEach(function (route, i) {
route.id = i;
});
 
routes.forEach((e) => {
//Make each route visible, by setting the opacity to 50%.
map.setLayoutProperty('route' + e.id, 'visibility', 'visible');
 
//Get GeoJson LineString feature of route
var routeLine = polyline.toGeoJSON(e.geometry);
 
//Update the data for the route, updating the visual.
map.getSource('route' + e.id).setData(routeLine);
});
});