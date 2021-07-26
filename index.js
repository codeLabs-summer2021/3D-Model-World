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

let saturnV = modelLayer([-80.6208, 28.6273], 'saturnV', 1);
let falcon9 = modelLayer([-80.60405, 28.6084], 'falcon9', 100);
map.on('style.load', function () {
  // Render the created objects into the map
  map.addLayer(saturnV);
  map.addLayer(falcon9);
  map.addLayer(skyLayer);
});

// RIGHT-CLICK
let popup = new mapboxgl.Popup({anchor: 'left'});
map.on('contextmenu', (e) => {
  let lngLat = { lng: e.lngLat.lng, lat: e.lngLat.lat };

  // Popup Properties
  const popupElement = document.createElement('div');
  popupElement.innerHTML = `Pick a Model to move...`;

  // TODO: Create a loop to make a button for each model
  const modelButton = document.createElement('div');
  modelButton.innerHTML = `<button> Saturn V </button>`;
  modelButton.addEventListener('click', (e) => {
    moveModel(lngLat, saturnV)
  });
  const modelButton2 = document.createElement('div');
  modelButton2.innerHTML = `<button> Falcon 9 </button>`;
  modelButton2.addEventListener('click', (e) => {
    moveModel(lngLat, falcon9)
  });
  // Add buttons
  popupElement.appendChild(modelButton);
  popupElement.appendChild(modelButton2);

  // Initiate the Popup
  popup
    .setLngLat(lngLat)
    .setDOMContent(popupElement)
    .addTo(map);
});

function moveModel(lngLat, model) {
  map.removeLayer(model.id);
  // TODO: get size of model OR find how to move without removing (update position) 
  if (model === falcon9) {
    map.addLayer(modelLayer(lngLat, 'falcon9', 100));
  } else if ((model === saturnV)) {
    map.addLayer(modelLayer(lngLat, 'saturnV', 1));
  }
};