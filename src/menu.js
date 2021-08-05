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
    if (sketchfabIntegration.token != null) {
        $("#sketchfab").hide();
        $("#loadModel").show();
        $("#modelList").show();
    }
}

async function getSketchfabModelUrl() {
    $("#missingInfo").html("");
    let info = await getModelInfo();
    if (info == undefined) {
        return;
    }
    // Fetch model will load model from sketchfab link
    let modelScene = await sketchfabIntegration.fetchModel(info[0]);
    if (modelScene != null) {
        addModel(modelLayer(modelScene, info[3], info[2], info[1]));
        clearAddModel();
    }
}

async function getModelInfo() {
    let modelURL = $("#modelUrl").val();
    if (modelURL === '') {
        $("#missingInfo").html("Sketchfab Model URL cannot be empty!");
        $("#missingInfo").css("color", "red");
        return;
    }
    let name = $("#modelName").val();
    if (name === '') {
        $("#missingInfo").html("Please enter a name!");
        $("#missingInfo").css("color", "red");
        return;
    }
    let size = parseFloat($("#modelSize").val());
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
}

function clearAddModel() {
    $('#modelUrl').val('');
    $('#modelName').val('');
    $('#modelSize').val('1');
    $('#modelLat').val('');
    $('#modelLong').val('');
}


