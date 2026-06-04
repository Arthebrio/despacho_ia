/* ╔══════════════════════════════════════════════════════════════════╗
   ║          three-visualizer.js  —  LEXIA_MX                       ║
   ║          Visualizador 3D Orbital · Ley de Amparo                 ║
   ║          Versión 4  —  2026-05-30                                ║
   ║                                                                  ║
   ║  NOVEDADES v4:                                                   ║
   ║  · Texto horizontal dentro de la esfera, sin fondo              ║
   ║    (Sprite transparente centrado en la esfera)                   ║
   ╚══════════════════════════════════════════════════════════════════╝ */


/* ════════════════════════════════════════════════════════════════════
   ███████╗ ███████╗  ██████╗  ██████╗ ██╗  ██████╗ ███╗   ██╗
   ██╔════╝ ██╔════╝ ██╔════╝ ██╔════╝ ██║ ██╔═══██╗████╗  ██║
   ███████╗ █████╗   ██║      ██║      ██║ ██║   ██║██╔██╗ ██║
   ╚════██║ ██╔══╝   ██║      ██║      ██║ ██║   ██║██║╚██╗██║
   ███████║ ███████╗ ╚██████╗ ╚██████╗ ██║ ╚██████╔╝██║ ╚████║
   ╚══════╝ ╚══════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═════╝ ╚═╝  ╚═══╝

   BLOQUE DE CONFIGURACIÓN CENTRAL
   ─────────────────────────────────────────────────────────────────
   Modifica SOLO este bloque para ajustar el comportamiento visual.
   No necesitas tocar nada más del código.
   ════════════════════════════════════════════════════════════════ */

