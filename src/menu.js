import SketchfabIntegration from "./sketchfabIntegration.js";
import { modelLayer } from './layers.js';
import {
    addModel,
    removeModel,
    map,
    modelArray
} from '../index.js';
import {
    addModelToLocalStorage,
    removeModelToLocalStorage
} from './localStorage.js';
const sketchfabIntegration = new SketchfabIntegration();

export function menuClick() {
    $("#modelList").hide();
    $("#loadModel").hide();
    document.getElementById("dropdown").classList.toggle("show");
    $("#authenticate").on("click", authenticateUser);
    $("#addModel").on("click", getSketchfabModel);
    loggedIn();
};


function loggedIn() {
    sketchfabIntegration.checkToken();
    let token = sketchfabIntegration.token;
    if (token != null) {
        $("#sketchfab").hide();
        $("#loadModel").show();
        $("#modelList").show();
    }
};

// LOGIN
function authenticateUser() {
    sketchfabIntegration.authenticate();
    // After authentication, check for token 
    sketchfabIntegration.checkToken();
    if (sketchfabIntegration.token != null) {
        $("#sketchfab").hide();
        $("#loadModel").show();
        $("#modelList").show();
    }
};

// ADD MODEL
async function getSketchfabModel() {
    $("#missingInfo").html("");
    let info = await getModelInfo();
    if (info == undefined) {
        return;
    }
    // Fetch model will load model from sketchfab link
    let modelScene = await sketchfabIntegration.fetchModel(info[0]);
    if (modelScene != null) {
        addModelToLocalStorage(info);
        addModel(modelLayer(modelScene, info[3], info[2], info[1], info[0]));
        clearAddModel();
    }
};

async function getModelInfo() {
    let modelURL = $("#modelUrl").val();
    if (modelURL === '') {
        $("#missingInfo").html("Sketchfab Model URL cannot be empty!");
        $("#missingInfo").css("color", "red");
        return;
    } else if (checkUrl(modelURL)) {
        $("#missingInfo").html("That url is already used.");
        $("#missingInfo").css("color", "red");
        return;
    }

    let name = $("#modelName").val();
    if (name === '') {
        $("#missingInfo").html("Please enter a name!");
        $("#missingInfo").css("color", "red");
        return;
    }
    let size = $("#modelSize").val();
    if (size === '') {
        $("#missingInfo").html("Please enter a size!");
        $("#missingInfo").css("color", "red");
        return;
    }
    size = parseFloat(size);
    if (size <= 0) {
        $("#missingInfo").html("Please enter a size!");
        $("#missingInfo").css("color", "red");
        return;
    }

    let lat = $("#modelLat").val();
    if (lat === '') {
        $("#missingInfo").html("Please enter a latitude!<br> Click on the screen to select a point!");
        $("#missingInfo").css("color", "red");
        return;
    }
    lat = parseFloat(lat);
    if (lat < -90 || lat > 90) {
        $("#missingInfo").html("Please enter a latitude between -90 & 90!<br> Click on the screen to select a point!");
        $("#missingInfo").css("color", "red");
        return;
    }
    let long = $("#modelLong").val();
    if (long === '') {
        $("#missingInfo").html("Please enter a longitude!<br> Click on the screen to select a point!");
        $("#missingInfo").css("color", "red");
        return;
    }
    long = parseFloat(long);
    if (long < -180 || long > 180) {
        $("#missingInfo").html("Please enter a latitude between -180 and 180!<br> Click on the screen to select a point!");
        $("#missingInfo").css("color", "red");
        return;
    }
    return [modelURL, name, size, [long, lat]];
};

/**
 * Checks if the given url has already been used or not
 * 
 * @param {String} modelURL 
 * @returns {boolean} boolean of the result of the url check
 */
function checkUrl(modelURL) {
    let isUsed = false;
    for (let model of modelArray) {
        if (modelURL === model.getUrl()) {
            isUsed = true;
            break;
        }
    }
    return isUsed;
};

function clearAddModel() {
    $('#modelUrl').val('');
    $('#modelName').val('');
    $('#modelSize').val('1');
    $('#modelLat').val('');
    $('#modelLong').val('');
};


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
            map.setZoom(15);
        });
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            removeModelToLocalStorage(model.getUrl());
            removeModel(model);
        });
        modelDiv.appendChild(modelName);
        modelDiv.appendChild(moveBtn);
        modelDiv.appendChild(deleteBtn);
        modelList.appendChild(modelDiv);
    }
};
