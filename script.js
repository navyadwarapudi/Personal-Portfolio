// --- Setup Custom Cursor ---
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button, .project-card, .skill-tag');

document.addEventListener('mousemove', (e) => {
    // Immediate cursor
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    // Follower (delayed via gsap for smoothness)
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        gsap.to(cursorFollower, { scale: 1.5, opacity: 0.5, duration: 0.3 });
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        gsap.to(cursorFollower, { scale: 1, opacity: 1, duration: 0.3 });
    });
});

// --- Navbar Hamburger & Scroll ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
}));

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Smooth Scrolling for Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});


// --- Three.js AI Network Background ---
function initThreeJS() {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles/Nodes setup
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;

    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color('#00f0ff');
    const color2 = new THREE.Color('#7000ff');

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Spread particles
        posArray[i] = (Math.random() - 0.5) * 100; // x
        posArray[i + 1] = (Math.random() - 0.5) * 100; // y
        posArray[i + 2] = (Math.random() - 0.5) * 50; // z

        // Randomly assign one of the two colors
        const mixedColor = Math.random() > 0.5 ? color1 : color2;
        colorsArray[i] = mixedColor.r;
        colorsArray[i + 1] = mixedColor.g;
        colorsArray[i + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lines connecting nearby nodes (Simulation of neural net)
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending
    });

    // To add actual lines would be computationally heavy in JS without a custom shader, 
    // so we'll stick to a rotating point cloud to keep it performant and elegant.

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate entire network slowly
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Interactive camera movement based on mouse
        camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
initThreeJS();

// --- GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
const tlHero = gsap.timeline();
tlHero.from('.greeting', { y: 20, opacity: 0, duration: 0.8, delay: 0.2 })
    .from('.title', { y: 30, opacity: 0, duration: 1 }, "-=0.4")
    .from('.subtitle', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
    .from('.cta-buttons', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");

// General Scroll Animations
gsap.utils.toArray('.line-up').forEach(section => {
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleClass: "active"
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    });
});

// Staggered Skills
gsap.from('.skill-category', {
    scrollTrigger: {
        trigger: '.skills-container',
        start: "top 80%"
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
});

// Staggered Projects
gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '.projects-grid',
        start: "top 80%"
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
});