const CONFIG = {


  /* ════════════════════════════════════════════════════════════════════
  /* ── ESCENA ─────────────────────────────────────────────── */

  FONDO_COLOR:            0x04040f,   // Color del fondo (hex). 0x04040f = negro azulado profundo
  NIEBLA_DENSIDAD:        0.016,      // 0 = sin niebla | 0.05 = muy densa
  ALTO_CANVAS:            500,        // Alto del canvas en píxeles

  /* ════════════════════════════════════════════════════════════════════
  /* ── ESTRELLAS ───────────────────────────────────────────── */

  ESTRELLAS_CANTIDAD:     1600,        // Número de estrellas en el fondo
  ESTRELLAS_TAMANIO:      0.33,       // Tamaño de cada punto-estrella
  ESTRELLAS_OPACIDAD:     0.55,       // 0.0 – 1.0
  ESTRELLAS_RANGO:        220,        // Dispersión en el espacio (unidades Three.js)

  /* ════════════════════════════════════════════════════════════════════
  /* ── NODO CENTRAL — esfera ───────────────────────────────── */

  CENTRO_COLOR:           '#d4890a',  // Color base de la esfera central (dorado)
  CENTRO_RADIO:           1.00,       // Radio de la esfera central
  CENTRO_RUGOSIDAD:       0.35,       // 0 = brillante | 1 = mate
  CENTRO_METALICO:        0.10,       // 0 = plástico | 1 = metálico

  /* ════════════════════════════════════════════════════════════════════
  /* ── NODO CENTRAL — texto interior ──────────────────────── */

  CENTRO_TEXTO_COLOR:     '#000000',  // Color del texto del nodo CENTRAL
  CENTRO_TEXTO_SOMBRA:    'rgba(0, 0, 0, 0.0)', // Sombra del texto central
  CENTRO_TEXTO_ESCALA:    1.25,       // Escala del sprite de texto (relativa al radio)
                                      // 1.0 = mismo diámetro que la esfera
                                      // 1.5 = un poco más grande que la esfera
  CENTRO_TEXTO_OFFSET_Z:  0.02,       // Desplazamiento hacia cámara (0.01–0.05 recomendado)

  
  /* ════════════════════════════════════════════════════════════════════
  /* ── SATÉLITES — esferas ─────────────────────────────────── */

  SATELITE_COLOR:         '#1a4a8a',  // Color base de TODOS los satélites (azul)
  SATELITE_RUGOSIDAD:     0.40,
  SATELITE_METALICO:      0.05,
  SATELITE_RADIO_MIN:     0.33,       // Radio esfera cuando peso = 1
  SATELITE_RADIO_MAX:     0.78,       // Radio esfera cuando peso = 10

  /* ── SATÉLITES — texto interior ─────────────────────────── */

  SATELITE_TEXTO_COLOR:   '#f5d63c',  // Color del texto de los satélites
  SATELITE_TEXTO_SOMBRA:  'rgba(0,0,0,0.95)',
  SATELITE_TEXTO_ESCALA:  1.45,       // Escala del sprite de texto (relativa al radio)
  SATELITE_TEXTO_OFFSET_Z: 0.02,      // Desplazamiento hacia cámara

  /* ── TEXTO — parámetros compartidos ─────────────────────── */

  TEXTO_FUENTE_GRANDE:    '32px',     // Fuente para texto corto (≤ 9 chars)
  TEXTO_FUENTE_PEQUENA:   '26px',     // Fuente para texto largo (> 9 chars)
  TEXTO_FAMILIA:          '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
  TEXTO_MAX_CHARS_LINEA:  14,         // Máximo de caracteres por línea antes de cortar
  TEXTO_SOMBRA_BLUR:      8,          // Desenfoque de sombra del texto
  TEXTO_NEGRITA:          true,       // true = Bold | false = normal

  /* ── ÓRBITAS ─────────────────────────────────────────────── */
  //
  // NÚMERO DE ÓRBITAS: 2 ó 3
  //   2 → Alta → órbita cercana | Media + Baja → órbita lejana
  //   3 → una órbita independiente por capa (Alta / Media / Baja)
  //
  ORBITAS_NUMERO:         3,          // ← CAMBIA AQUÍ: 2 ó 3

  ORBITA_CERCA:           1.9,        // Radio órbita 1 (más próxima)
  ORBITA_MEDIA:           3.4,        // Radio órbita 2 (solo si ORBITAS_NUMERO = 3)
  ORBITA_LEJOS:           4.8,        // Radio órbita exterior

  ORBITA_INCLINACION:     0.12,       // Inclinación del plano orbital (radianes, ~12°)

  /* ── LÍNEAS DE CONEXIÓN ──────────────────────────────────── */
  LINEA_COLOR:            0x1a3a6a,
  LINEA_OPACIDAD:         0.30,

  /* ── CÁMARA ──────────────────────────────────────────────── */
  CAMARA_FOV:             45,
  CAMARA_DISTANCIA_INI:   14,
  CAMARA_DIST_MIN:        5,
  CAMARA_DIST_MAX:        24,
  CAMARA_ROT_Y_INI:       0.45,
  CAMARA_ROT_Y_MIN:      -1.35,
  CAMARA_ROT_Y_MAX:       1.35,

  /* ── INTERACCIÓN ─────────────────────────────────────────── */
 
  MOUSE_SENSIBILIDAD:       0.008,
  SCROLL_SENSIBILIDAD:      0.014,
  AUTO_ROTACION:            true,
  AUTO_ROTACION_VEL:        0.0010,
  
  /* ── LUCES ───────────────────────────────────────────────── */
  
  LUZ_AMBIENTAL_COLOR:    0x253055,
  LUZ_AMBIENTAL_INT:      1.4,
  LUZ_PRINCIPAL_COLOR:    0xffffff,
  LUZ_PRINCIPAL_INT:      0.7,
  LUZ_RELLENO_COLOR:      0x2244aa,
  LUZ_RELLENO_INT:        0.7,
};


/* ════════════════════════════════════════════════════════════════════
   VARIABLES DE ESTADO INTERNO
   (No modificar — se gestionan en tiempo de ejecución)
   ════════════════════════════════════════════════════════════════ */


   let scene, camera, renderer;
let esferaCentro    = null;
let spriteCentro    = null;
let satelites       = [];   // Meshes de esferas satélite (para raycaster)
let spritesTexto    = [];   // Sprites de texto interior de satélites
let lineasConexion  = [];
let currentOnSateliteClick = null;

