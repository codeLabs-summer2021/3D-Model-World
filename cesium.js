// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/static/Cesium/';

import * as Cesium from 'cesium';
import "/static/Cesium/Widgets/widgets.css";

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from your ion account

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjAxYTZjYS03OWFjLTRkMjgtYTNhNi1jYjVlYTE2ZGJiOTIiLCJpZCI6NjA5NzQsInNjb3BlcyI6WyJsZ24iLCJwciIsImFjdyIsImFzbCIsImFzciIsImFzdyIsImFzcyIsImdjIiwibHIiLCJsdyIsInRyIiwidHciLCJ1c2ciXSwiaWF0IjoxNjI2NjI0Nzg4LCJleHAiOjE2MjcyMjk1ODh9.lHbxXEOXGA7Ei8kCxEQpwEd-zvkeEx53e8iqrOC7o10';

// Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});
// Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
// Fly the camera to San Francisco at the given longitude, latitude, and height.
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
    // orientation: {
    //     heading: Cesium.Math.toRadians(0.0),
    //     pitch: Cesium.Math.toRadians(-15.0),
    // }
});