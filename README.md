# Codelabs Summer 2021

This repository is for planning and collaborating on our CodeLabs 2021 project.

Current deployed application: https://3d-virtual-museum.netlify.app/

Our project is: **Create an interactive 3D virtual museum for photogrammetry & LiDAR scans**.

## Final product

The end goal is to have a system where users can search a global 3D map and see 3D landmarks and objects embedded in the world. Users should also be able to add new data to this map as the community grows over time. 

Inspiration: https://evergiven-everywhere.glitch.me/. 

## Motivation

There have been a lot of attempts to build something like this. See for example Sketchfab's experiment: [https://labs.sketchfab.com/experiments/map/](https://labs.sketchfab.com/experiments/map/). And Polycam's map: [https://twitter.com/PolycamAI/status/1402366028852568065](https://twitter.com/PolycamAI/status/1402366028852568065).

None of these attempts have ever shown the 3D objects embedded directly on the map - just a 2D map and a separate 3D view. This makes it hard to understand and appreciate the scale of these 3D structures. A lot of times how they fit in with the landscape is a crucial part (think of landmarks like Stonehenge). 

## Why does this matter

There is a huge community of people scanning 3D objects, see the hashtags [#objectcapture](https://twitter.com/hashtag/objectcapture?src=hashtag_click) or [#1scanaday](https://twitter.com/search?q=%231scanaday&src=typed_query) on Twitter. Popular use cases for this are (1) digital heritage, preserving and studying historical objects. Or (2) machine vision & AR, for applications like enabling self driving cars to better see and understand the world. Or (3) urban planning, real-estate & remote inspection. Many cities like Melbourne collect a lot of data like this to help them understand how to allocate resources and fix issues. 

Building an interactive map like this is a fun way to introduce people to the data that's out there, and can be a really useful tool for people in this field.

You'll also learn how to visualize and work with this type of data that's becoming more and more ubiquitous, especially as LiDAR scanners become more common via the latest iPhone/iPad devices.

## Milestones

Here are a few suggested milestones for this project.

1. **Decide on a visualization framework.**

Popular choices are [CesiumJS](https://github.com/CesiumGS/cesium#rocket-get-started), [Deck.gl](https://deck.gl/), and [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/api/). 

A good prototype to make with each is to set up (a) a basic map with points & labels added to it (b) visualize a 3D model, such as [a photogrammetry model from Sketchfab](https://sketchfab.com/search?category=architecture&features=downloadable&licenses=322a749bcfa841b29dff1e8a1bb74b0b&licenses=b9ddc40b93e34cdca1fc152f39b9f375&licenses=72360ff1740d419791934298b8b6d270&licenses=bbfe3f7dbcdd4122b966b85b9786a989&licenses=2628dbe5140a4e9592126c8df566c0b7&licenses=34b725081a6a4184957efaec2cb84ed3&licenses=7c23a1ba438d4306920229c12afcb5f9&licenses=783b685da9bf457d81e829fa283f3567&licenses=5b54cf13b1a4422ca439696eb152070d&q=photogrammetry&sort_by=-relevance&type=models) with a known location.

You should evaluate these and make a team decision as to which framework works best for this project. Some factors to consider: does it support visualizing 3D models? Will it work well if you visualize hundreds of 3D models in the scene? Is it easy to work with?

2. **Build a simple backend to store a model URL and location data**

Most 3D models do not inherently have geolocation data. So we will need to store this metadata somehow. This can be a postgres database, or some other basic mechanism to start with (such as using [Airtable](https://airtable.com/api)). 

The data you will need to store is the model URL, longitude, latitude, height, and orientation. For now, the models can be hosted directly as static files. They can also come from API's like Sketchfab, or Cesium ion. 

3. **Visualize all the models from the backend on the client**

The client should be able to take a list of model URL's and their locations, and visualize them in the world. It should handle correctly placing them on the ground. 

To scale up to hundreds (or hundreds of thousands of models) you will need to develop a strategy to manage resources. One idea is to only display the models when the camera is close enough, and to otherwise represent the model as a simple point. 

4. **Integrate with the Sketchfab API**

This will allow the user to find any Sketchfab model and add it to your map in real time. See [https://dev.to/omar4ur/how-to-load-sketchfab-models-directly-in-a-threejs-app-5anb](https://dev.to/omar4ur/how-to-load-sketchfab-models-directly-in-a-threejs-app-5anb). 

Alternatively, or in addition, you can integrate with the [Cesium ion API](https://cesium.com/learn/ion/ion-oauth2/) to allow its users to bring their 3D models to the map. The advantage there is Cesium ion models are already geolocated. 

5. **Develop a UI for positioning models in the app**

For models that users add, it would be nice to be able to position and rotate them within the app. The easiest thing to start with is a simple HTML fields for position and orientation. 

A more sophisticated system would allow you to translate and rotate within the 3D view directly, similar to 3D modelling programs like Blender.

6. **Make the backend support any user submitting new models**

A user should be able to enter a new model URL (whether Sketchfab or otherwise) and have it appear on the map.

Optionally, instead of having it be added to the global map for everyone, let users share a link to a custom version of the map with their custom model(s). 

7. **Write a blog/article about your project/what you learned**

A really great way to stand out and show your skills to potential employers is to publish an article or a tutorial. There are a lot of topics throughout this project that would make for good candidates for articles. Such as how to build a UI for geolocating 3D models, or the design of your backend, or how you picked the 3D engine based on the strengths and weaknesses of each and the requirements of your project.
