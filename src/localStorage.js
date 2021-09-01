
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