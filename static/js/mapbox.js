mapboxgl.accessToken = 'pk.eyJ1Ijoic2hlbGx5eGllbHQiLCJhIjoiY2tsb3lucWZ1MHhzYjJ4cG12djl1eWd3diJ9.9kcdVU9p_jrvgY_CCom0_g';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/shellyxielt/ckmbtifxg5g9p17qq7q1w1uc4', // stylesheet location
  center: [-114.06, 51.05], // starting position
  zoom: 11 // starting zoom
});

map.on('load', function() {
  map.addLayer({
    id: 'hospitals',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: hospitals
    },
    layout: {
      'icon-image': 'doctor-15',
      'icon-allow-overlap': true
    },
    paint: { }
  });

  map.addLayer({
    id: 'schools',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: schools
    },
    layout: {
      'icon-image': 'school-11'
    },
    paint: { }
  });

  map.addSource('nearest-hospital', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });
});

var popup = new mapboxgl.Popup();

map.on('mousemove', function(e) {

  var features = map.queryRenderedFeatures(e.point, { layers: ['hospitals', 'schools'] });
  if (!features.length) {
    popup.remove();
    return;
  }

  var feature = features[0];

  popup.setLngLat(feature.geometry.coordinates)
  .setHTML('<h3>' + feature.properties.NAME + '</h3><p>' + feature.properties.ADDRESS + '</p>')
  .addTo(map);

  map.getCanvas().style.cursor = features.length ? 'pointer' : '';

});

map.on('click', function(e) {
  var schoolFeatures = map.queryRenderedFeatures(e.point, { layers: ['schools'] });
  if (!schoolFeatures.length) {
    return;
  }

  var schoolFeature = schoolFeatures[0];

  var nearestHospital = turf.nearest(schoolFeature, hospitals);

  if (nearestHospital !== null) {

    map.getSource('nearest-hospital').setData({
      type: 'FeatureCollection',
      features: [nearestHospital]
    });

    map.addLayer({
      id: 'nearest-hospital',
      type: 'circle',
      source: 'nearest-hospital',
      paint: {
        'circle-radius': 15,
        'circle-color': '#7b68ee'
      }
    }, 'hospitals');
  }
});
