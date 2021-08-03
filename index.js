import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import {
  skyLayer,
  modelLayer,
  buildingLayer
} from './src/layers.js';
import { menuClick } from './src/menu';

let modelArray = [];
// Add models to the modelArray
// Will be handled by the import function 
modelArray[0] = modelLayer([-80.6208, 28.6273], 'saturnV', 1, 'Saturn V');
modelArray[1] = modelLayer([-80.60405, 28.6084], 'falcon9', 100, 'Falcon 9');

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

  // UI ELEMENTS
  // Full Screen option
  map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body') }));
  // Navigation Control
  var nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'bottom-right');
  // Start menu
  $("#menuBtn").on("click", menuClick);
  // Toggle Buildings Button
  $("#buildingBtn").on("click", toggelBuildings);
  // Geocoder Searchbar
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  });
  map.addControl(geocoder, 'top-left');
  // map.addControl(
  //   new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken,
  //     mapboxgl: mapboxgl
  //   }, 'top-right')
  // );

  // LAYERS 
  // load sky
  map.addLayer(skyLayer);
  // Load terrain
  map.addSource('mapbox-dem', {
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    'tileSize': 512,
    'maxzoom': 14
  });
  map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1 });
  // Load models 
  for (let model of modelArray) {
    map.addLayer(model);
  }
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

// Allowing the user to togglge the buildings
function toggelBuildings() {
  let btnColor = document.getElementById('buildingBtn');
  // let mapLayer = map.getLayer('route');
  if (!map.getLayer(buildingLayer.id)) {
    btnColor.style.backgroundColor = "#808080";
    map.addLayer(buildingLayer);
  } else {
    btnColor.style.backgroundColor = "#FFFFFF";
    map.removeLayer(buildingLayer.id);
  }
};