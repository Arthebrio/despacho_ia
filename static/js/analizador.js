/* ============================================ */
/* ANALIZADOR SEMÁNTICO - VERSIÓN FINAL         */
/* ============================================ */

import { initThreeVisualizer, actualizarVisualizador3D } from '/static/js/three-visualizer.js';

const API_BASE = '/analizador/api';

const nombresLeyes = {
    "CCF": "Código Civil Federal",
    "CPCF": "Código Procesal Civil Federal",
    "CNPCF": "Código Nacional de Procedimientos Civiles Federales",
    "CPF": "Código Penal Federal",
    "CNPP": "Código Nacional de Procedimientos Penales",
    "LFT": "Ley Federal del Trabajo",
    "LFCA": "Ley Federal de Competencia Económica",
    "LGS": "Ley General de Salud",
    "LGAM": "Ley General de Acceso de las Mujeres",
    "LGDS": "Ley General de Desarrollo Social"
};

function obtenerNombreLey(abreviatura) {
    return nombresLeyes[abreviatura] || abreviatura || "Ley no especificada";
}

function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function normalizarTexto(texto) {
    if (!texto) return '';
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '');
}

let todosLosArticulos = [];
let mapaConceptual = {};
let conceptoActual = '';
let relacionesActuales = [];
let articulosActuales = [];
let visorArticulos = [];
let articuloSeleccionado = null;
let tooltipTimeout = null;
let tooltipElement = null;
let detalleElemento = null;
let visualizador3DActivo = false;
let datosCargados = false;

const dom = {};

function encontrarConceptoCercano(busqueda) {
    const busquedaNorm = normalizarTexto(busqueda);
    if (!busquedaNorm) return null;
    
    let mejorMatch = null;
    let mejorPuntaje = 0;
    
    for (const concepto of Object.keys(mapaConceptual)) {
        const conceptoNorm = normalizarTexto(concepto);
        
        if (conceptoNorm === busquedaNorm) return concepto;
        
        if (conceptoNorm.includes(busquedaNorm) || busquedaNorm.includes(conceptoNorm)) {
            const puntaje = Math.min(conceptoNorm.length, busquedaNorm.length);
            if (puntaje > mejorPuntaje) {
                mejorPuntaje = puntaje;
                mejorMatch = concepto;
            }
        }
    }
    return mejorMatch;
}

function obtenerRelaciones(concepto) {
    const relaciones = mapaConceptual[concepto] || [];
    return [...relaciones].sort((a, b) => b.frecuencia - a.frecuencia).slice(0, 10);
}

function obtenerArticulosPorConcepto(concepto) {
    const conceptoNorm = normalizarTexto(concepto);
    
    const conceptosRelacionados = relacionesActuales.map(r => normalizarTexto(r.concepto));
    const conceptosBusqueda = [conceptoNorm, ...conceptosRelacionados];
    
    const resultados = todosLosArticulos.filter(articulo => {
        const atomos = articulo.atomos_semanticos || [];
        const atomosNorm = atomos.map(a => normalizarTexto(a));
        
        let coincidencias = 0;
        for (const cb of conceptosBusqueda) {
            if (atomosNorm.includes(cb)) {
                coincidencias++;
            }
        }
        return coincidencias >= 2;
    });
    
    if (resultados.length === 0) {
        console.log('⚠️ Sin resultados con 2 coincidencias, mostrando los que tienen al menos 1');
        return todosLosArticulos.filter(articulo => {
            const atomos = articulo.atomos_semanticos || [];
            const atomosNorm = atomos.map(a => normalizarTexto(a));
            return atomosNorm.includes(conceptoNorm);
        });
    }
    return resultados;
}

