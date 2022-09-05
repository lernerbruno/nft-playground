import React, { Component, useEffect, useState, useRef } from "react";
import * as THREE from "three";
// import MTLLoader from "three-mtl-loader";
// import {OBJLoader} from "three-obj-loader";
// import OrbitControls from "three-orbitcontrols";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

var freedomMesh, renderer, camera, frameId, scene, cube;
const ThreeScene = ({item}) => {
  const refContainer = useRef()
  const load = () => {
    const { current: container } = refContainer
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    scene = new THREE.Scene();
    

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 5;
    

    renderer = new THREE.WebGLRenderer({ antialias: true,  outputEncoding: THREE.sRGBEncoding, gammaFactor:2.2, physicallyCorrectLights: true, alpha: 1 });
    renderer.setClearColor("#263238");
    renderer.setSize(width, height);
    // renderer.setGammaFactor(2.2);
    // renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

 
    const controls = new OrbitControls(camera, renderer.domElement);

    //LIGHTS
    var lights = [];
    lights[0] = new THREE.PointLight(0xFFFFFF, 1, 0);
    lights[1] = new THREE.PointLight(0xFFFFFF, 1, 0);
    lights[2] = new THREE.PointLight(0xFFFFFF, 1, 0);
    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);
    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
    // var rectLight = new THREE.RectAreaLight( 0xffffff, 1,  width, height );
    // rectLight.position.set( 0, 200, 0 );
    // rectLight.lookAt( 1, 1, 0 );
    // scene.add(rectLight)


    // var gltfLoader = new GLTFLoader();
    // gltfLoader.load(
    //   "assets/Motorcycle_Helmet.gltf",
    //   ( gltf ) => {
    //       // called when the resource is loaded
    //     console.log(gltf.scene)
    //     scene.add(gltf);
    //   },
    //   ( xhr ) => {
    //     console.log(xhr);
    //     // called while loading is progressing
    //     // console.log("The xhr warning isL ",xhr.srcElement.responseText);
    // }
    //   );


    var mtlLoader = new MTLLoader();
    // load material
    mtlLoader.setPath("assets/");
    mtlLoader.load("Motorcycle_Helmet.mtl", function(materials) {
      // https://ipfs.infura.io/ipfs/QmcY6tvs1ciQnF6xvACNsQ2iiMkt5JJJDAL3u8y2N5ZQo6
      
      materials.preload()

      console.log('materials', materials)
      // load Object 
      var objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      // https://ipfs.infura.io/ipfs/QmUhZgJFyistWorrR41fgfTyUmCpVNt9GFyfEA1kkTeoY7
      objLoader.load( 
        item.image,
        function(object) {
          console.log('OBJ Before', object)
          // object.traverse( function ( child ) {
          //   if ( child instanceof THREE.Mesh ) {
          //       // child.material.color.setHex(0x00FF00); 
          //       // child.material.ambient.setHex(0xFF0000); 
          //       }
          //   } );
          console.log('OBJ After', object)
          // object.position.y = 0;
          freedomMesh = object;
          freedomMesh.scale.set(10, 10, 10);
          scene.add(freedomMesh);
          
        }, onProgress, onError);
    });

    // setRenderer(renderer)
    // setCamera(camera) 
    // setScene(scene)
    // setCube(cube)
    // setFreedomMesh(freedomMesh)
    // start()
    start()
  }  

  const start = () => {
    if (!frameId) { 
      frameId = window.requestAnimationFrame(animate);
      // setFrameId(frameId)
    }
  };
  const stop = () => {
    cancelAnimationFrame(frameId);
  };

  const animate = () => {
    if (freedomMesh) {
      freedomMesh.rotation.y += 0.01;
    } 
    renderScene()
    frameId = window.requestAnimationFrame(animate);
    // setFrameId(frameId)
  }; 

  const renderScene = () => { 
    if (renderer) {
      renderer.render(scene, camera)
    };
  };

  const onProgress = xhr => {
    // console.log(xhr.total)
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  };

  // Function called when download errors
  const onError = error => {
    console.log("An error happened" + error);
  };
  
  useEffect(() => {
    load()
  }, [])
  return (
    <div
        style={{ width: "288px", height: "859px" }}
        ref={refContainer}
      />
  )
 
}

export default ThreeScene;
