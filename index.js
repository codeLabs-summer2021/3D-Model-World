import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import SketchfabIntegration from "./SketchfabIntegration.js";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

$("#authenticate").on("click", authenticateUser);
$("#submitLink").on("click", getSketchfabModelUrl);
$("#linkSketchfab").hide();
$("#submitLink").hide();

let modelgltfURL;

const sketchfabIntegration = new SketchfabIntegration();
sketchfabIntegration.checkToken();

let modelOrigin = [148.9819, -35.39847];
let modelAltitude = 0;
let modelRotate = [Math.PI / 2, 0, 0];
let modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
);

// Transformation variables into position, rotate and scale the 3D model onto the map
let modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    // Since the 3D model is in real world meters, a scale transform needs to be...
    // ...applied since the CustomLayerInterface expects units in MercatorCoordinates.
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
};


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
    modelgltfURL = await sketchfabIntegration.fetchModel(modelURL);
    // readzip only have link to glb file inside zip folder
    // modelgltfURL = await sketchfabIntegration.readZip("/static/Assets/electricalBox.glb.zip");
    // console.log(modelgltfURL);
    // create model will create the model in cesium and display it 
    console.log(modelgltfURL);
    console.log("creating model");
    createModel(map, modelgltfURL);

    // {
    // This code will load models if stored in a static folder as glbs which has the requirements for Cesium to load files
    // createModel("/static/Assets/electricalBox.glb");
    // }
}

// add diferent ids
async function createModel(map, url) {
    let customLayer = {
        id: '3d-model',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, gl) {
            // scene
            this.scene = new THREE.Scene();

            // Object
            let loader = new GLTFLoader();
            loader.load(
                // `https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf`,
                url,
                function (gltf) {
                    this.scene.add(gltf.scene);
                }.bind(this)
            );

            // Light(s)
            const ambientLight = new THREE.AmbientLight(0x404040, 2.5)
            this.scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(0, 90, -80);
            this.scene.add(directionalLight);

            // Camera
            this.camera = new THREE.Camera();

            // Create Render
            this.map = map;
            this.renderer = new THREE.WebGLRenderer({
                canvas: map.getCanvas(),
                context: gl,
                antialias: true
            });
            this.renderer.autoClear = false;
        },

        render(gl, matrix) {
            let rotationX = new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(1, 0, 0),
                modelTransform.rotateX
            );
            let rotationY = new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(0, 1, 0),
                modelTransform.rotateY
            );
            let rotationZ = new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(0, 0, 1),
                modelTransform.rotateZ
            );

            let m = new THREE.Matrix4().fromArray(matrix);
            let l = new THREE.Matrix4()
                .makeTranslation(
                    modelTransform.translateX,
                    modelTransform.translateY,
                    modelTransform.translateZ
                )
                .scale(
                    new THREE.Vector3(
                        modelTransform.scale,
                        -modelTransform.scale,
                        modelTransform.scale
                    )
                )
                .multiply(rotationX)
                .multiply(rotationY)
                .multiply(rotationZ);

            this.camera.projectionMatrix = m.multiply(l);
            this.renderer.resetState();
            this.renderer.render(this.scene, this.camera);
            this.map.triggerRepaint();
        }

    };

    map.on('style.load', function () {
        console.log("adding layer");
        map.addLayer(customLayer, 'waterway-label');
    });
}

mapboxgl.accessToken = 'pk.eyJ1IjoicmFuZHJhZGU3MDkiLCJhIjoiY2tya3Z6M3AwN2U4NDJwbXQwcGY4MnFycyJ9.PLYtNyCoae4Fur5OSe3SgA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 18,
    // center = location to go to
    center: [148.9819, -35.3981],
    // pitch = angle position of camera
    pitch: 60,
    antialias: true
    // create the gl context with MSAA antialiasing, so custom layers are antialiased
});


// createModel(map, 'static/Assets/electricalBox.glb');
