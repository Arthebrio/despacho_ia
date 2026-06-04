/* ═══════════════════════════════════════════════════════════════════
   CONFIG.JS - Configuración global de LEXIA_MX
   Colores, constantes y parámetros de la aplicación
   ═══════════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────────────────
   CONFIGURACIÓN DE LA APLICACIÓN
   ──────────────────────────────────────────────────────────────────── */
export const APP_CONFIG = {
    // Nombre de la aplicación
    APP_NAME: 'LEXIA_MX',
    APP_VERSION: '2.0.0',
    
    // Umbrales de búsqueda
    BUSQUEDA_MIN_LENGTH: 2,
    BUSQUEDA_PALABRA_MIN_LENGTH: 3,
    
    // Comportamiento UI
    AUTO_CERRAR_PANEL_AL_NAVEGAR: true,
    SCROLL_SUAVE: true,
    
    // Logs (debug)
    SHOW_LOGS: true,
    LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
};

/* ────────────────────────────────────────────────────────────────────
   COLORES DE LA APLICACIÓN
   ──────────────────────────────────────────────────────────────────── */
export const COLORS = {
    // Colores principales
    PRIMARY: '#ffcc66',      // Dorado principal
    PRIMARY_DARK: '#d4890a', // Dorado oscuro
    PRIMARY_LIGHT: '#ffdd88', // Dorado claro
    
    // Fondos
    BG_DARK: '#0a0a2a',      // Fondo principal oscuro
    BG_DEEPER: '#04040f',    // Fondo más profundo (3D)
    BG_PANEL: '#1a1a3a',     // Fondo de paneles
    
    // Bordes y acentos
    BORDER: '#2a2a4a',
    BORDER_LIGHT: '#3a3a5a',
    
    // Texto
    TEXT_LIGHT: '#ffffff',
    TEXT_MUTED: '#aaaaaa',
    TEXT_DARK: '#1a1a3a',
    
    // Artículos
    ARTICULO_BG: '#f5f5f0',
    ARTICULO_CARD_BG: '#ffffff',
    ARTICULO_CARD_BORDER: '#e0e0e0',
    
    // Estados
    SUCCESS: '#2a8a5a',
    WARNING: '#ffaa44',
    ERROR: '#cc4444',
    INFO: '#2a5a8a',
};

/* ────────────────────────────────────────────────────────────────────
   CONFIGURACIÓN DEL VISUALIZADOR 3D
   ═══════════════════════════════════════════════════════════════════ */
