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
const marsTexture = textureLoader.load('/textures/mars_1k_normal.jpg')
const jupiterTexture = textureLoader.load('/textures/jupitermap.jpg');
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

const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};


renderloop();
