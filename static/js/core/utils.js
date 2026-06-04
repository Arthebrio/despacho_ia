/* ═══════════════════════════════════════════════════════════════════
   UTILS.JS - Funciones utilitarias reutilizables
   Funciones puras, sin estado, para toda la aplicación
   ═══════════════════════════════════════════════════════════════════ */

import { APP_CONFIG, COLORS } from './config.js';

/* ────────────────────────────────────────────────────────────────────
   SEGURIDAD Y SANITIZACIÓN
   ──────────────────────────────────────────────────────────────────── */

/**
 * Escapa caracteres HTML para prevenir inyección XSS
 * @param {string} texto - Texto a escapar
 * @returns {string} - Texto escapado
 */
export function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Sanitiza un string eliminando caracteres potencialmente peligrosos
 * @param {string} texto - Texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
export function sanitizarTexto(texto) {
    if (!texto) return '';
    return texto.replace(/[<>]/g, '');
}

/* ────────────────────────────────────────────────────────────────────
   BÚSQUEDA Y RESALTADO
   ──────────────────────────────────────────────────────────────────── */

/**
 * Resalta palabras de búsqueda dentro de un texto
 * @param {string} texto - Texto original
 * @param {string} busqueda - Término(s) de búsqueda
 * @returns {string} - Texto con marcado <mark>
 */
