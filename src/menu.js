import SketchfabIntegration from "./sketchfabIntegration.js";
import { modelLayer } from './layers.js';
import { addModel } from '../index.js';

export function menuClick() {
    $("#modelList").hide();
    $("#loadModel").hide();
    document.getElementById("dropdown").classList.toggle("show");
    $("#authenticate").on("click", authenticateUser);
    $("#addModel").on("click", getSketchfabModelUrl);
    loggedIn();
}

let modelScene;
const sketchfabIntegration = new SketchfabIntegration();

function loggedIn() {
    sketchfabIntegration.checkToken();
    let token = sketchfabIntegration.token;
    if (token != null) {
        $("#sketchfab").hide();
        $("#loadModel").show();
        $("#modelList").show();
    }
}

function authenticateUser() {
    sketchfabIntegration.authenticate();
    // After authentication, check for token 
    sketchfabIntegration.checkToken();
    // Token hardcoced for testing purposes
    // sketchfabIntegration.token = "pPstovaqjLqqLFx3jRgnXl7ScdTM1V";
    // sketchfabIntegration.checkToken();
    if (sketchfabIntegration.token != null) {
        $("#sketchfab").hide();
        $("#loadModel").show();
        $("#modelList").show();
    }
}

async function getSketchfabModelUrl() {
    let modelURL = $("#modelUrl").val();
    $("#modelUrl").val('');
    // Fetch model will load model from sketchfab link
    modelScene = await sketchfabIntegration.fetchModel(modelURL);
    addModel(modelLayer(modelScene, [-80.61, 28.6123], 1, 'test'));
}