// Control de cámara
let isDragging = false;
let lastMouseX = 0, lastMouseY = 0;
let rotX       = 0;
let rotY       = CONFIG.CAMARA_ROT_Y_INI;
let distancia  = CONFIG.CAMARA_DISTANCIA_INI;
let autoRotate = CONFIG.AUTO_ROTACION;

// Cachés
const texturaEsferaCache  = new Map();   // color → CanvasTexture (sin texto)
const texturaTextoCache   = new Map();   // "texto__color" → CanvasTexture (solo texto)


/* ════════════════════════════════════════════════════════════════════
   UTILIDADES DE COLOR
   ════════════════════════════════════════════════════════════════ */

function aclarar(hex, amount) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (n >> 16)         + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff)        + amount);
  return `rgb(${r},${g},${b})`;
}
function oscurecer(hex, amount) { return aclarar(hex, -amount); }


/* ════════════════════════════════════════════════════════════════════
   TEXTURA DE ESFERA (solo color, sin texto)
   ─────────────────────────────────────────────────────────────────
   Degradado radial que simula iluminación esférica. La esfera queda
   limpia — el texto va en un Sprite separado encima.
   ════════════════════════════════════════════════════════════════ */

function crearTexturaEsfera(colorBase) {
  if (texturaEsferaCache.has(colorBase)) return texturaEsferaCache.get(colorBase);

  const S  = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d');

  const grad = ctx.createRadialGradient(S * 0.35, S * 0.28, S * 0.04, S / 2, S / 2, S / 2);
  grad.addColorStop(0,   aclarar(colorBase, 75));
  grad.addColorStop(0.5, colorBase);
  grad.addColorStop(1,   oscurecer(colorBase, 55));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  // Borde especular sutil
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth   = 3;
  ctx.strokeRect(1, 1, S - 2, S - 2);

  const tex = new THREE.CanvasTexture(cv);
  texturaEsferaCache.set(colorBase, tex);
  return tex;
}

