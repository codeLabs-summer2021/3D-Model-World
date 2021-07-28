import SketchfabIntegration from "./sketchfabIntegration.js";

function menu() {
    $("#authenticate").on("click", authenticateUser);
    $("#submitLink").on("click", getSketchfabModelUrl);
    $("#linkSketchfab").hide();
    $("#submitLink").hide();
};

let modelgltfURL;
const sketchfabIntegration = new SketchfabIntegration();

sketchfabIntegration.checkToken();

function authenticateUser() {
    sketchfabIntegration.authenticate();
    // After authentication, check for token 
    sketchfabIntegration.checkToken();
    // Token hardcoced for testing purposes
    // sketchfabIntegration.token = "pPstovaqjLqqLFx3jRgnXl7ScdTM1V";
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
    // Create Model Function - "HERE"
    // {
    // This code will load models if stored in a static folder as glbs which has the requirements for Cesium to load files
    // createModel("/static/Assets/electricalBox.glb");
    // }
}

export default menu;