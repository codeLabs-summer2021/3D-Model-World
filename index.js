import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { skyLayer, modelLayer } from './src/layers.js';
import menu from './src/menu';

// Start menu
menu();

// Start map
mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsZWJtYyIsImEiOiJja3F1ZGh4eDgwM2pzMnBwYngwdHk4anNoIn0.ynFiLgiuvax1jiCqEozo_A';
export const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
  center: [-80.61, 28.6123],
  zoom: 15,
  pitch: 60,
  antialias: true
});

// Load assets on map
map.on('style.load', function () {
  // load sky
  map.addLayer(skyLayer);

  // load terrain
  map.addSource('mapbox-dem', {
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    'tileSize': 512,
    'maxzoom': 14
  });
  map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1 });
});

// MAP FUNCTIONALITY
// Right-Click (Move Model)
let popup = new mapboxgl.Popup({ anchor: 'left' });
map.on('contextmenu', (e) => {
  let lngLat = { lng: e.lngLat.lng, lat: e.lngLat.lat };

  // Popup Properties
  const popupElement = document.createElement('div');
  popupElement.innerHTML = `Pick a Model to move...`;

  for (let model of modelArray) {
    let modelButton = document.createElement('div');
    modelButton.innerHTML = `<button> ${model.getName()} </button>`;
    modelButton.addEventListener('click', (e) => {
      model.moveTo(lngLat);
    });
    popupElement.appendChild(modelButton);
  }
  // Initiate the Popup
  popup
    .setLngLat(lngLat)
    .setDOMContent(popupElement)
    .addTo(map);
});

// Adding new model to the map
let modelArray = [];
export function addModel(model) {
  map.addLayer(model);
  modelArray.push(model);
};

export default map;