function crearEsfera(colorBase, radio, rugosidad, metalico) {
  const mat = new THREE.MeshStandardMaterial({
    map:       crearTexturaEsfera(colorBase),
    roughness: rugosidad,
    metalness: metalico,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(radio, 36, 36), mat);
}


/* ════════════════════════════════════════════════════════════════════
   SPRITE DE TEXTO — TRANSPARENTE, CENTRADO EN LA ESFERA
   ─────────────────────────────────────────────────────────────────
   Técnica: THREE.Sprite con SpriteMaterial (depthTest: false).
   El Sprite siempre mira a la cámara (billboarding automático).
   El canvas tiene fondo 100% transparente → solo se ve el texto.
   Se coloca exactamente en el centro de la esfera (misma posición).
   El parámetro `escalaRelativa` se multiplica por el diámetro de la
   esfera para que el texto escale proporcionalmente a ella.
   ════════════════════════════════════════════════════════════════ */

/** Divide texto en líneas respetando MAX_CHARS_LINEA */
function dividirEnLineas(texto) {
  const max     = CONFIG.TEXTO_MAX_CHARS_LINEA;
  const palabras = (texto || '?').trim().split(/\s+/);
  const lineas   = [];
  let actual     = '';

  palabras.forEach(p => {
    const prueba = actual ? `${actual} ${p}` : p;
    if (prueba.length <= max) {
      actual = prueba;
    } else {
      if (actual) lineas.push(actual);
      actual = p.length > max ? p.substring(0, max) : p;
    }
  });
  if (actual) lineas.push(actual);
  return lineas;
}

/**
 * Crea un THREE.Sprite con texto horizontal, fondo TRANSPARENTE.
 *
 * @param {string} texto          — texto a mostrar
 * @param {string} colorTexto     — color CSS del texto (ej. '#ffffff')
 * @param {string} colorSombra    — color CSS de la sombra
 * @param {number} radioEsfera    — radio de la esfera a la que pertenece
 * @param {number} escalaRelativa — multiplicador sobre el diámetro (ej. 1.5)
 * @param {number} offsetZ        — desplazamiento hacia la cámara (ej. 0.02)
 */
function crearSpriteTexto(texto, colorTexto, colorSombra, radioEsfera, escalaRelativa, offsetZ) {
  const cacheKey = `${texto}__${colorTexto}`;
  let tex;

  if (texturaTextoCache.has(cacheKey)) {
    tex = texturaTextoCache.get(cacheKey);
  } else {
    /* — Canvas cuadrado de alta resolución — */
    const S        = 256;                          // tamaño del canvas (potencia de 2)
    const cv       = document.createElement('canvas');
    cv.width = cv.height = S;
    const ctx      = cv.getContext('2d');

    /* Fondo completamente transparente — no hacemos fillRect */

    /* — Configurar fuente — */
    const esCorto  = texto.length <= 9;
    const tamFont  = esCorto ? CONFIG.TEXTO_FUENTE_GRANDE : CONFIG.TEXTO_FUENTE_PEQUENA;
    const peso     = CONFIG.TEXTO_NEGRITA ? 'Bold' : 'normal';
    ctx.font       = `${peso} ${tamFont} ${CONFIG.TEXTO_FAMILIA}`;

    /* — Dividir en líneas — */
    const lineas      = dividirEnLineas(texto);
    const numLineas   = lineas.length;
    const altoLinea   = esCorto ? 52 : 42;         // px entre líneas en el canvas
    const totalAlto   = numLineas * altoLinea;
    const startY      = (S - totalAlto) / 2 + altoLinea / 2;

    /* — Dibujar cada línea centrada — */
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor  = colorSombra;
    ctx.shadowBlur   = CONFIG.TEXTO_SOMBRA_BLUR;

    lineas.forEach((linea, i) => {
      // Sombra negra gruesa primero (para contraste sobre la esfera)
      ctx.fillStyle = colorSombra;
      ctx.shadowBlur = 12;
      ctx.fillText(linea, S / 2, startY + i * altoLinea);

      // Texto en color real encima
      ctx.fillStyle = colorTexto;
      ctx.shadowBlur = 4;
      ctx.fillText(linea, S / 2, startY + i * altoLinea);
    });

    tex = new THREE.CanvasTexture(cv);
    texturaTextoCache.set(cacheKey, tex);
  }

  /* — Crear el Sprite — */
  const mat = new THREE.SpriteMaterial({
    map:       tex,
    transparent: true,
    depthTest:   false,   // se dibuja siempre por encima de la esfera propia
    depthWrite:  false,
  });

  const sprite = new THREE.Sprite(mat);

  // Escala: el sprite cubre `escalaRelativa` × diámetro en el eje X e Y
  const lado = radioEsfera * 2 * escalaRelativa;
  sprite.scale.set(lado, lado, 1);

  // Guardamos el offsetZ en userData para aplicarlo al posicionar
  sprite.userData.offsetZ = offsetZ;

  return sprite;
}


/* ════════════════════════════════════════════════════════════════════
   POSICIONAR SPRITE EN EL CENTRO DE SU ESFERA
   ─────────────────────────────────────────────────────────────────
   El sprite se coloca en la misma posición (x, y, z) que la esfera.
   El pequeño offsetZ lo desplaza levemente hacia la cámara para
   evitar z-fighting (parpadeo) con la superficie de la esfera.
   Como depthTest = false, en realidad siempre se ve encima, pero
   el offset añade seguridad adicional en todos los ángulos.
   ════════════════════════════════════════════════════════════════ */

function posicionarSpriteEnEsfera(sprite, posEsfera) {
  // El offset lo aplicamos sobre el vector que va del origen a la posición
  // de la esfera, para que siempre apunte "hacia fuera" desde el centro.
  const dir = new THREE.Vector3(posEsfera.x, posEsfera.y, posEsfera.z);
  // Si el nodo es el central (posición 0,0,0), apuntamos hacia Z positivo
  if (dir.length() < 0.001) dir.set(0, 0, 1);
  dir.normalize().multiplyScalar(sprite.userData.offsetZ || 0.02);

  sprite.position.set(
    posEsfera.x + dir.x,
    posEsfera.y + dir.y,
    posEsfera.z + dir.z,
  );
}


/* ════════════════════════════════════════════════════════════════════
   CAMPO DE ESTRELLAS
   ════════════════════════════════════════════════════════════════ */

function crearEstrellas() {
  const geo  = new THREE.BufferGeometry();
  const pos  = [];
  const rng  = CONFIG.ESTRELLAS_RANGO;

  for (let i = 0; i < CONFIG.ESTRELLAS_CANTIDAD; i++) {
    pos.push(
      (Math.random() - 0.5) * rng,
      (Math.random() - 0.5) * rng,
      (Math.random() - 0.5) * rng,
    );
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));

  return new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xffffff, size: CONFIG.ESTRELLAS_TAMANIO,
    transparent: true, opacity: CONFIG.ESTRELLAS_OPACIDAD,
  }));
}