function navegarAConcepto(nuevoConcepto) {
    if (!nuevoConcepto) {
        console.warn('navegarAConcepto: concepto vacío');
        return;
    }
    
    if (!datosCargados) {
        console.warn('Datos aún no cargados, esperando...');
        setTimeout(() => navegarAConcepto(nuevoConcepto), 500);
        return;
    }
    
    console.log(`🔍 Navegando a: "${nuevoConcepto}"`);
    
    conceptoActual = nuevoConcepto;
    relacionesActuales = obtenerRelaciones(conceptoActual);
    
    cerrarDetalleIntegrado();
    ocultarVisor();
    
    if (!visualizador3DActivo) {
        console.log('Inicializando visualizador 3D por primera vez...');
        const success = initThreeVisualizer('visualizacion3d', 'canvas3d');
        if (success) {
            visualizador3DActivo = true;
            console.log('✅ Visualizador 3D iniciado');
        } else {
            console.error('❌ Falló la inicialización del visualizador 3D');
            return;
        }
    }
    
    const vizSection = document.getElementById('visualizacion3d');
    if (vizSection) {
        vizSection.classList.remove('hidden');
        vizSection.style.display = 'block';
    }
    
    setTimeout(() => {
        if (conceptoActual && relacionesActuales && relacionesActuales.length > 0) {
            console.log(`🎨 Actualizando visualizador con: "${conceptoActual}" (${relacionesActuales.length} relaciones)`);
            try {
                actualizarVisualizador3D(
                    conceptoActual, 
                    relacionesActuales,
                    (concepto) => navegarAConcepto(concepto),
                    () => mostrarVisor()
                );
            } catch (error) {
                console.error('Error al actualizar visualizador:', error);
            }
        }
    }, 150);
}

function mostrarTooltipArticulo(event, card) {
    const textoPreview = card.dataset.texto || 'Vista previa no disponible';
    
    tooltipTimeout = setTimeout(() => {
        if (!tooltipElement) {
            tooltipElement = document.createElement('div');
            tooltipElement.className = 'articulo-tooltip';
            document.body.appendChild(tooltipElement);
        }
        
        tooltipElement.innerHTML = `
            <div class="tooltip-titulo">📖 VISTA PREVIA</div>
            <div>${escapeHtml(textoPreview.substring(0, 300))}...</div>
        `;
        
        tooltipElement.style.left = (event.clientX + 15) + 'px';
        tooltipElement.style.top = (event.clientY + 15) + 'px';
        tooltipElement.classList.add('visible');
    }, 400);
}

function moverTooltip(event) {
    if (tooltipElement && tooltipElement.classList.contains('visible')) {
        tooltipElement.style.left = (event.clientX + 15) + 'px';
        tooltipElement.style.top = (event.clientY + 15) + 'px';
    }
}

function ocultarTooltip() {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    if (tooltipElement) tooltipElement.classList.remove('visible');
}

async function mostrarVisor() {
    if (!conceptoActual) {
        alert('Primero explora un concepto en el mapa 3D');
        return;
    }
    
    articulosActuales = obtenerArticulosPorConcepto(conceptoActual);
    
    if (articulosActuales.length === 0) {
        alert(`No hay artículos relacionados con "${conceptoActual}"`);
        return;
    }
    
    visorArticulos = articulosActuales;
    dom.visorSection.classList.remove('hidden');
    dom.visorInfo.textContent = `${visorArticulos.length} artículos encontrados`;
    renderizarVisorVertical();
}

