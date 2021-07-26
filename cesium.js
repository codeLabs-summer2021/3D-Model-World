// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/static/Cesium/';

import * as Cesium from 'cesium';
import "/static/Cesium/Widgets/widgets.css";
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
    // sketchfabIntegration.checkToken();
    // Token hardcoced for testing purposes
    sketchfabIntegration.token = "pPstovaqjLqqLFx3jRgnXl7ScdTM1V";
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
    // modelgltfURL = await sketchfabIntegration.fetchModel(modelURL);
    // readzip only have link to glb file inside zip folder
    modelgltfURL = await sketchfabIntegration.readZip("/static/Assets/electricalBox.glb.zip");
    console.log(modelgltfURL);
    // create model will create the model in cesium and display it 
    createModel(modelgltfURL);

    // {
    // This code will load models if stored in a static folder as glbs which has the requirements for Cesium to load files
    // createModel("/static/Assets/electricalBox.glb");
    // }
}

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from your ion account

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYzQyM2ZhNC03ZmZiLTRlZWYtOTcxNi1lMDA2YTcyMDFlYTkiLCJpZCI6NjA5NzQsImlhdCI6MTYyNzMyMDk2OX0.Ve2Wf7pj3rAUa_9kavQcvAIZ29fXGES0IvAb6gQ9W_M';

// Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});
// Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
// Fly the camera to San Francisco at the given longitude, latitude, and height.
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
    // orientation: {
    //     heading: Cesium.Math.toRadians(0.0),
    //     pitch: Cesium.Math.toRadians(-15.0),
    // }
});

function createModel(url) {
    var entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.1836474718837, 39.9675302094665, 30),
        model: {
            uri: url,
            scale: 1
        },
    });
    viewer.trackedEntity = entity;
}