export const VISUALIZER_CONFIG = {
    // ESCENA
    FONDO_COLOR: 0x04040f,
    NIEBLA_DENSIDAD: 0.016,
    ALTO_CANVAS: 500,
    
    // ESTRELLAS
    ESTRELLAS_CANTIDAD: 1600,
    ESTRELLAS_TAMANIO: 0.33,
    ESTRELLAS_OPACIDAD: 0.55,
    ESTRELLAS_RANGO: 220,
    
    // NODO CENTRAL
    CENTRO_COLOR: '#d4890a',
    CENTRO_RADIO: 1.00,
    CENTRO_RUGOSIDAD: 0.35,
    CENTRO_METALICO: 0.10,
    CENTRO_TEXTO_COLOR: '#000000',
    CENTRO_TEXTO_SOMBRA: 'rgba(0, 0, 0, 0.0)',
    CENTRO_TEXTO_ESCALA: 1.25,
    CENTRO_TEXTO_OFFSET_Z: 0.02,
    
    // SATÉLITES
    SATELITE_COLOR: '#1a4a8a',
    SATELITE_RUGOSIDAD: 0.40,
    SATELITE_METALICO: 0.05,
    SATELITE_RADIO_MIN: 0.33,
    SATELITE_RADIO_MAX: 0.78,
    SATELITE_TEXTO_COLOR: '#f5d63c',
    SATELITE_TEXTO_SOMBRA: 'rgba(0,0,0,0.95)',
    SATELITE_TEXTO_ESCALA: 1.45,
    SATELITE_TEXTO_OFFSET_Z: 0.02,
    
    // TEXTO
    TEXTO_FUENTE_GRANDE: '32px',
    TEXTO_FUENTE_PEQUENA: '26px',
    TEXTO_FAMILIA: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    TEXTO_MAX_CHARS_LINEA: 14,
    TEXTO_SOMBRA_BLUR: 8,
    TEXTO_NEGRITA: true,
    
    // ÓRBITAS
    ORBITAS_NUMERO: 3,           // 2 o 3 órbitas
    ORBITA_CERCA: 1.9,           // Órbita Alta
    ORBITA_MEDIA: 3.4,           // Órbita Media (solo si ORBITAS_NUMERO = 3)
    ORBITA_LEJOS: 4.8,           // Órbita Baja
    ORBITA_INCLINACION: 0.12,    // Inclinación en radianes
    
    // LÍNEAS DE CONEXIÓN
    LINEA_COLOR: 0x1a3a6a,
    LINEA_OPACIDAD: 0.30,
    
    // CÁMARA
    CAMARA_FOV: 45,
    CAMARA_DISTANCIA_INI: 14,
    CAMARA_DIST_MIN: 5,
    CAMARA_DIST_MAX: 24,
    CAMARA_ROT_Y_INI: 0.45,
    CAMARA_ROT_Y_MIN: -1.35,
    CAMARA_ROT_Y_MAX: 1.35,
    
    // INTERACCIÓN
    MOUSE_SENSIBILIDAD: 0.008,
    SCROLL_SENSIBILIDAD: 0.014,
    AUTO_ROTACION: true,
    AUTO_ROTACION_VEL: 0.0010,
    
    // LUCES
    LUZ_AMBIENTAL_COLOR: 0x253055,
    LUZ_AMBIENTAL_INT: 1.4,
    LUZ_PRINCIPAL_COLOR: 0xffffff,
    LUZ_PRINCIPAL_INT: 0.7,
    LUZ_RELLENO_COLOR: 0x2244aa,
    LUZ_RELLENO_INT: 0.7,
};

/* ────────────────────────────────────────────────────────────────────
   CONFIGURACIÓN DE ARTÍCULOS
   ──────────────────────────────────────────────────────────────────── */
export const ARTICULOS_CONFIG = {
    // Vista previa
    PREVIEW_MAX_LENGTH: 200,
    
    // Panel inferior
    PANEL_MAX_HEIGHT: '70vh',
    PANEL_ANIMATION_DURATION: 350, // ms
    
    // Scroll
    SCROLL_TO_ARTICULOS: true,
};

/* ────────────────────────────────────────────────────────────────────
   FUNCIÓN PARA OBTENER CONFIGURACIÓN COMPLETA
   ──────────────────────────────────────────────────────────────────── */
export function getConfig() {
    return {
        app: { ...APP_CONFIG },
        colors: { ...COLORS },
        visualizer: { ...VISUALIZER_CONFIG },
        articulos: { ...ARTICULOS_CONFIG },
    };
}

/* ────────────────────────────────────────────────────────────────────
   FUNCIÓN PARA ACTUALIZAR CONFIGURACIÓN (útil para modo oscuro, etc.)
   ──────────────────────────────────────────────────────────────────── */
export function updateConfig(section, key, value) {
    const sections = { app: APP_CONFIG, colors: COLORS, visualizer: VISUALIZER_CONFIG, articulos: ARTICULOS_CONFIG };
    if (sections[section] && sections[section][key] !== undefined) {
        sections[section][key] = value;
        return true;
    }
    return false;
}

export default {
    APP_CONFIG,
    COLORS,
    VISUALIZER_CONFIG,
    ARTICULOS_CONFIG,
    getConfig,
    updateConfig,
};