import SketchfabIntegration from './sketchfabIntegration.js';
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
    sketchfabIntegration.checkToken(); // TODO: only call once
    // If NOT logged in
    if (!localStorage.getItem('sb_token')) {
        document.getElementById('menu').classList.toggle('show');
        document.getElementById('loginBtn').addEventListener('click', authenticateUser);
        document.getElementById('menuList').style.display = 'none';
        document.getElementById('menuLoad').style.display = 'none';
        return;
    }
    // If logged in
    document.getElementById('menu').classList.toggle('show');
    document.getElementById('loadBtn').addEventListener('click', getSketchfabModel);
    document.getElementById('menuLogin').style.display = 'none';
};

// LOGIN
function authenticateUser() {
    sketchfabIntegration.authenticate();
};

// ADD MODEL
async function getSketchfabModel() {
    sketchfabIntegration.checkToken();
    let token = sketchfabIntegration.token;
    if (!token) {
        document.getElementById('pop-up-messsage').classList.toggle('hidden');
        document.getElementById('token-error').classList.toggle('hidden');
        document.getElementById('dimiss-btn').classList.toggle('hidden');
        document.getElementById('dimiss-btn').onclick = dismissNotifications;
        return;
    }

    document.getElementById('loadMissingInfo').innerHTML = '';
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

const dismissNotifications = () => {
    document.getElementById('pop-up-messsage').classList.toggle('hidden');
    document.getElementById('token-error').classList.toggle('hidden');
    document.getElementById('dimiss-btn').classList.toggle('hidden');
};

async function getModelInfo() {
    let modelURL = document.getElementById('urlInput').value;
    let loadMissingInfoEl = document.getElementById('loadMissingInfo');
    if (modelURL === '') {
        loadMissingInfoEl.innerHTML = 'Sketchfab Model URL cannot be empty!';
        return;
    } else if (checkUrl(modelURL)) {
        loadMissingInfoEl.innerHTML = 'That url is already used.';
        return;
    }

    let name = document.getElementById('nameInput').value;
    if (name === '') {
        loadMissingInfoEl.innerHTML = 'Please enter a name!';
        return;
    }
    let size = document.getElementById('sizeInput').value;
    if (size === '') {
        loadMissingInfoEl.innerHTML = 'Please enter a size!';
        return;
    }
    size = parseFloat(size);
    if (size <= 0) {
        loadMissingInfoEl.innerHTML = 'Please enter a size!';
        return;
    }

    let lat = document.getElementById('latInput').value;
    if (lat === '') {
        loadMissingInfoEl.innerHTML = 'Please enter a latitude!<br> Click on the screen to select a point!';
        return;
    }
    lat = parseFloat(lat);
    if (lat < -90 || lat > 90) {
        loadMissingInfoEl.innerHTML = 'Please enter a latitude between -90 & 90!<br> Click on the screen to select a point!';
        return;
    }
    let long = document.getElementById('longInput').value;
    if (long === '') {
        loadMissingInfoEl.innerHTML = 'Please enter a longitude!<br> Click on the screen to select a point!';
        return;
    }
    long = parseFloat(long);
    if (long < -180 || long > 180) {
        loadMissingInfoEl.innerHTML = 'Please enter a latitude between -180 and 180!<br> Click on the screen to select a point!';
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
    document.getElementById('urlInput').value = '';
    document.getElementById('nameInput').value = '';
    document.getElementById('sizeInput').value = '1';
    document.getElementById('latInput').value = '';
    document.getElementById('longInput').value = '';
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
