var map = L.map('mapid', {center: [51.05, -114.06],zoom:13,});
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWlra29yYW1vcyIsImEiOiJja2o4MTJicmcwNGF5MzBwN3c2eGpiajJhIn0.6u3ND0vC40NLgZfQJOvO2A'
}).addTo(map);

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var processed = new L.geoJSON().addTo(map);

var options = {
  position: 'topleft',
  draw: {
    polyline: {
      shapeOptions: {
          color: '#f357a1',
          weight: 4
      }
    },
    circle: false,
    rectangle: false,
    marker: false,
    },
  edit: {
    featureGroup: editableLayers,
    remove: false
  }
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

var polyline, simplified;

map.on('draw:created', function(e) {
  var type = e.layerType,
  layer = e.layer;

  polyline = e.layer.toGeoJSON();

  editableLayers.addLayer(layer);
});

document.getElementById('lineSimplify').addEventListener("click", function() {
  simplified = turf.simplify(polyline, {tolerance: 0.01, highQuality: false});
  console.log(simplified);
  processed.addData(simplified);
});

document.getElementById('lineClear').addEventListener("click", function() {
  processed.clearLayers();
  editableLayers.clearLayers();
});
