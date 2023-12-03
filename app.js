// Core Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a simple book model
const bookGeometry = new THREE.BoxGeometry(2, 3, 0.5);
const bookMaterial = new THREE.MeshBasicMaterial({ color: "cornsilk" });
const book = new THREE.Mesh(bookGeometry, bookMaterial);
scene.add(book);

// Camera position
camera.position.z = 5;

// Target rotation for hover
const hoverTargetRotation = { x: 0.1, y: 0.1 }; // Adjust as needed
const hoverLerpFactor = 0.1; // Adjust for smoother transition

// Define tilt angles for hover effect
const hoverTiltX = 0.1; // Slight tilt in X axis
const hoverTiltY = -0.1; // Slight tilt in Y axis

let mouseOver = false;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Event listeners for mouse interactions
document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);

function onMouseMove(event) {
    event.preventDefault();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(book);
    mouseOver = intersects.length > 0;

    if (isDragging) {
        // Update the rotation based on the mouse movement
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        book.rotation.y += deltaX * 0.01;
        book.rotation.x += deltaY * 0.01;

        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
    }
}

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseUp() {
    isDragging = false;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (mouseOver && !isDragging) {
        // Apply a slight tilt when hovered
        book.rotation.x += (hoverTargetRotation.x - book.rotation.x) * hoverLerpFactor;
        book.rotation.y += (hoverTargetRotation.y - book.rotation.y) * hoverLerpFactor;
        } else if (!mouseOver) {
        // Reset rotation when mouse is not hovering
        book.rotation.x = 0;
        book.rotation.y = 0;
    }


    renderer.render(scene, camera);
}

animate();
