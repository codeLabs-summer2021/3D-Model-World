import SketchfabIntegration from "./sketchfabIntegration.js";
import { modelLayer } from './layers.js';
import { addModel } from '../index.js';

function menu() {
    $("#authenticate").on("click", authenticateUser);
    $("#submitLink").on("click", getSketchfabModelUrl);
    $("#linkSketchfab").hide();
    $("#submitLink").hide();
    loggedIn();
};

let modelScene;
const sketchfabIntegration = new SketchfabIntegration();

function loggedIn() {
    sketchfabIntegration.checkToken()
    let token = sketchfabIntegration.token;
    if (token != null) {
        $("#linkSketchfab").show();
        $("#submitLink").show();
        $("#authenticate").hide();
    }
}

function authenticateUser() {
    sketchfabIntegration.authenticate();
    // After authentication, check for token 
    // sketchfabIntegration.token = "VUfz5IOGdzmZNkaJO7Cui8u4T0lHzF";
    sketchfabIntegration.checkToken();
    // Token hardcoced for testing purposes
    // sketchfabIntegration.checkToken();
    if (sketchfabIntegration.token != null) {
        $("#linkSketchfab").show();
        $("#submitLink").show();
    }
}

async function getSketchfabModelUrl() {
    let modelURL = $("#linkSketchfab").val();
    $("#linkSketchfab").val('');
    // Fetch model will load model from sketchfab link
    modelScene = await sketchfabIntegration.fetchModel(modelURL);
    addModel(modelLayer(modelScene, [-80.61, 28.6123], 1, 'test'));
}

export default menu;