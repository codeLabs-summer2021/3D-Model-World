import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { skyLayer, modelLayer } from './src/layers.js';
import SketchfabIntegration from "./SketchfabIntegration.js";

$("#authenticate").on("click", authenticateUser);
$("#submitLink").on("click", getSketchfabModelUrl);
$("#linkSketchfab").hide();
$("#submitLink").hide();

let modelgltfURL;

const sketchfabIntegration = new SketchfabIntegration();
sketchfabIntegration.checkToken();

function authenticateUser() {
  sketchfabIntegration.authenticate();
  // After authentication, check for token 
  sketchfabIntegration.checkToken();
  // Token hardcoced for testing purposes
  // sketchfabIntegration.token = "pPstovaqjLqqLFx3jRgnXl7ScdTM1V";
  // sketchfabIntegration.checkToken();
  if (sketchfabIntegration.token != null) {
    $("#linkSketchfab").show();
    $("#submitLink").show();
  }
  // console.log("Authenticating");
}

async function getSketchfabModelUrl() {
  let modelURL = $("#linkSketchfab").val();
  console.log(modelURL);
  // Contains blob url
  // Fetch model will load model from sketchfab link
  modelgltfURL = await sketchfabIntegration.fetchModel(modelURL);
  // readzip only have link to glb file inside zip folder
  // modelgltfURL = await sketchfabIntegration.readZip("/static/Assets/electricalBox.glb.zip");
  // console.log(modelgltfURL);
  // create model will create the model in cesium and display it 
  console.log(modelgltfURL);
  console.log("creating model");
  // Create Model Function - "HERE"
  // {
  // This code will load models if stored in a static folder as glbs which has the requirements for Cesium to load files
  // createModel("/static/Assets/electricalBox.glb");
  // }
}


let modelArray = [];

// Add models to the modelArray
// Will be handled by the import function 
modelArray[0] = modelLayer([-80.6208, 28.6273], 'saturnV', 1, 'Saturn V');
modelArray[1] = modelLayer([-80.60405, 28.6084], 'falcon9', 100, 'Falcon 9');

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

  // load models 
  for (let model of modelArray) {
    map.addLayer(model);
  }
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