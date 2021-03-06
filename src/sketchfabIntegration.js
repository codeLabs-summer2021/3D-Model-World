const CLIENT_ID = 'qzsZjdRBnwZhC51TYPgsLcfrl2RpeoZKVBpexr8J';
const AUTHENTICATION_URL = `https://sketchfab.com/oauth2/authorize/?state=123456789&response_type=token&client_id=${CLIENT_ID}`;
import JSZip from 'jszip';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function checkStatus(response) {
    // From: https://gist.github.com/irbull/42f3bd7a9db767ce72a770ded9a5bdd1
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    return response;
};

function getExtension(filename) {
    return filename.toLowerCase().split('.').pop();
};

async function getFileUrl(file) {
    const blob = await file.async('blob');
    const url = URL.createObjectURL(blob);
    return url;
};

class SketchfabIntegration {
    constructor() {
        this.token = null;
    }

    authenticate() {
        window.open(AUTHENTICATION_URL, '_self');
    };

    async readZip(zipUrl) {
        const response = await fetch(zipUrl);
        checkStatus(response);
        const arrayBuffer = await response.arrayBuffer();
        const result = await JSZip.loadAsync(arrayBuffer);
        const files = Object.values(result.files).filter(item => !item.dir);
        // Code to load gltf files
        const entryFile = files.find(f => getExtension(f.name) === 'gltf');
        // Create blobs for every file resource
        const blobUrls = {};
        for (const file of files) {
            if (typeof file !== 'undefined') {
                blobUrls[file.name] = await getFileUrl(file);
            }
        }
        const fileUrl = blobUrls[entryFile.name];

        const loadingManager = new THREE.LoadingManager();
        loadingManager.setURLModifier((url) => {
            const parsedUrl = new URL(url);
            const origin = parsedUrl.origin;
            const path = parsedUrl.pathname;
            const relativeUrl = path.replace(origin + '/', '');

            if (blobUrls[relativeUrl] != undefined) {
                return blobUrls[relativeUrl];
            }
            return url
        });
        let scene = new THREE.Scene();
        const gltfLoader = new GLTFLoader(loadingManager);
        gltfLoader.load(fileUrl, (gltf) => {
            scene.add(gltf.scene);
        });

        return scene;
    };

    checkToken() {
        const url = new URL(window.location);
        // Extract the token and save it
        const hashParams = url.hash.split('&');
        for (let param of hashParams) {
            if (param.indexOf('access_token') !== -1) {
                const token = param.replace('#access_token=', '');
                localStorage.setItem('sb_token', token);
            }
        }
        // Load token from local storage
        this.token = localStorage.getItem('sb_token');
    };

    async getModelDownloadUrl(inputUrl) {
        // Extract the model ID from the URL
        const input = new URL(inputUrl);
        // The ID is always the last string when seperating by '-'
        const pieces = input.pathname.split('-');
        const modelID = pieces[pieces.length - 1];

        const metadataUrl = `https://api.sketchfab.com/v3/models/${modelID}/download`;
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            mode: 'cors'
        };

        // This call will fail if model can't be downloaded
        const response = await fetch(metadataUrl, options);
        const metadata = await response.json();
        return metadata.gltf.url;
    };

    async fetchModel(url) {
        // Bring up modal with 'Loading' text
        document.getElementById('pop-up-messsage').classList.toggle('hidden');

        let modelZipUrl;
        try {
            modelZipUrl = await this.getModelDownloadUrl(url);
        } catch (e) {
            // Update modal with error
            console.error('Failed to download model from Sketchfab', e);
            document.getElementById('download-error').classList.toggle('hidden');
            document.getElementById('dimiss-btn').classList.toggle('hidden');
            document.getElementById('dimiss-btn').onclick = this.dismissNotifications;
            return;
        }

        if (modelZipUrl == undefined) return;

        // Update modal with 'Loading model'
        document.getElementById('fetch-success').classList.toggle('hidden');

        let finalScene;
        try {
            finalScene = await this.readZip(modelZipUrl);
        } catch (e) {
            // Update modal with error 
            console.error('Failed to read model from Sketchfab', e);
            document.getElementById('unknown-error').classList.toggle('hidden');
            document.getElementById('dimiss-btn').classList.toggle('hidden'); // <- this isn't loading
            document.getElementById('dimiss-btn').onclick = this.dismissNotifications;
            return;
        }

        // Dismiss modal 
        this.dismissNotifications();
        return finalScene;
    };

    dismissNotifications() {
        // Determine which elements are showing and toggle them off
        if (!document.getElementById('pop-up-messsage').classList.toggle('hidden')) {
            document.getElementById('pop-up-messsage').classList.toggle('hidden');
        }
        if (!document.getElementById('fetch-success').classList.toggle('hidden')) {
            document.getElementById('fetch-success').classList.toggle('hidden');
        }
        if (!document.getElementById('unknown-error').classList.toggle('hidden')) {
            document.getElementById('unknown-error').classList.toggle('hidden');
        }
        if (!document.getElementById('download-error').classList.toggle('hidden')) {
            document.getElementById('download-error').classList.toggle('hidden');
        }
        if (!document.getElementById('dimiss-btn').classList.toggle('hidden')) {
            document.getElementById('dimiss-btn').classList.toggle('hidden');
        }
    };
};

export default SketchfabIntegration;