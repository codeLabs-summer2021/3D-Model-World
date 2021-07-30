import SketchfabIntegration from "./sketchfabIntegration.js";
import map from "../index.js";
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';

function menu() {
    $("#authenticate").on("click", authenticateUser);
    $("#submitLink").on("click", getSketchfabModelUrl);
    $("#linkSketchfab").hide();
    $("#submitLink").hide();
};

let modelScene;
const sketchfabIntegration = new SketchfabIntegration();

sketchfabIntegration.checkToken();

function authenticateUser() {
    sketchfabIntegration.authenticate();
    // After authentication, check for token 
    // sketchfabIntegration.token = "pPstovaqjLqqLFx3jRgnXl7ScdTM1V";
    sketchfabIntegration.checkToken();
    // Token hardcoced for testing purposes
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
    modelScene = await sketchfabIntegration.fetchModel(modelURL);
    // readzip only have link to glb file inside zip folder
    // modelgltfURL = await sketchfabIntegration.readZip("/static/Assets/electricalBox.glb.zip");
    // console.log(modelgltfURL);
    // create model will create the model in cesium and display it 
    // console.log(modelgltfURL);
    console.log("creating model", modelScene);
    createModel(modelScene);
    // Create Model Function - "HERE"
    // {
    // This code will load models if stored in a static folder as glbs which has the requirements for Cesium to load files
    // createModel("/static/Assets/electricalBox.glb");
    // }
}

function createModel(scene, name) {
    let modelOrigin = [-80.6208, 28.6273];
    let modelAltitude = 0;
    let modelRotate = [Math.PI / 2, 0, 0];
    let modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
    );
    // transformation parameters to position, rotate and scale the 3D model onto the map
    let modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        /* Since our 3D model is in real world meters, a scale transform needs to be
        * applied since the CustomLayerInterface expects units in MercatorCoordinates.
        */
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

    let customLayer = {
        id: "3d-model",
        type: 'custom',
        renderingMode: '3d',
        onAdd(map, gl) {
            this.scene = scene;

            const ambientLight = new THREE.AmbientLight(0x404040, 2.5);
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
        /**
         * Allows the models to be moved to the now given location 
         * 
         * @param {lngLat} coordinates in Object form {lng: number, lat: number} 
         */
        moveTo(coordinates) {
            let elevation = map.queryTerrainElevation(coordinates, { exaggerated: false });
            modelOrigin = [coordinates.lng, coordinates.lat];
            modelAltitude = elevation;
            modelRotate = [Math.PI / 2, 0, 0];
            modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
                modelOrigin,
                modelAltitude
            );
            // Transformation variables into position, rotate and scale the 3D model onto the map
            modelTransform = {
                translateX: modelAsMercatorCoordinate.x,
                translateY: modelAsMercatorCoordinate.y,
                translateZ: modelAsMercatorCoordinate.z,
                rotateX: modelRotate[0],
                rotateY: modelRotate[1],
                rotateZ: modelRotate[2],
                scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
            };
        },
        // Render Scene
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

    map.addLayer(customLayer, 'waterway-label');
    console.log('here');
}

export default menu;