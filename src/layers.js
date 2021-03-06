import mapboxgl from 'mapbox-gl';
import { map } from '../index.js';
import * as THREE from 'three';

export const skyLayer = {
  id: 'sky',
  type: 'sky',
  paint: {
    'sky-type': 'atmosphere',
    'sky-atmosphere-sun': [0.0, 0.0],
    'sky-atmosphere-sun-intensity': 15
  }
};

export const buildingLayer = {
  id: 'add-3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 15,
  paint: {
    'fill-extrusion-color': '#aaa',
    'fill-extrusion-height': ['get', 'height'],
    'fill-extrusion-opacity': 0.9
  },
};

/**
 * Creates the model's properties based on given parameters 
 * 
 * @param {number[]} coordinates Array of Longtitude and Latitude
 * @param {Scene} scene single scene that contains a model
 * @param {number} size Larger number creates a smaller object, smaller number creates a larger object.
 * @param {string} name of the model
 * @returns An object with all needed properties for the model layer. 
 */
export function modelLayer(scene, coordinates, size, name, url) {
  let modelUrl = url;
  let modelName = name;
  let modelSize = size;
  // Variable for georeferencing on the map
  let modelOrigin = coordinates;
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

  // Configuration of the custom layer for a 3D model per the CustomLayerInterface
  return {
    id: scene.uuid,
    type: 'custom',
    renderingMode: '3d',
    onAdd(map, gl) {
      // Scene and Object
      this.scene = scene;

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

    getUrl() {
      return modelUrl;
    },

    getName() {
      return modelName;
    },

    getLngLat() {
      return modelOrigin;
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
            modelTransform.scale / modelSize,
            -modelTransform.scale / modelSize,
            modelTransform.scale / modelSize
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
};