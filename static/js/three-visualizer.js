/* ============================================ */
/* THREE.JS VISUALIZADOR 3D - VERSIÓN FINAL     */
/* CON CORRECCIÓN DE RESIZE INICIAL             */
/* ============================================ */

let scene, camera, renderer;
let esferaCentral = null;
let esferasSatelite = [];
let ring = null;
let stars = null;
let isDragging = false;
let lastMouseX = 0, lastMouseY = 0;
let cameraTheta = 0.8, cameraPhi = 0.6, cameraRadius = 8;
let animationId = null;
let orbitAnimationId = null;
let currentCanvas = null;
let visualizadorActivo = false;
let onConceptoClickCallback = null;
let onCentralClickCallback = null;

const texturaCache = new Map();

const orbitas = [
    { radio: 2.0, velocidad: 0.0020 },
    { radio: 2.8, velocidad: 0.0015 },
    { radio: 3.6, velocidad: 0.0010 }
];

/* ============================================ */
/* INICIALIZACIÓN                              */
/* ============================================ */
export function initThreeVisualizer(containerId, canvasId) {
    const container = document.getElementById(containerId);
    const canvas = document.getElementById(canvasId);
    
    if (!container || !canvas) return false;
    
    if (scene) {
        if (animationId) cancelAnimationFrame(animationId);
        if (orbitAnimationId) cancelAnimationFrame(orbitAnimationId);
        if (renderer) renderer.dispose();
        texturaCache.clear();
    }
    
    currentCanvas = canvas;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2a);
    
    const width = container.clientWidth;
    camera = new THREE.PerspectiveCamera(45, width / 400, 0.1, 1000);
    actualizarPosicionCamara();
    
    renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });
    renderer.setSize(width, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // ============================================
    // CORRECCIÓN: Forzar resize inicial
    // ============================================
    setTimeout(() => {
        const w = container.clientWidth;
        renderer.setSize(w, 400);
        camera.aspect = w / 400;
        camera.updateProjectionMatrix();
        console.log('🔄 Resize inicial forzado');
    }, 100);
    
    // Luces
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);
    
    const backLight = new THREE.PointLight(0x4466cc, 0.3);
    backLight.position.set(-2, 1, -3);
    scene.add(backLight);
    
    // Estrellas
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPositions[i*3] = (Math.random() - 0.5) * 200;
        starPositions[i*3+1] = (Math.random() - 0.5) * 100;
        starPositions[i*3+2] = (Math.random() - 0.5) * 80 - 40;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.6 });
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    function animateStars() {
        if (stars) {
            stars.rotation.y += 0.0003;
            stars.rotation.x += 0.0002;
        }
        requestAnimationFrame(animateStars);
    }
    animateStars();
    
    configurarControles(canvas);
    
    function animate() {
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
        animationId = requestAnimationFrame(animate);
    }
    animate();
    
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        renderer.setSize(w, 400);
        camera.aspect = w / 400;
        camera.updateProjectionMatrix();
    });
    
    visualizadorActivo = true;
    return true;
}

function actualizarPosicionCamara() {
    if (!camera) return;
    camera.position.x = cameraRadius * Math.sin(cameraPhi) * Math.cos(cameraTheta);
    camera.position.z = cameraRadius * Math.sin(cameraPhi) * Math.sin(cameraTheta);
    camera.position.y = cameraRadius * Math.cos(cameraPhi);
    camera.lookAt(0, 0, 0);
}

function configurarControles(canvas) {
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        canvas.style.cursor = 'grabbing';
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
        canvas.style.cursor = 'grab';
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        cameraTheta += deltaX * 0.008;
        cameraPhi += deltaY * 0.008;
        cameraPhi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraPhi));
        
        actualizarPosicionCamara();
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });
    
    canvas.style.cursor = 'grab';
    
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        cameraRadius += e.deltaY * 0.015;
        cameraRadius = Math.max(4, Math.min(14, cameraRadius));
        actualizarPosicionCamara();
    });
}

