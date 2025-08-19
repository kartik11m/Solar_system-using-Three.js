import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import { getFresnelMat } from "./getFresnelMat.js";

const pane = new Pane();

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('/textures/cubeMap/');


const sunTexture = textureLoader.load('/textures/2k_sun.jpg')
const mercuryTexture = textureLoader.load('/textures/mercurymap.jpg')
const venusTexture = textureLoader.load('/textures/venusmap.jpg')
const earthTexture = textureLoader.load('/textures/8081_earthmap10k.jpg')
const marsTexture = textureLoader.load('/textures/mars_1k_color.jpg')
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
    bumpMap: textureLoader.load("./textures/mercurybump.jpg"),
    bumpScale: 0.5,
  }
)
const venusMaterial = new THREE.MeshStandardMaterial(
  {
    map: venusTexture,
    bumpMap: textureLoader.load("./textures/venusbump.jpg"),
    bumpScale: 0.5,
  }
)
const earthMaterial = new THREE.MeshPhongMaterial(
  {
        map: earthTexture,
        bumpMap: textureLoader.load("./textures/8081_earthbump10k.jpg"),
        bumpScale: 0.3, 
        specularMap: textureLoader.load("./textures/8081_earthspec10k.jpg"), // reflectivity
        specular: new THREE.Color('grey'), // tweak for intensity
        shininess: 20, // lower = softer highlights, higher = sharper
    
  }
)
const marsMaterial = new THREE.MeshStandardMaterial(
  {
    map: marsTexture,
    bumpMap: textureLoader.load("./textures/marsbump1k.jpg"),
    bumpScale: 0.5,
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
    bumpMap: textureLoader.load("./textures/moonbump4k.jpg"),
    bumpScale: 0.5,
  }
)

const sphereGeometry = new THREE.SphereGeometry(1,32,32);
const sunMaterial = new THREE.MeshBasicMaterial(
  {
    map: sunTexture,
    color: 0xffcc33,
  }
);

const sun = new THREE.Mesh(sphereGeometry,sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

const particlesGeo = new THREE.BufferGeometry();
const particleCount = 500;
const positions = [];

for (let i = 0; i < particleCount; i++) {
  const r = Math.random() * 5 + 2;
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);
  positions.push(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

particlesGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const particlesMat = new THREE.PointsMaterial({
  color: 0xffaa00,
  size: 0.1,
  blending: THREE.AdditiveBlending,
  transparent: true,
});

const radiation = new THREE.Points(particlesGeo, particlesMat);
scene.add(radiation);

// Create geometry
const windGeo = new THREE.BufferGeometry();
const velocities = [];

for (let i = 0; i < particleCount; i++) {
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = Math.random() * 0.5;

  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);

  positions.push(x, y, z);
  velocities.push(x * 0.02, y * 0.02, z * 0.02); // outward velocity
}

windGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
windGeo.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

const windMat = new THREE.PointsMaterial({
  color: 0xffaa33,
  size: 0.05,
  transparent: true,
  blending: THREE.AdditiveBlending,
});

const solarWind = new THREE.Points(windGeo, windMat);
scene.add(solarWind);

function animateSolarWind() {
  const pos = windGeo.attributes.position;
  const vel = windGeo.attributes.velocity;

  for (let i = 0; i < pos.count; i++) {
    pos.array[i * 3] += vel.array[i * 3];
    pos.array[i * 3 + 1] += vel.array[i * 3 + 1];
    pos.array[i * 3 + 2] += vel.array[i * 3 + 2];

    const dist = Math.sqrt(
      pos.array[i * 3] ** 2 +
      pos.array[i * 3 + 1] ** 2 +
      pos.array[i * 3 + 2] ** 2
    );

    if (dist > 10) {
      pos.array[i * 3] = 0;
      pos.array[i * 3 + 1] = 0;
      pos.array[i * 3 + 2] = 0;
    }
  }

  pos.needsUpdate = true;
}



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
    ],
    layers:{
      lightsMap:"./textures/8081_earthlights10k.jpg",
      cloudsMap: "./textures/8081_earthhiresclouds4K.jpg",
      cloudsAlpha: "./textures/earthcloudmaptrans.jpg"
    },

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
        speed: 0.03,
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
if (planet.name === 'Earth' && planet.layers) {
  const lightsMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(planet.layers.lightsMap),
    blending: THREE.AdditiveBlending,
  });
  const lightsMesh = new THREE.Mesh(sphereGeometry, lightsMat);
  lightsMesh.name = 'EarthLights';
  lightsMesh.scale.setScalar(1.005);
  planetMesh.add(lightsMesh);

  const cloudsMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(planet.layers.cloudsMap),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: textureLoader.load(planet.layers.cloudsAlpha),
  });
  const cloudsMesh = new THREE.Mesh(sphereGeometry, cloudsMat);
  cloudsMesh.name = 'EarthClouds';
  cloudsMesh.scale.setScalar(1.01);
  planetMesh.add(cloudsMesh);

  const fresnelMat = getFresnelMat();
  const glowMesh = new THREE.Mesh(sphereGeometry, fresnelMat);
  glowMesh.scale.setScalar(1.015);
  planetMesh.add(glowMesh)
}

// set the scale
planetMesh.scale.setScalar(planet.radius);
planetMesh.position.x = planet.distance;
// planetMesh.rotation.z = -planet.tilt*Math.PI / 180;

return planetMesh;
}
const createMoon = (moon) =>{
  const moonMesh = new THREE.Mesh(
    sphereGeometry,
    moonMaterial
  )
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  moonMesh.name = moon.name;

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
// add the moon the planet
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
// controls.maxDistance = 200;
// controls.minDistance = 20;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

const renderloop = () => {
  const elapsedTime = clock.getElapsedTime();

// console.log(planetMeshes);
  planetMeshes.forEach((planet , planetIndex) => {
    const angle = elapsedTime * planets[planetIndex].speed*10;
    const distance = planets[planetIndex].distance;
    // planet.position.x = Math.sin(angle) * distance;
    // planet.position.z = Math.cos(angle) * distance;

    // planet.rotation.y += planets[planetIndex].speed;

    if(planets[planetIndex].name === 'Earth'){
      const cloudsMesh = planet.getObjectByName('EarthClouds');

      // if (lightsMesh) lightsMesh.rotation.y += 0.002;
      if (cloudsMesh) cloudsMesh.rotation.y += 0.0023;
    }
    planets[planetIndex].moons.forEach((moonData , moonIndex) =>{
     const moonMesh = planet.children.find(child => child.name === moonData.name);
      if (moonMesh) {
        const moonAngle = elapsedTime * moonData.speed;
        const mx = Math.sin(moonAngle) * moonData.distance;
        const mz = Math.cos(moonAngle) * moonData.distance;
        // moonMesh.position.set(mx,0,mz);
      }
    })
  })
  animateSolarWind();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};


renderloop();
