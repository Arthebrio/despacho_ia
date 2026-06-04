/* ═══════════════════════════════════════════════════════════════════
   MAIN.JS - Punto de entrada principal de LEXIA_MX
   ═══════════════════════════════════════════════════════════════════ */

// Módulos de visualización 3D
import { initThreeVisualizer, actualizarVisualizador3D } from './modules/three-visualizer.js';

// Módulos de búsqueda y datos
import { encontrarConcepto, obtenerSatelitesEnriquecidos } from './modules/buscador.js';
import { NODOS_ARTICULOS } from './data/nodos_articulos.js';

// Cargar ARTICULOS_DETALLE al window
import ARTICULOS_DETALLE from './data/articulos_detalle.js';
window.ARTICULOS_DETALLE = ARTICULOS_DETALLE;

// Utilidades
import { addLog, scrollSuave } from './core/utils.js';

// Módulo de UI de artículos
import { 
    initArticulosUI, 
    mostrarListaArticulos, 
    ocultarListaArticulos,
    limpiarPanelesArticulos 
} from './modules/articulosUI.js';

/* ═══════════════════════════════════════════════════════════════════
   VARIABLES GLOBALES DE ESTADO
   ═══════════════════════════════════════════════════════════════════ */
let conceptoActual = null;
let visualizadorListo = false;
let ultimaBusqueda = '';
let GRAFOS_DATA = null;
let historial = []; // Añadido soporte preventivo para el array de historial

/* ═══════════════════════════════════════════════════════════════════
   FUNCIONES AUXILIARES
   ═══════════════════════════════════════════════════════════════════ */

function obtenerSatelitesEnriquecidosLocal(nodo) {
    if (!nodo || !GRAFOS_DATA) return [];
    return obtenerSatelitesEnriquecidos(nodo, GRAFOS_DATA);
}

function encontrarConceptoLocal(consulta) {
    if (!GRAFOS_DATA || GRAFOS_DATA.length === 0) return null;
    return encontrarConcepto(consulta, GRAFOS_DATA);
}

/* ═══════════════════════════════════════════════════════════════════
   NAVEGACIÓN Y UI
   ═══════════════════════════════════════════════════════════════════ */

function actualizarUI() {
    if (!conceptoActual) return;
    
    addLog(`🎯 Actualizando interfaz gráfica para: ${conceptoActual.centro_label}`);
    
    const satelitesData = obtenerSatelitesEnriquecidosLocal(conceptoActual);
    addLog(` 📡 ${satelitesData.length} satélites encontrados`);
    
    if (!visualizadorListo) {
        visualizadorListo = initThreeVisualizer('visualizacion3d', 'canvas3d');
        addLog(`🖥️ Visualizador 3D inicializado: ${visualizadorListo}`);
    }
    
    if (visualizadorListo) {
        setTimeout(() => {
            actualizarVisualizador3D(
                conceptoActual.texto_esfera || conceptoActual.centro_label,
                satelitesData.map(s => ({ 
                    label_corto: s.label_corto, 
                    concepto: s.centro_label, 
                    capa: s.capa, 
                    peso: s.peso 
                })),
                (nombreConcepto) => {
                    addLog(`鼠标 Click en satélite del mapa: ${nombreConcepto}`);
                    const nodo = encontrarConceptoLocal(nombreConcepto);
                    if (nodo) navegarA(nodo);
                }
            );
        }, 50);
    }
}

function navegarA(nuevoNodo, guardar = true) {
    if (!nuevoNodo) return;
    
    // 🌟 LA LÍNEA MÁGICA: Oculta los artículos viejos inmediatamente al brincar a otro tema
    ocultarListaArticulos(); 

    if (guardar && conceptoActual) historial.push(conceptoActual);
    conceptoActual = nuevoNodo;
    
    // 🚀 CORRECCIÓN CRÍTICA: Volvemos a disparar actualizarUI() que es la encargada de dibujar los nodos 3D
    actualizarUI();
    
    addLog(`📍 Navegado con éxito a: ${conceptoActual.centro_label}`);
}

function buscar() {
    const consulta = document.getElementById('inputConcepto').value.trim();
    if (!consulta) return;
    
    ultimaBusqueda = consulta;
    addLog(`🔎 Búsqueda: "${consulta}"`);
    
    const nodo = encontrarConceptoLocal(consulta);
    
    if (nodo) {
        addLog(`✅ Encontrado: ${nodo.centro_label}`);
        navegarA(nodo);
    } else {
        addLog(`❌ No se encontró el concepto: "${consulta}"`, 'warn');
        alert(`No se encontró el concepto "${consulta}". Intenta con: demanda, amparo, suspensión, etc.`);
    }
}

function mostrarArticulos() {
    if (!conceptoActual) {
        addLog('⚠️ Primero selecciona un concepto en el mapa o mediante búsqueda.');
        alert('Primero busca un concepto para ver sus artículos relacionados');
        return;
    }
    
    addLog(`📋 Mostrando artículos para: ${conceptoActual.centro_label}`);
    mostrarListaArticulos(conceptoActual, ultimaBusqueda, NODOS_ARTICULOS);
}

/* ═══════════════════════════════════════════════════════════════════
   INICIALIZACIÓN
   ═══════════════════════════════════════════════════════════════════ */

async function iniciarAplicacion() {
    addLog('🚀 Iniciando LEXIA_MX...');
    
    // Cargar GRAFOS_DATA desde window
    GRAFOS_DATA = window.GRAFOS_DATA;
    
    if (!GRAFOS_DATA || !GRAFOS_DATA.length) {
        addLog('⏳ Esperando GRAFOS_DATA...');
        setTimeout(iniciarAplicacion, 100);
        return;
    }
    
    addLog(`✅ Datos cargados: ${GRAFOS_DATA.length} nodos`);
    addLog(`✅ Artículos disponibles: ${Object.keys(window.ARTICULOS_DETALLE || {}).length}`);
    
    // Inicializar UI de artículos
    const uiInicializada = initArticulosUI();
    if (!uiInicializada) {
        addLog('⚠️ No se pudo inicializar la UI de artículos', 'warn');
    }
    
    // Configurar eventos DOM
    const btnBuscar = document.getElementById('btnBuscar');
    const inputConcepto = document.getElementById('inputConcepto');
    const btnMostrarArticulos = document.getElementById('btnMostrarArticulos');
    
    if (btnBuscar) btnBuscar.onclick = buscar;
    if (inputConcepto) inputConcepto.onkeypress = (e) => { if (e.key === 'Enter') buscar(); };
    if (btnMostrarArticulos) btnMostrarArticulos.onclick = mostrarArticulos;
    
    // Nodo inicial
    const nodoInicial = GRAFOS_DATA.find(n => n.id === 1);
    if (nodoInicial) {
        navegarA(nodoInicial);
    } else if (GRAFOS_DATA.length > 0) {
        navegarA(GRAFOS_DATA[0]);
    }
    
    addLog('✅ LEXIA_MX lista!');
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarAplicacion);
} else {
    iniciarAplicacion();
}