function renderizarVisorVertical() {
    let html = '';
    
    // Obtener los conceptos de búsqueda para resaltar
    const conceptoNorm = normalizarTexto(conceptoActual);
    const conceptosRelacionados = relacionesActuales.map(r => normalizarTexto(r.concepto));
    const conceptosBusqueda = [conceptoNorm, ...conceptosRelacionados];
    
    for (let i = 0; i < visorArticulos.length; i++) {
        const art = visorArticulos[i];
        const nombreLey = obtenerNombreLey(art.nombre_ley);
        
        // Texto del artículo con palabras resaltadas
        let textoPreview = art.texto_integro ? art.texto_integro.substring(0, 350) + '...' : 'Texto no disponible';
        
        // Resaltar palabras que coinciden con los conceptos de búsqueda
        for (const concepto of conceptosBusqueda) {
            const regex = new RegExp(`(${concepto})`, 'gi');
            textoPreview = textoPreview.replace(regex, `<mark style="background: #ffcc66; color: #1a2a4a; padding: 0 2px; border-radius: 4px;">$1</mark>`);
        }
        
        html += `
            <div class="articulo-card" data-id="${art.id}" data-texto="${escapeHtml(art.texto_integro || '')}">
                <div class="articulo-card-ley">📚 ${escapeHtml(nombreLey)} · Artículo ${art.numero || '?'}</div>
                <div class="articulo-card-texto" style="font-size: 0.8rem; color: #334155; margin-top: 8px; line-height: 1.4;">${textoPreview}</div>
            </div>
        `;
    }
    
    dom.visorContainer.innerHTML = html;
    
    document.querySelectorAll('.articulo-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            const articulo = visorArticulos.find(a => a.id === id);
            if (articulo) mostrarDetalleIntegrado(articulo);
        });
        
        card.addEventListener('mouseenter', (e) => mostrarTooltipArticulo(e, card));
        card.addEventListener('mouseleave', ocultarTooltip);
        card.addEventListener('mousemove', (e) => moverTooltip(e));
    });
}

function ocultarVisor() {
    dom.visorSection.classList.add('hidden');
    visorArticulos = [];
    cerrarDetalleIntegrado();
    ocultarTooltip();
}

