import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { skyLayer, modelLayer } from './src/layers.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsZWJtYyIsImEiOiJja3F1ZGh4eDgwM2pzMnBwYngwdHk4anNoIn0.ynFiLgiuvax1jiCqEozo_A';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
  center: [-80.61, 28.6123],
  zoom: 15,
  pitch: 60,
  antialias: true
});

map.on('style.load', function () {
  // Render the created objects into the map
  map.addLayer(modelLayer([-80.6208, 28.6273], 'saturnV', 1));
  map.addLayer(modelLayer([-80.60405, 28.6084], 'falcon9', 100));
  map.addLayer(skyLayer);
});