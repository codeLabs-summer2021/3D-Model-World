import SketchfabIntegration from "./sketchfabIntegration.js";
import { modelLayer } from './layers.js';
import {
    addModel,
} from '../index.js';
const sketchfabIntegration = new SketchfabIntegration();

export const addModelToLocalStorage = (info) => {
    // Get the current data in local stoage
    let mapInstance = JSON.parse(localStorage.getItem('MapInstance1'));

    // Add new model
    let modelInfo = {
        url: info[0],
        name: info[1],
        size: info[2],
        coordinates: info[3]
    };
    mapInstance.push(modelInfo);

    // Update the value of local storage
    localStorage.setItem('MapInstance1', JSON.stringify(mapInstance));
};

export const removeModelToLocalStorage = (modelURL) => {
    // Get the current data in local stoage
    let mapInstance = JSON.parse(localStorage.getItem('MapInstance1'));

    // Find and remove model
    for (let i in mapInstance) {
        if (mapInstance[i].url === modelURL) {
            mapInstance.splice(i, 1);
        }
    }

    // Update the value of local storage
    localStorage.setItem('MapInstance1', JSON.stringify(mapInstance));
};

// Inital LocalStorage control
export const localStorageSetUp = () => {
    // Set up Map instance
    if (!localStorage.getItem('MapInstance1')) {
        localStorage.setItem('MapInstance1', JSON.stringify([]));
    }
    JSON.parse(localStorage.getItem('MapInstance1'));

    // check if logged in
    if (localStorage.getItem('sb_token')) {
        checkLocalStorage();
    }
};

export const checkLocalStorage = () => {
    // Get the current data in local stoage
    let mapInstance = JSON.parse(localStorage.getItem('MapInstance1'));

    // For each model in local storage add to the map
    sketchfabIntegration.checkToken();
    for (let model of mapInstance) {
        getSketchfabModelFromLocalStorage(model);
    }
};

const getSketchfabModelFromLocalStorage = async (info) => {
    // Fetch model will load model from sketchfab link
    let modelScene = await sketchfabIntegration.fetchModel(info.url);
    if (modelScene != null) {
        addModel(modelLayer(modelScene, info.coordinates, info.size, info.name, info.url));
    }
};