function crearTextura(texto, fontSize, color) {
    const key = `${texto}_${fontSize}_${color}`;
    if (texturaCache.has(key)) {
        return texturaCache.get(key);
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `Bold ${fontSize}px "Segoe UI"`;
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 5;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let textoMostrar = texto;
    if (textoMostrar.length > 14) textoMostrar = textoMostrar.substring(0, 11) + '...';
    ctx.fillText(textoMostrar.toUpperCase(), canvas.width/2, canvas.height/2);
    
    const textura = new THREE.CanvasTexture(canvas);
    texturaCache.set(key, textura);
    return textura;
}

/* ============================================ */
/* ACTUALIZACIÓN DEL VISUALIZADOR               */
/* ============================================ */
export function actualizarVisualizador3D(conceptoCentral, relaciones, onConceptoClick, onCentralClick) {
    if (!scene || !visualizadorActivo) return;
    
    console.log(`🎨 Actualizando: "${conceptoCentral}", ${relaciones.length} relaciones`);
    
    onConceptoClickCallback = onConceptoClick;
    onCentralClickCallback = onCentralClick;
    
    const relacionesLimitadas = [...relaciones].sort((a, b) => b.frecuencia - a.frecuencia).slice(0, 10);
    const maxFrecuencia = relacionesLimitadas.length > 0 ? relacionesLimitadas[0].frecuencia : 1;
    
    // ============================================
    // ESFERA CENTRAL
    // ============================================
    if (!esferaCentral) {
        const geometryCentral = new THREE.SphereGeometry(0.9, 64, 64);
        const materialCentral = new THREE.MeshStandardMaterial({
            color: 0xdd9933,
            roughness: 0.5,
            metalness: 0.1
        });
        esferaCentral = new THREE.Mesh(geometryCentral, materialCentral);
        scene.add(esferaCentral);
        
        const ringGeometry = new THREE.TorusGeometry(1.0, 0.05, 32, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa66 });
        ring = new THREE.Mesh(ringGeometry, ringMaterial);
        esferaCentral.add(ring);
    }
    
    // Actualizar texto central
    const texturaCentral = crearTextura(conceptoCentral, 72, '#1a3a7a');
    const textMaterialCentral = new THREE.SpriteMaterial({ map: texturaCentral, transparent: true, depthTest: false });
    const textSpriteCentral = new THREE.Sprite(textMaterialCentral);
    textSpriteCentral.scale.set(1.5, 1.5, 1);
    
    if (esferaCentral.children) {
        esferaCentral.children.forEach(child => {
            if (child.isSprite) esferaCentral.remove(child);
        });
    }
    esferaCentral.add(textSpriteCentral);
    
    // ============================================
    // ESFERAS SATÉLITE
    // ============================================
    esferasSatelite.forEach(s => scene.remove(s));
    esferasSatelite = [];
    
    relacionesLimitadas.forEach((rel, index) => {
        const orbita = orbitas[index % orbitas.length];
        const tamanio = 0.45 + (rel.frecuencia / maxFrecuencia) * 0.3;
        
        const satGeometry = new THREE.SphereGeometry(tamanio, 48, 48);
        const satMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a5a8a,
            roughness: 0.7,
            metalness: 0.05
        });
        
        const satelite = new THREE.Mesh(satGeometry, satMaterial);
        
        const angle = (index / relacionesLimitadas.length) * Math.PI * 2;
        const radius = orbita.radio;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 0.4;
        
        satelite.position.set(x, y, z);
        satelite.userData = {
            concepto: rel.concepto,
            angulo: angle,
            radio: radius,
            velocidad: orbita.velocidad
        };
        
        scene.add(satelite);
        
        const texturaSat = crearTextura(rel.concepto, 60, '#ffcc66');
        const satTextMaterial = new THREE.SpriteMaterial({ map: texturaSat, transparent: true, depthTest: false });
        const satTextSprite = new THREE.Sprite(satTextMaterial);
        satTextSprite.scale.set(1.8, 1.8, 1);
        satelite.add(satTextSprite);
        
        esferasSatelite.push(satelite);
    });
    
    console.log(`✅ ${esferasSatelite.length} satélites creados`);
    
    // Detener animación anterior si existe
    if (orbitAnimationId) cancelAnimationFrame(orbitAnimationId);
    
    // Iniciar nueva animación de órbitas
    function animarOrbitas() {
        if (esferasSatelite.length === 0) return;
        esferasSatelite.forEach(sat => {
            if (sat.userData.angulo !== undefined) {
                sat.userData.angulo += sat.userData.velocidad;
                const rad = sat.userData.radio;
                sat.position.x = Math.cos(sat.userData.angulo) * rad;
                sat.position.z = Math.sin(sat.userData.angulo) * rad;
            }
        });
        orbitAnimationId = requestAnimationFrame(animarOrbitas);
    }
    animarOrbitas();
    
    configurarRaycaster();
}

function configurarRaycaster() {
    if (!currentCanvas) return;
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const clickHandler = (event) => {
        const rect = currentCanvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / currentCanvas.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / currentCanvas.clientHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(esferasSatelite);
        if (intersects.length > 0) {
            const concepto = intersects[0].object.userData.concepto;
            if (concepto && onConceptoClickCallback) {
                onConceptoClickCallback(concepto);
            }
            return;
        }
        
        const centralIntersects = raycaster.intersectObject(esferaCentral);
        if (centralIntersects.length > 0 && onCentralClickCallback) {
            onCentralClickCallback();
        }
    };
    
    currentCanvas.removeEventListener('click', clickHandler);
    currentCanvas.addEventListener('click', clickHandler);
}

export function cerrarVisualizador3D() {
    if (animationId) cancelAnimationFrame(animationId);
    if (orbitAnimationId) cancelAnimationFrame(orbitAnimationId);
    if (renderer) renderer.dispose();
    texturaCache.clear();
    scene = null;
    camera = null;
    renderer = null;
    visualizadorActivo = false;
}