/* ════════════════════════════════════════════════════════════════════
   LÍNEAS DE CONEXIÓN
   ════════════════════════════════════════════════════════════════ */

function crearLinea(desde, hasta) {
  const mat = new THREE.LineBasicMaterial({
    color: CONFIG.LINEA_COLOR, transparent: true, opacity: CONFIG.LINEA_OPACIDAD,
  });
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...desde), new THREE.Vector3(...hasta),
  ]);
  return new THREE.Line(geo, mat);
}


/* ════════════════════════════════════════════════════════════════════
   CÁMARA ORBITAL
   ════════════════════════════════════════════════════════════════ */

function actualizarCamara() {
  const cosY = Math.cos(rotY);
  camera.position.set(
    Math.sin(rotX) * cosY * distancia,
    Math.sin(rotY)        * distancia,
    Math.cos(rotX) * cosY * distancia,
  );
  camera.lookAt(0, 0, 0);
}


/* ════════════════════════════════════════════════════════════════════
   POSICIONAMIENTO EN ÓRBITA CIRCULAR
   ════════════════════════════════════════════════════════════════ */

function posicionEnOrbita(indice, total, radioOrbita) {
  const angulo = total > 1 ? (indice / total) * Math.PI * 2 : 0;
  const inc    = CONFIG.ORBITA_INCLINACION;
  return {
    x: Math.cos(angulo) * radioOrbita,
    y: Math.sin(angulo) * radioOrbita * Math.sin(inc),
    z: Math.sin(angulo) * radioOrbita * Math.cos(inc),
  };
}


/* ════════════════════════════════════════════════════════════════════
   ASIGNACIÓN DE RADIO DE ÓRBITA SEGÚN CONFIG.ORBITAS_NUMERO
   ════════════════════════════════════════════════════════════════ */

function obtenerRadioOrbita(capa) {
  if (CONFIG.ORBITAS_NUMERO === 2) {
    return capa === 'Alta' ? CONFIG.ORBITA_CERCA : CONFIG.ORBITA_LEJOS;
  }
  return { Alta: CONFIG.ORBITA_CERCA, Media: CONFIG.ORBITA_MEDIA, Baja: CONFIG.ORBITA_LEJOS }[capa]
    ?? CONFIG.ORBITA_MEDIA;
}


/* ════════════════════════════════════════════════════════════════════
   INICIALIZACIÓN DEL VISUALIZADOR
   ════════════════════════════════════════════════════════════════ */

