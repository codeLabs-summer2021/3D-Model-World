import SketchfabIntegration from "./sketchfabIntegration.js";
import { modelLayer } from './layers.js';
import {
    addModel,
    removeModel,
    map
} from '../index.js';

export function menuClick() {
    document.getElementById("modelList").style.display = "none";
    document.getElementById("loadModel").style.display = "none";
    document.getElementById("dropdown").classList.toggle("show");
    document.getElementById("authenticate").addEventListener("click", authenticateUser);
    document.getElementById("addModel").addEventListener("click", getSketchfabModelUrl);
    loggedIn();
}

const sketchfabIntegration = new SketchfabIntegration();

function loggedIn() {
    sketchfabIntegration.checkToken();
    let token = sketchfabIntegration.token;
    if (token != null) {
        document.getElementById("sketchfab").style.display = "none";
        document.getElementById("loadModel").style.display = "";
        document.getElementById("modelList").style.display = "";
    }
}

// LOGIN
function authenticateUser() {
    sketchfabIntegration.authenticate();
    // After authentication, check for token 
    sketchfabIntegration.checkToken();
    if (sketchfabIntegration.token != null) {
        document.getElementById("sketchfab").style.display = "none";
        document.getElementById("loadModel").style.display = "";
        document.getElementById("modelList").style.display = "";
    }
}

// ADD MODEL
async function getSketchfabModelUrl() {
    document.getElementById("missingInfo").innerHTML = "";
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
    let modelURL = document.getElementById("modelUrl").value;
    let missingInfo = document.getElementById("missingInfo");
    if (modelURL === '') {
        missingInfo.innerHTML = "Sketchfab Model URL cannot be empty!";
        missingInfo.style.color = "red";
        return;
    }
    let name = document.getElementById("#modelName").value;
    if (name === '') {
        missingInfo.innerHTML = "Please enter a name!";
        missingInfo.style.color = "red";
        return;
    }
    let size = document.getElementById("#modelSize").value;
    if (size === '') {
        missingInfo.innerHTML = "Please enter a size!";
        missingInfo.style.color = "red";
        return;
    }
    size = parseFloat(size);
    if (size <= 0) {
        missingInfo.innerHTML = "Please enter a size!";
        missingInfo.style.color = "red";
        return;
    }

    let lat = document.getElementById("#modelLat").value;
    if (lat === '') {
        missingInfo.innerHTML = "Please enter a latitude!<br> Click on the screen to select a point!";
        missingInfo.style.color = "red";
        return;
    }
    lat = parseFloat(lat);
    if (lat < -90 || lat > 90) {
        missingInfo.innerHTML = "Please enter a latitude between -90 & 90!<br> Click on the screen to select a point!";
        missingInfo.style.color = "red";
        return;
    }
    let long = document.getElementById("#modelLong").value;
    if (long === '') {
        missingInfo.innerHTML = "Please enter a longitude!<br> Click on the screen to select a point!";
        missingInfo.style.color = "red";
        return;
    }
    long = parseFloat(long);
    if (long < -180 || long > 180) {
        missingInfo.innerHTML = "Please enter a latitude between -180 and 180!<br> Click on the screen to select a point!";
        missingInfo.style.color = "red";
        return;
    }
    return [modelURL, name, size, [long, lat]];
}

function clearAddModel() {
    document.getElementById('modelUrl').value = '';
    document.getElementById('modelName').value = '';
    document.getElementById('modelSize').value = '1';
    document.getElementById('modelLat').value = '';
    document.getElementById('modelLong').value = '';
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
            map.setZoom(15);
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
