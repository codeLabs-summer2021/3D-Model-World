import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { skyLayer, modelLayer } from './src/layers.js';

let modelArray = [];

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsZWJtYyIsImEiOiJja3F1ZGh4eDgwM2pzMnBwYngwdHk4anNoIn0.ynFiLgiuvax1jiCqEozo_A';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
  center: [-80.61, 28.6123],
  zoom: 15,
  pitch: 60,
  antialias: true
});

// Add models to the modelArray
modelArray[0] = modelLayer([-80.6208, 28.6273], 'saturnV', 1, 'Saturn V');
modelArray[1] = modelLayer([-80.60405, 28.6084], 'falcon9', 100, 'Falcon 9');

// Load assets on map
map.on('style.load', function () {
  for (let model of modelArray) {
    map.addLayer(model);
  }
  map.addLayer(skyLayer);
});

// RIGHT-CLICK
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
      moveModel(lngLat, modelArray[0])
    });
    popupElement.appendChild(modelButton);
  }
  // Initiate the Popup
  popup
    .setLngLat(lngLat)
    .setDOMContent(popupElement)
    .addTo(map);
});

function moveModel(lngLat, model) {
  model.moveTo(lngLat);
};