import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

const pane = new Pane();

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('/textures/cubeMap/');


const sunTexture = textureLoader.load('/textures/2k_sun.jpg')
const mercuryTexture = textureLoader.load('/textures/mercurymap.jpg')
const venusTexture = textureLoader.load('/textures/venusmap.jpg')
const earthTexture = textureLoader.load('/textures/8081_earthmap10k.jpg')
const marsTexture = textureLoader.load('/textures/2k_mars.jpg')
const jupiterTexture = textureLoader.load('/textures/jupitermap.jpg');
const saturnTexture = textureLoader.load('/textures/saturnmap.jpg')
const uranusTexture = textureLoader.load('/textures/uranusmap.jpg')
const neptuneTexture = textureLoader.load('/textures/neptunemap.jpg')
const moonTexture = textureLoader.load('/textures/moonmap4k.jpg')

const backgroundCubemap = cubeTextureLoader.load([
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
]);

scene.background = backgroundCubemap;

const mercuryMaterial = new THREE.MeshStandardMaterial(
  {
    map: mercuryTexture,
  }
)
const venusMaterial = new THREE.MeshStandardMaterial(
  {
    map: venusTexture,
  }
)
const earthMaterial = new THREE.MeshStandardMaterial(
  {
    map: earthTexture,
  }
)
const marsMaterial = new THREE.MeshStandardMaterial(
  {
    map: marsTexture,
  }
)
const jupiterMaterial = new THREE.MeshStandardMaterial(
  {
    map: jupiterTexture,
  }
)
const saturnMaterial = new THREE.MeshStandardMaterial(
  {
    map: saturnTexture,
  }
)
const uranusMaterial = new THREE.MeshStandardMaterial(
  {
    map: uranusTexture,
  }
)
const neptuneMaterial = new THREE.MeshStandardMaterial(
  {
    map: neptuneTexture,
  }
)
const moonMaterial = new THREE.MeshStandardMaterial(
  {
    map: moonTexture,
  }
)

const sphereGeometry = new THREE.SphereGeometry(1,32,32);
const sunMaterial = new THREE.MeshBasicMaterial(
  {
    map: sunTexture,
  }
);

const sun = new THREE.Mesh(sphereGeometry,sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

const planets = [
  {
    name: 'Mercury',
    radius: 0.4,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    tilt: 0.034,
    moons: [],
  },
  {
    name: 'Venus',
    radius: 0.6,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    tilt: 177.4,
    moons: [],
  },
  {
    name: 'Earth',
    radius: 0.7,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    tilt: 23.44,
    moons: [
      {
        name: 'Moon',
        radius: 0.2,
        distance: 2.5,
        speed: 0.015,
      }
    ]
  },
  {
    name: 'Mars',
    radius: 0.5,
    distance: 25,
    speed: 0.0045,
    material: marsMaterial,
    tilt: 25.19,
    moons: [
      {
        name: 'Phobos',
        radius: 0.1,
        distance: 1.5,
        speed: 0.02,
      },
      {
        name: 'Deimos',
        radius: 0.1,
        distance: 2.2,
        speed: 0.015,
        color: 0xffffff,
      }
    ]
  },
  {
    name: 'Jupiter',
    radius: 1.2,
    distance: 30,
    speed: 0.012,
    material: jupiterMaterial,
    tilt: 3.13,
    moons: [],
  },
  {
    name: 'Saturn',
    radius: 1.1,
    distance: 35,
    speed: 0.010,
    material: saturnMaterial,
    tilt: 26.73,
    moons: [],
  },
  {
    name: 'Uranus',
    radius: 0.9,
    distance: 40,
    speed: 0.011,
    material: uranusMaterial,
    tilt: 97.77,
    moons: [],
  },
  {
    name: 'Neptune',
    radius: 0.9,
    distance: 45,
    speed: 0.012,
    material: neptuneMaterial,
    tilt: 28.32,
    moons: [],
  },
];


const createPlanet = (planet) =>{
  // create a mesh
  const planetMesh = new THREE.Mesh(
  sphereGeometry,
  planet.material,
)
// planetMesh.rotation.z = -planet.tilt*Math.PI / 180;
// set the scale
planetMesh.scale.setScalar(planet.radius);
planetMesh.position.x = planet.distance;

return planetMesh;
}
const createMoon = (moon) =>{
  const moonMesh = new THREE.Mesh(
    sphereGeometry,
    moonMaterial
  )
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;

  return moonMesh;
}

const planetMeshes = planets.map((planet) => {

const planetMesh = createPlanet(planet);
// add it to our scene
scene.add(planetMesh);

// loop through each moon and create the moon
planet.moons.forEach((moon) => {

  const moonMesh = createMoon(moon);
  planetMesh.add(moonMesh);

})
  return planetMesh;
}); 

const pointLight = new THREE.PointLight(
  0xffffff,400
)

scene.add(pointLight); 

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// using damping so that it do not stops suddenly while rotating
controls.maxDistance = 200;
controls.minDistance = 20;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

const renderloop = () => {
  const elapsedTime = clock.getElapsedTime();

  planetMeshes.forEach((planet , planetIndex) => {
    planet.rotation.y += planets[planetIndex].speed;
    planet.position.x = Math.sin(planet.rotation.y) * planets[planetIndex].distance;
    planet.position.z = Math.cos(planet.rotation.y) * planets[planetIndex].distance;  

    planet.children.forEach((moon , moonIndex) =>{
      moon.rotation.y += planets[planetIndex].moons[moonIndex].speed;
      moon.position.x = Math.sin(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
      moon.position.z = Math.cos(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
    })
  })
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};


renderloop();