export function resaltarTexto(texto, busqueda) {
    if (!busqueda || busqueda.length < APP_CONFIG.BUSQUEDA_MIN_LENGTH || !texto) return texto;
    
    const palabras = busqueda.toLowerCase().split(/\s+/);
    let resultado = texto;
    
    palabras.forEach(palabra => {
        if (palabra.length >= APP_CONFIG.BUSQUEDA_PALABRA_MIN_LENGTH) {
            const regex = new RegExp(`(${palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            resultado = resultado.replace(regex, `<mark class="resaltado">$1</mark>`);
        }
    });
    
    return resultado;
}

/**
 * Normaliza texto: minúsculas, sin acentos, solo caracteres alfanuméricos
 * @param {string} texto - Texto a normalizar
 * @returns {string} - Texto normalizado
 */
export function normalizarTexto(texto) {
    if (!texto) return '';
    return texto.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '');
}

/**
 * Calcula el porcentaje de coincidencia entre dos strings
 * @param {string} str1 - Primer string
 * @param {string} str2 - Segundo string
 * @returns {number} - Porcentaje de coincidencia (0-100)
 */
export function porcentajeCoincidencia(str1, str2) {
    const norm1 = normalizarTexto(str1);
    const norm2 = normalizarTexto(str2);
    if (norm1 === norm2) return 100;
    if (!norm1 || !norm2) return 0;
    
    const maxLen = Math.max(norm1.length, norm2.length);
    let coincidencias = 0;
    
    for (let i = 0; i < Math.min(norm1.length, norm2.length); i++) {
        if (norm1[i] === norm2[i]) coincidencias++;
    }
    
    return Math.floor((coincidencias / maxLen) * 100);
}

/* ────────────────────────────────────────────────────────────────────
   LOGGING Y DEBUG
   ──────────────────────────────────────────────────────────────────── */

let logContainer = null;

/**
 * Obtiene o crea el contenedor de logs
 * @returns {HTMLElement} - Contenedor de logs
 */
function getLogContainer() {
    if (!logContainer) {
        logContainer = document.getElementById('logsContainer');
        if (!logContainer && APP_CONFIG.SHOW_LOGS) {
            logContainer = document.createElement('div');
            logContainer.id = 'logsContainer';
            logContainer.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 300px;
                max-height: 200px;
                overflow-y: auto;
                background: rgba(0,0,0,0.8);
                color: #0f0;
                font-size: 10px;
                font-family: monospace;
                z-index: 10002;
                padding: 5px;
                border-radius: 5px;
                display: none;
            `;
            document.body.appendChild(logContainer);
        }
    }
    return logContainer;
}

/**
 * Agrega un mensaje de log a la consola y al panel visual (si existe)
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} nivel - 'debug', 'info', 'warn', 'error'
 */
export function addLog(mensaje, nivel = 'info') {
    // Mostrar en consola
    const prefix = `[LEXIA_MX]`;
    switch (nivel) {
        case 'debug':
            if (APP_CONFIG.LOG_LEVEL === 'debug') console.debug(prefix, mensaje);
            break;
        case 'warn':
            console.warn(prefix, mensaje);
            break;
        case 'error':
            console.error(prefix, mensaje);
            break;
        default:
            console.log(prefix, mensaje);
    }
    
    // Mostrar en panel visual si está activo
    if (APP_CONFIG.SHOW_LOGS) {
        const container = getLogContainer();
        if (container) {
            const div = document.createElement('div');
            const time = new Date().toLocaleTimeString();
            const color = nivel === 'error' ? '#f44' : (nivel === 'warn' ? '#fa4' : '#0f0');
            div.style.color = color;
            div.innerHTML = `[${time}] ${escapeHtml(mensaje)}`;
            container.insertBefore(div, container.firstChild);
            
            // Limitar número de logs
            while (container.children.length > 50) {
                container.removeChild(container.lastChild);
            }
        }
    }
}

/**
 * Muestra/oculta el panel de logs visual
 * @param {boolean} mostrar - True para mostrar, false para ocultar
 */
export function mostrarLogsVisuales(mostrar) {
    const container = getLogContainer();
    if (container) {
        container.style.display = mostrar ? 'block' : 'none';
    }
}

/* ────────────────────────────────────────────────────────────────────
   FORMATEO Y MANIPULACIÓN DE TEXTO
   ──────────────────────────────────────────────────────────────────── */

/**
 * Trunca un texto a una longitud máxima
 * @param {string} texto - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} - Texto truncado con "..." si es necesario
 */
export function truncarTexto(texto, maxLength = 200) {
    if (!texto || texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} texto - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 */
export function capitalizarTexto(texto) {
    if (!texto) return '';
    return texto.split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Elimina espacios extra y normaliza espacios
 * @param {string} texto - Texto a normalizar
 * @returns {string} - Texto con espacios normalizados
 */
export function normalizarEspacios(texto) {
    if (!texto) return '';
    return texto.trim().replace(/\s+/g, ' ');
}

/* ────────────────────────────────────────────────────────────────────
   MANIPULACIÓN DEL DOM
   ──────────────────────────────────────────────────────────────────── */

/**
 * Espera a que un elemento exista en el DOM
 * @param {string} selector - Selector CSS del elemento
 * @param {number} timeout - Tiempo máximo de espera en ms
 * @returns {Promise<HTMLElement>} - Promesa que resuelve con el elemento
 */
export function esperarElemento(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const elemento = document.querySelector(selector);
        if (elemento) {
            resolve(elemento);
            return;
        }
        
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        if (timeout > 0) {
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Elemento "${selector}" no encontrado después de ${timeout}ms`));
            }, timeout);
        }
    });
}

/**
 * Desplazamiento suave a un elemento
 * @param {HTMLElement} elemento - Elemento destino
 * @param {string} block - Posición de alineación ('start', 'center', 'end', 'nearest')
 */
export function scrollSuave(elemento, block = 'start') {
    if (elemento && APP_CONFIG.SCROLL_SUAVE) {
        elemento.scrollIntoView({ behavior: 'smooth', block });
    } else if (elemento) {
        elemento.scrollIntoView();
    }
}

/* ────────────────────────────────────────────────────────────────────
   DEBOUNCE Y THROTTLE
   ──────────────────────────────────────────────────────────────────── */

/**
 * Función debounce: retrasa la ejecución hasta que no haya más llamadas
 * @param {Function} fn - Función a ejecutar
 * @param {number} delay - Retraso en ms
 * @returns {Function} - Función con debounce
 */
export function debounce(fn, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * Función throttle: limita la ejecución a una vez cada cierto tiempo
 * @param {Function} fn - Función a ejecutar
 * @param {number} limit - Límite en ms
 * @returns {Function} - Función con throttle
 */
export function throttle(fn, limit = 100) {
    let waiting = false;
    return function(...args) {
        if (!waiting) {
            fn.apply(this, args);
            waiting = true;
            setTimeout(() => { waiting = false; }, limit);
        }
    };
}

/* ────────────────────────────────────────────────────────────────────
   DETECCIÓN DE DISPOSITIVO
   ──────────────────────────────────────────────────────────────────── */

/**
 * Detecta si el dispositivo es móvil
 * @returns {boolean} - True si es móvil
 */
export function esDispositivoMovil() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Detecta si el dispositivo tiene pantalla táctil
 * @returns {boolean} - True si es táctil
 */
export function esPantallaTactil() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/* ────────────────────────────────────────────────────────────────────
   MANEJO DE ERRORES
   ──────────────────────────────────────────────────────────────────── */

/**
 * Muestra un mensaje de error al usuario
 * @param {string} mensaje - Mensaje de error
 * @param {string} tipo - 'error', 'warning', 'info', 'success'
 */
export function mostrarMensajeUsuario(mensaje, tipo = 'error') {
    // Crear toast notification
    const toast = document.createElement('div');
    const colores = {
        error: '#cc4444',
        warning: '#ffaa44',
        info: '#2a5a8a',
        success: '#2a8a5a'
    };
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colores[tipo] || colores.error};
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10003;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 90%;
        text-align: center;
        animation: fadeInOut 3s ease forwards;
    `;
    
    // Agregar estilos de animación si no existen
    if (!document.querySelector('#toast-animation-style')) {
        const style = document.createElement('style');
        style.id = 'toast-animation-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
    
    // También registrar en log
    addLog(mensaje, tipo === 'error' ? 'error' : (tipo === 'warning' ? 'warn' : 'info'));
}

/* ────────────────────────────────────────────────────────────────────
   EXPORTACIONES POR DEFECTO
   ──────────────────────────────────────────────────────────────────── */
export default {
    escapeHtml,
    sanitizarTexto,
    resaltarTexto,
    normalizarTexto,
    porcentajeCoincidencia,
    addLog,
    mostrarLogsVisuales,
    truncarTexto,
    capitalizarTexto,
    normalizarEspacios,
    esperarElemento,
    scrollSuave,
    debounce,
    throttle,
    esDispositivoMovil,
    esPantallaTactil,
    mostrarMensajeUsuario,
};