function mostrarDetalleIntegrado(articulo) {
    articuloSeleccionado = articulo;
    cerrarDetalleIntegrado();
    
    const nombreLey = obtenerNombreLey(articulo.nombre_ley);
    
    const conceptoNorm = normalizarTexto(conceptoActual);
    const conceptosRelacionados = relacionesActuales.map(r => normalizarTexto(r.concepto));
    const conceptosBusqueda = [conceptoNorm, ...conceptosRelacionados];
    
    let textoIntegro = articulo.texto_integro || 'Texto no disponible';
    for (const concepto of conceptosBusqueda) {
        const regex = new RegExp(`(${concepto})`, 'gi');
        textoIntegro = textoIntegro.replace(regex, `<mark style="background: #fff3b0; color: #1a2a4a; padding: 0 2px; border-radius: 4px;">$1</mark>`);
    }
    
    const detalleHtml = `
        <div id="detalleIntegrado" class="detalle-integrado">
            <div class="detalle-integrado-header">
                <h4>📜 ${escapeHtml(nombreLey)} · Artículo ${articulo.numero || '?'}</h4>
                <button id="detalleIntegradoCerrar" class="detalle-integrado-cerrar">✖️ Cerrar</button>
            </div>
            <div class="detalle-integrado-contenido">
                <p>${textoIntegro}</p>
            </div>
            <div class="detalle-integrado-footer">
                <button id="detalleIntegradoPDF" class="detalle-integrado-pdf">📄 Guardar PDF</button>
            </div>
        </div>
    `;
    
    dom.visorSection.insertAdjacentHTML('afterend', detalleHtml);
    detalleElemento = document.getElementById('detalleIntegrado');
    
    document.getElementById('detalleIntegradoCerrar').addEventListener('click', cerrarDetalleIntegrado);
    document.getElementById('detalleIntegradoPDF').addEventListener('click', () => guardarPDF(articulo));
    
    detalleElemento.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


function cerrarDetalleIntegrado() {
    if (detalleElemento) {
        detalleElemento.remove();
        detalleElemento = null;
    }
    articuloSeleccionado = null;
}

function guardarPDF(articulo) {
    if (!articulo) {
        alert('No hay ningún artículo seleccionado');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const nombreLey = obtenerNombreLey(articulo.nombre_ley);
    const titulo = `${nombreLey} · Artículo ${articulo.numero || '?'}`;
    doc.setFontSize(16);
    doc.text(titulo, 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    
    const textoCompleto = articulo.texto_integro || 'Texto no disponible';
    const lineas = doc.splitTextToSize(textoCompleto, 170);
    
    for (let i = 0; i < lineas.length; i++) {
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
        doc.text(lineas[i], 20, y);
        y += 7;
    }
    
    doc.save(`articulo_${articulo.id}_${articulo.nombre_ley || 'ley'}.pdf`);
}

async function cargarDatos() {
    try {
        console.log('🔄 Cargando datos desde el backend...');
        
        const resArticulos = await fetch(`${API_BASE}/exportar/articulos`);
        if (!resArticulos.ok) throw new Error(`HTTP ${resArticulos.status}`);
        const dataArticulos = await resArticulos.json();
        todosLosArticulos = dataArticulos.articulos || [];
        console.log(`✅ Artículos: ${todosLosArticulos.length}`);
        
        const resMapa = await fetch(`${API_BASE}/exportar/coocurrencias`);
        if (!resMapa.ok) throw new Error(`HTTP ${resMapa.status}`);
        mapaConceptual = await resMapa.json();
        console.log(`✅ Conceptos: ${Object.keys(mapaConceptual).length}`);
        
        datosCargados = true;
        console.log('✅ Todos los datos cargados correctamente');
        
        if (dom.btnBuscar) {
            dom.btnBuscar.disabled = false;
            dom.btnBuscar.textContent = 'Explorar';
        }
        
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        alert('Error al cargar los datos. Verifica que el servidor esté corriendo.');
        if (dom.btnBuscar) {
            dom.btnBuscar.disabled = false;
            dom.btnBuscar.textContent = 'Error - Recargar';
        }
    }
}

function capturarElementosDOM() {
    dom.inputConcepto = document.getElementById('inputConcepto');
    dom.btnBuscar = document.getElementById('btnBuscar');
    dom.visorSection = document.getElementById('visorSection');
    dom.visorContainer = document.getElementById('visorContainer');
    dom.visorInfo = document.getElementById('visorInfo');
    dom.btnCerrarVisor = document.getElementById('btnCerrarVisor');
    
    if (dom.btnBuscar) {
        dom.btnBuscar.disabled = true;
        dom.btnBuscar.textContent = 'Cargando...';
    }
}

function configurarEventos() {
    dom.btnBuscar.addEventListener('click', () => {
        if (!datosCargados) {
            alert('Los datos aún se están cargando. Espera un momento.');
            return;
        }
        
        let concepto = dom.inputConcepto.value.trim().toLowerCase();
        if (!concepto) {
            alert('Escribe un concepto para buscar');
            return;
        }
        
        let conceptoEncontrado = encontrarConceptoCercano(concepto);
        
        if (!conceptoEncontrado) {
            alert(`No se encontró "${concepto}". Sugerencias: tutela, alimentos, garantías, patria potestad, amparo`);
            return;
        }
        
        if (conceptoEncontrado !== concepto) {
            console.log(`🔍 Corregido: "${concepto}" → "${conceptoEncontrado}"`);
        }
        
        navegarAConcepto(conceptoEncontrado);
    });
    
    dom.inputConcepto.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && datosCargados) {
            dom.btnBuscar.click();
        }
    });
    
    if (dom.btnCerrarVisor) {
        dom.btnCerrarVisor.addEventListener('click', ocultarVisor);
    }
}

function agregarBotonMostrar() {
    const vizSection = document.getElementById('visualizacion3d');
    if (!vizSection) return;
    
    if (document.getElementById('btnMostrarArticulosContainer')) return;
    
    const container = document.createElement('div');
    container.id = 'btnMostrarArticulosContainer';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.marginTop = '20px';
    container.style.marginBottom = '20px';
    
    const btn = document.createElement('button');
    btn.className = 'buscador-btn';
    btn.innerHTML = '<i class="fas fa-file-alt"></i> Mostrar artículos relacionados';
    btn.addEventListener('click', mostrarVisor);
    
    container.appendChild(btn);
    vizSection.insertAdjacentElement('afterend', container);
}

async function init() {
    console.log('🚀 Iniciando Explorador Semántico...');
    capturarElementosDOM();
    configurarEventos();
    await cargarDatos();
    agregarBotonMostrar();
    console.log('✅ Listo para usar - Busca un concepto');
}

document.addEventListener('DOMContentLoaded', init);