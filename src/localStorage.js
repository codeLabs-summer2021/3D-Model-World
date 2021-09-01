
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
    console.log('remove from LS')
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
    if (!localStorage.getItem('MapInstance1')) {
        localStorage.setItem('MapInstance1', JSON.stringify([]));
    }
    JSON.parse(localStorage.getItem('MapInstance1'));
};