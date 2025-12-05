import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

// Canvas
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 6);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// Torus
const geometry = new THREE.TorusGeometry(1.25, 0.4, 32, 64);
const material = new THREE.MeshStandardMaterial({ color: 0x7c3aed, metalness: 0.6, roughness: 0.2 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Particles
let particles;
function createParticles() {
  if (particles) scene.remove(particles);

  const count = window.innerWidth < 520 ? 250 : 700;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 12;
    positions[i3 + 2] = (Math.random() - 0.5) * 8;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, opacity: 0.8, transparent: true });

  particles = new THREE.Points(geometry, mat);
  scene.add(particles);
}
createParticles();

// Scroll
let scrollY = window.scrollY;
window.addEventListener('scroll', () => scrollY = window.scrollY);

function cameraTarget() {
  const sections = document.querySelectorAll('.section').length - 1;
  const scrollFraction = scrollY / (document.body.scrollHeight - window.innerHeight);
  const yRange = window.innerWidth < 520 ? 1.8 : 2.2;
  return {
    y: -scrollFraction * (sections * yRange),
    z: 6 - scrollFraction * (window.innerWidth < 520 ? 1.5 : 2.2)
  };
}

// Parallax
const cursor = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  cursor.x = (e.clientX / sizes.width) - 0.5;
  cursor.y = (e.clientY / sizes.height) - 0.5;
});

// Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  createParticles();
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
  const elapsed = clock.getElapsedTime();

  torus.rotation.y = elapsed * 0.4;
  torus.rotation.x = Math.sin(elapsed * 0.3) * 0.2;

  particles.rotation.y = elapsed * 0.02;

  const target = cameraTarget();
  camera.position.y += (target.y - camera.position.y) * 0.08;
  camera.position.z += (target.z - camera.position.z) * 0.06;

  const lookX = cursor.x * 0.4;
  const lookY = -cursor.y * 0.4;
  camera.lookAt(new THREE.Vector3(lookX, lookY, 0));

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
let menuOpen = false;
menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  navLinks.style.display = menuOpen ? 'flex' : '';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'fixed';
  navLinks.style.left = '16px';
  navLinks.style.top = '70px';
});

// Smooth scroll
document.querySelectorAll('.nav a').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    navLinks.style.display = '';
    menuOpen = false;
  });
});
