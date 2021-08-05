import SketchfabIntegration from "./sketchfabIntegration.js";
import { modelLayer } from './layers.js';
import {
    addModel,
    removeModel,
    map
} from '../index.js';

export function menuClick() {
    $("#modelList").hide();
    $("#loadModel").hide();
    document.getElementById("dropdown").classList.toggle("show");
    $("#authenticate").on("click", authenticateUser);
    $("#addModel").on("click", getSketchfabModelUrl);
    loggedIn();
}

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

// LOGIN
function authenticateUser() {
    sketchfabIntegration.authenticate();
    // After authentication, check for token 
    sketchfabIntegration.checkToken();
    // Token hardcoced for testing purposes
    // sketchfabIntegration.token = "pPstovaqjLqqLFx3jRgnXl7ScdTM1V";
    if (sketchfabIntegration.token != null) {
        $("#sketchfab").hide();
        $("#loadModel").show();
        $("#modelList").show();
    }
}

// ADD MODEL
async function getSketchfabModelUrl() {
    let modelURL = $("#modelUrl").val();
    $("#modelUrl").val('');
    // Fetch model will load model from sketchfab link
    let modelScene = await sketchfabIntegration.fetchModel(modelURL);
    addModel(modelLayer(modelScene, [-80.61, 28.6123], 1, 'test'));
}

// MODEL LIST
export function loadModelList(modelArray) {
    let modelList = document.getElementById('list');
    while (modelList.firstChild) modelList.removeChild(modelList.firstChild);

    for (let model of modelArray) {
        let modelDiv = document.createElement('div');
        let modelName = document.createElement('b');
        let moveBtn = document.createElement('button');
        let deleteBtn = document.createElement('button');
        modelName.textContent = `${model.getName()}: `;
        moveBtn.textContent = 'Find'
        moveBtn.addEventListener('click', (e) => {
            // TODO: Make this a smooth animation
            map.setCenter(model.getLngLat());
            // TODO: Zoom scale dependent on size of model
            map.setZoom(20);
        });
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            removeModel(model);
        });
        modelDiv.appendChild(modelName);
        modelDiv.appendChild(moveBtn);
        modelDiv.appendChild(deleteBtn);
        modelList.appendChild(modelDiv);
    }
}