<!-- PROJECT NAME -->
<p align="center">
  <h1 align="center">3D Model World</h1>
  <p align="center">
    "A real world environment to place, view, and share all your 3D models."
    <br />
    <a href="https://3d-model-world.netlify.app/"><strong>View Live App »</strong></a>
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#motivation">Motivation</a></li>
      </ul>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
      <ul>
        <li><a href="#install">Install</a></li>
      </ul>
      <ul>
        <li><a href="#use">Use</a></li>
      </ul>
    <li><a href="#features">Features</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

3D Model World allows users to upload their own 3D models _(photogrammetry or otherwise created)_ into a real-world environment using a map API. The user can then name, move, re-size, and rotate their models to their liking. Once a user has a map instance created, they can then share their URL with others to show off all their work and models.

### Motivation

There have been a lot of attempts to build something similar like this. _(See for example Sketchfab's [experiment](https://labs.sketchfab.com/experiments/map/) and Polycam's [map](https://twitter.com/PolycamAI/status/1402366028852568065))_.

Our team thought it would be nice to expand on these great ideas and merge the 2D maps and 3D objects together. Doing this will let the user show the 3D objects embedded directly on a single interactable map. The great benefit here is that all objects can now be compared and viewed in a single environment. This also provides a true appreciation of scale.

Besides just the prior attempts to make something like this there is a huge community of people scanning 3D objects, (see the hashtags #objectcapture or #1scanaday on Twitter). As of right now these people don't have an efficient way to show off all their scans in a single environment; 3D Model World fixed that.

### Built With

- [Sketchfab](https://sketchfab.com/)
- [mapbox-gl](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [@mapbox/mapbox-gl-geocoder](https://www.npmjs.com/package/@mapbox/mapbox-gl-geocoder)
- [three](https://threejs.org/docs/index.html#manual/en/introduction/Installation)
- [jszip](https://www.npmjs.com/package/jszip)
- [snowpack](https://www.snowpack.dev/)
- [@snowpack/plugin-webpack](https://www.npmjs.com/package/@snowpack/plugin-webpack)

<!-- GETTING STARTED -->
## Getting Started
### Install

_Make sure you have at least `npm: 7.#.#` and `node: 14.#.#`_

1. Clone the repo
   ```sh
   git clone https://github.com/codeLabs-summer2021/3D-Model-World.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the app
   ```sh
   npm start
   ```

### Use

To use the app, follow these simple steps:

1. Make sure you have a [Sketchfab](https://sketchfab.com/) account. _(Completely free to create)_.
2. Click the Menu button.
3. Click `Login to Sketchfab`.
4. Once you authorize the app to connect to your Sketchfab account you can now use the app.

<!-- FEATURES -->
## Features

### Load Models

Loading models is as simple as copy/paste. Just click on the `Menu` button and navigate to the `Add Model` section. Now simply copy the Sketchfab URL of the desired model and paste it in the ‘URL’ box. Fill out the rest of the information about the model and click ‘Add’. The App will let you know the loading progress and whether it was successful or not. From here you can display your model or load another.
<br/>
<img src="https://user-images.githubusercontent.com/35348015/133439930-5232f04c-8c9d-4bac-8ead-ab260d5ee485.gif" width="300">

### Models List

All existing models in your map will be shown in the `Model List` in the Menu. This list will make it easy to locate and delete your models.
<br/>
<img src="https://user-images.githubusercontent.com/35348015/133439958-9a746096-6636-4a4b-876e-56a9c3c41dc5.png" width="300">

### Move Models

Moving a model is as easy as right-clicking.
<br/>
<img src="https://user-images.githubusercontent.com/35348015/133439971-200921fc-8ec7-42b4-a455-0380063cb93a.gif" width="400">

### Terrain

Terrain is active so you can see your models compared to the real world environments.
<br/>
<img src="https://user-images.githubusercontent.com/35348015/133442092-03a61438-b221-4afb-9237-d56a453a8209.gif" width="400">

### Buildings

Building toggle is also an option for those who are curious how a model fairs compared to real buildings.
<br/>
<img src="https://user-images.githubusercontent.com/35348015/133440998-fecfad43-4dc6-4742-9cca-eefc97522d92.gif" width="400">

### Search Bar

Type in a location and see the camera move smoothly to the destination.
<br/>
<img src="https://user-images.githubusercontent.com/35348015/133440456-6287ed5c-26a3-44c1-b5bf-cca342a4e47c.gif" width="500">

### Compass

Got turned upside down? Simply reorient yourself with the compass button.
<br/>
<img src="https://user-images.githubusercontent.com/35348015/133440861-14988303-3ddf-4813-94bc-42c92b0d81f4.gif" width="500">

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/codeLabs-summer2021/3D-Model-World/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->
## Contributing

Any contributions are **greatly appreciated**. Please feel free to add any features or fixes you like. We will review the PR and be happy to add your work to this project.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add some NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

### Creation of App:
This app's creation started during the 2021 summer [CodeDay Labs](https://labs.codeday.org/). It was created by [Caleb McOlin](https://github.com/CalebMcOlin) and [Rodrigo Andrade](https://github.com/randrade8311) with [Omar Shehata](https://github.com/OmarShehata) as the mentor.

### Models used in example gifs:
- Saturn V and Falcon 9 by [Stanley_Creative](https://sketchfab.com/Stanley_Creative)

<!-- CONTACT -->
## Contact

- [Caleb McOlin](https://www.linkedin.com/in/calebmcolin/)
- [Rodrigo Andrade](https://www.linkedin.com/in/rjandrade/)
- [Omar Shehata](https://omarshehata.me/)
