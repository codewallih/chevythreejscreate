import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

// Camera and scene setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 15;

const scene = new THREE.Scene();
let bee;
const loader = new GLTFLoader();

// Load  model
loader.load(
  "/1970_chevrolet_camaro_pro_touring.glb",
  function (gltf) {
    bee = gltf.scene;
    bee.scale.set(0.005, 0.005, 0.005);
    bee.position.set(-1, -5, -1); // Slightly lower position on the Y-axis
    bee.rotation.set(0, Math.PI, 0.5); // <- this makes it straight and horizontal

    scene.add(bee);

    function animateBee(time) {
      bee.position.y = Math.sin(time / 200) * 0.5 - 5; // buzzzz up/down
      requestAnimationFrame(animateBee);
    }
    animateBee();

    function spinBee() {
      bee.rotation.y += 0.01;
      requestAnimationFrame(spinBee);
    }
    spinBee();

    const mixer = new THREE.AnimationMixer(bee);
    // mixer.clipAction(gltf.animations[0]).play();//error
    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    } else {
      console.warn("No animations found in the GLTF file!");
    }
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Set up renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 150);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 100);
topLight.position.set(500, 500, 500);
scene.add(topLight);

// Render function
function reRender3D() {
  requestAnimationFrame(reRender3D);
  renderer.render(scene, camera);
}

reRender3D();

// Update renderer and camera on resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Scroll event listener to make the model rotate continuously
let lastScrollY = 0; // Keeps track of the last scroll position

window.addEventListener("scroll", () => {
  if (bee) {
    // Calculate scroll delta (how much the user scrolled)
    const scrollDelta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY; // Update the last scroll position

    // Apply the scroll delta to the rotation
    bee.rotation.y += scrollDelta * 0.005; // Rotate the model based on scroll amount

    // Smooth the rotation with gsap (optional for smoother feel)
    gsap.to(bee.rotation, {
      y: bee.rotation.y, // Smooth rotation
      duration: 0.1,
      ease: "power1.out",
    });
  }
});