export function initThreeVisualizer(containerId, canvasId) {
  console.log('🟢 Iniciando visualizador 3D LEXIA_MX v4...');

  const container = document.getElementById(containerId);
  const canvas    = document.getElementById(canvasId);
  if (!container || !canvas) { console.error('❌ Contenedor o canvas no encontrado'); return false; }

  const ancho = container.clientWidth || 800;
  const alto  = CONFIG.ALTO_CANVAS;

  canvas.width = ancho; canvas.height = alto;
  canvas.style.width = '100%'; canvas.style.height = `${alto}px`;

  /* ── Escena ── */
  scene            = new THREE.Scene();
  scene.background = new THREE.Color(CONFIG.FONDO_COLOR);
  scene.fog        = new THREE.FogExp2(CONFIG.FONDO_COLOR, CONFIG.NIEBLA_DENSIDAD);

  /* ── Cámara ── */
  camera    = new THREE.PerspectiveCamera(CONFIG.CAMARA_FOV, ancho / alto, 0.1, 1000);
  rotX = 0; rotY = CONFIG.CAMARA_ROT_Y_INI; distancia = CONFIG.CAMARA_DISTANCIA_INI;
  actualizarCamara();

  /* ── Renderer ── */
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(ancho, alto);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /* ── Luces ── */
  scene.add(new THREE.AmbientLight(CONFIG.LUZ_AMBIENTAL_COLOR, CONFIG.LUZ_AMBIENTAL_INT));
  const luzP = new THREE.DirectionalLight(CONFIG.LUZ_PRINCIPAL_COLOR, CONFIG.LUZ_PRINCIPAL_INT);
  luzP.position.set(6, 10, 4); scene.add(luzP);
  const luzR = new THREE.PointLight(CONFIG.LUZ_RELLENO_COLOR, CONFIG.LUZ_RELLENO_INT, 40);
  luzR.position.set(-8, -4, -8); scene.add(luzR);

  /* ── Estrellas ── */
  scene.add(crearEstrellas());

  /* ── Eventos ── */
  canvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true; autoRotate = false;
    lastMouseX = e.clientX; lastMouseY = e.clientY;
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    rotX += (e.clientX - lastMouseX) * CONFIG.MOUSE_SENSIBILIDAD;
    rotY += (e.clientY - lastMouseY) * CONFIG.MOUSE_SENSIBILIDAD;
    rotY  = Math.max(CONFIG.CAMARA_ROT_Y_MIN, Math.min(CONFIG.CAMARA_ROT_Y_MAX, rotY));
    actualizarCamara();
    lastMouseX = e.clientX; lastMouseY = e.clientY;
  });
  window.addEventListener('mouseup', () => { isDragging = false; canvas.style.cursor = 'grab'; });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    distancia += e.deltaY * CONFIG.SCROLL_SENSIBILIDAD;
    distancia  = Math.max(CONFIG.CAMARA_DIST_MIN, Math.min(CONFIG.CAMARA_DIST_MAX, distancia));
    actualizarCamara();
  }, { passive: false });
  canvas.style.cursor = 'grab';

  /* ── Raycaster: clicks sobre esferas ── */
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2();
  canvas.addEventListener('click', (e) => {
    if (!currentOnSateliteClick) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((e.clientY - rect.top)  / rect.height)  * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(satelites);
    if (hits.length > 0 && hits[0].object.userData.texto)
      currentOnSateliteClick(hits[0].object.userData.texto);
  });

  /* ── Loop de animación ── */
  function animate() {
    requestAnimationFrame(animate);
    if (autoRotate && !isDragging) { rotX += CONFIG.AUTO_ROTACION_VEL; actualizarCamara(); }
    renderer.render(scene, camera);
  }
  animate();

  /* ── Resize responsivo ── */
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    camera.aspect = w / alto; camera.updateProjectionMatrix();
    renderer.setSize(w, alto);
  });

  console.log(`✅ Visualizador listo — ${CONFIG.ORBITAS_NUMERO} órbitas | texto dentro de esferas`);
  return true;
}


/* ════════════════════════════════════════════════════════════════════
   ACTUALIZACIÓN DEL GRAFO 3D
   ─────────────────────────────────────────────────────────────────
   Limpia la escena anterior y construye el nuevo grafo:
   esfera central + esferas satélite, cada una con su sprite de
   texto transparente centrado dentro de ella.
   ════════════════════════════════════════════════════════════════ */

export function actualizarVisualizador3D(centroLabel, relaciones, onSateliteClick) {
  console.log(`🎨 Actualizando: "${centroLabel}" | ${relaciones.length} satélites | ${CONFIG.ORBITAS_NUMERO} órbitas`);
  if (!scene) { console.error('❌ Scene no inicializada'); return; }

  currentOnSateliteClick = onSateliteClick;
  autoRotate             = CONFIG.AUTO_ROTACION;

  /* ── Limpiar ── */
  satelites.forEach(s      => scene.remove(s));
  spritesTexto.forEach(sp  => scene.remove(sp));
  lineasConexion.forEach(l => scene.remove(l));
  satelites = []; spritesTexto = []; lineasConexion = [];
  if (esferaCentro) scene.remove(esferaCentro);
  if (spriteCentro) scene.remove(spriteCentro);

  /* ── Nodo central ── */
  esferaCentro = crearEsfera(
    CONFIG.CENTRO_COLOR, CONFIG.CENTRO_RADIO,
    CONFIG.CENTRO_RUGOSIDAD, CONFIG.CENTRO_METALICO,
  );
  scene.add(esferaCentro);

  // Sprite de texto del nodo central — centrado en (0,0,0)
  spriteCentro = crearSpriteTexto(
    centroLabel || '?',
    CONFIG.CENTRO_TEXTO_COLOR,
    CONFIG.CENTRO_TEXTO_SOMBRA,
    CONFIG.CENTRO_RADIO,
    CONFIG.CENTRO_TEXTO_ESCALA,
    CONFIG.CENTRO_TEXTO_OFFSET_Z,
  );
  posicionarSpriteEnEsfera(spriteCentro, { x: 0, y: 0, z: 0 });
  scene.add(spriteCentro);

  if (relaciones.length === 0) { console.warn('⚠️ Sin satélites'); return; }

  /* ── Agrupar por capa ── */
  const grupos = { Alta: [], Media: [], Baja: [] };
  relaciones.forEach(rel => {
    let capa = String(rel.capa || 'Media');
    capa     = capa.charAt(0).toUpperCase() + capa.slice(1).toLowerCase();
    if (!grupos[capa]) capa = 'Media';
    grupos[capa].push(rel);
  });

  /* ── Construir satélites ── */
  Object.entries(grupos).forEach(([capa, nodos]) => {
    if (!nodos.length) return;
    const radioOrbita = obtenerRadioOrbita(capa);

    nodos.forEach((rel, indice) => {
      const label = (rel.label_corto || rel.concepto || '?').trim();
      let peso    = Number(rel.peso);
      if (isNaN(peso) || peso <= 0) peso = 5;
      peso = Math.max(1, Math.min(10, peso));

      const radioEsfera = CONFIG.SATELITE_RADIO_MIN
        + ((peso - 1) / 9) * (CONFIG.SATELITE_RADIO_MAX - CONFIG.SATELITE_RADIO_MIN);

      const pos = posicionEnOrbita(indice, nodos.length, radioOrbita);

      /* — Esfera — */
      const sat = crearEsfera(
        CONFIG.SATELITE_COLOR, radioEsfera,
        CONFIG.SATELITE_RUGOSIDAD, CONFIG.SATELITE_METALICO,
      );
      sat.position.set(pos.x, pos.y, pos.z);
      sat.userData = { texto: label, capa, peso };
      scene.add(sat);
      satelites.push(sat);

      /* — Sprite de texto centrado dentro de la esfera — */
      const sp = crearSpriteTexto(
        label,
        CONFIG.SATELITE_TEXTO_COLOR,
        CONFIG.SATELITE_TEXTO_SOMBRA,
        radioEsfera,
        CONFIG.SATELITE_TEXTO_ESCALA,
        CONFIG.SATELITE_TEXTO_OFFSET_Z,
      );
      posicionarSpriteEnEsfera(sp, pos);
      scene.add(sp);
      spritesTexto.push(sp);

      /* — Línea — */
      const linea = crearLinea([0, 0, 0], [pos.x, pos.y, pos.z]);
      scene.add(linea);
      lineasConexion.push(linea);

      console.log(`   [${capa}][${indice}] "${label}" peso=${peso} r=${radioEsfera.toFixed(2)}`);
    });
  });

  console.log(`✅ ${satelites.length} satélites listos — texto dentro de esferas`);
}


/* ════════════════════════════════════════════════════════════════════
   LIMPIEZA COMPLETA
   ════════════════════════════════════════════════════════════════ */

export function limpiarVisualizador() {
  satelites.forEach(s      => scene?.remove(s));
  spritesTexto.forEach(sp  => scene?.remove(sp));
  lineasConexion.forEach(l => scene?.remove(l));
  satelites = []; spritesTexto = []; lineasConexion = [];
  if (esferaCentro) { scene?.remove(esferaCentro); esferaCentro = null; }
  if (spriteCentro) { scene?.remove(spriteCentro); spriteCentro = null; }
  console.log('🧹 Visualizador limpiado');
}
