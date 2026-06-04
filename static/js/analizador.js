/* ============================================
   analizador.js - VERSIÓN FINAL CORREGIDA
   ============================================ */

import { initThreeVisualizer, actualizarVisualizador3D } from '/static/js/three-visualizer.js';
import { encontrarConcepto, obtenerSatelitesEnriquecidos } from '/static/js/buscador.js';
import { NODOS_ARTICULOS } from '/static/js/nodos_articulos.js';
import { ARTICULOS_DETALLE } from '/static/js/articulos_detalle.js';

let conceptoActual = null;
let historial = [];
let visualizadorInicializado = false;
let panelArticulos = null;

function addLog(msg) {
    const container = document.getElementById('logsContainer');
    if (container) {
        const div = document.createElement('div');
        div.className = 'log-line';
        div.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
        container.insertBefore(div, container.firstChild);
    }
    console.log(msg);
}

function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function mostrarDetalleArticulo(artId) {
    const art = ARTICULOS_DETALLE[String(artId)];
    if (!art) return;
    
    let panel = document.getElementById('panelDetalleInferior');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'panelDetalleInferior';
        panel.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #0a0a1a;
            border-top: 3px solid #ffcc66;
            z-index: 10001;
            transform: translateY(0);
            max-height: 50vh;
            overflow-y: auto;
            display: block;
        `;
        panel.innerHTML = `
            <div style="padding: 1rem 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #2a2a4a;">
                    <h2 id="detalleTitulo" style="color: #ffcc66; font-size: 1rem; margin: 0;">Detalle del artículo</h2>
                    <button id="btnCerrarDetalleInf" style="background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer;">✕</button>
                </div>
                <div id="detalleJerarquiaInf"></div>
                <div id="detalleContenidoInf"></div>
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.8rem;">
                    <button id="btnCopiarDetalleInf" style="background: #1a1e26; border: 1px solid #2c3140; padding: 0.4rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.75rem; color: #4fc3f7;">📋 Copiar texto</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        
        document.getElementById('btnCerrarDetalleInf').onclick = () => {
            panel.style.display = 'none';
        };
        document.getElementById('btnCopiarDetalleInf').onclick = () => {
            if (window.artActual && window.artIdActual) {
                let texto = `${window.artActual.titulo} - ${window.artActual.titulo_descripcion}\n`;
                texto += `${window.artActual.capitulo} - ${window.artActual.capitulo_descripcion}\n`;
                if (window.artActual.seccion) texto += `${window.artActual.seccion} - ${window.artActual.seccion_descripcion || ''}\n`;
                texto += `\nArtículo ${window.artIdActual}\n\n${window.artActual.texto_completo}`;
                navigator.clipboard.writeText(texto);
                addLog('✓ Artículo copiado');
            }
        };
    }
    
    panel.style.display = 'block';
    
    document.getElementById('detalleTitulo').textContent = `Artículo ${artId}`;
    document.getElementById('detalleJerarquiaInf').innerHTML = `
        <div style="margin-bottom: 0.5rem;">
            <div style="font-size: 0.65rem; text-transform: uppercase; color: #ffcc66;">TÍTULO</div>
            <div style="font-size: 0.9rem; font-weight: 500; color: #fff;">${escapeHtml(art.titulo)}</div>
            <div style="font-size: 0.75rem; color: #888;">${escapeHtml(art.titulo_descripcion)}</div>
        </div>
        <div style="margin-bottom: 0.5rem;">
            <div style="font-size: 0.65rem; text-transform: uppercase; color: #ffcc66;">CAPÍTULO</div>
            <div style="font-size: 0.9rem; font-weight: 500; color: #fff;">${escapeHtml(art.capitulo)}</div>
            <div style="font-size: 0.75rem; color: #888;">${escapeHtml(art.capitulo_descripcion)}</div>
        </div>
        ${art.seccion ? `
        <div style="margin-bottom: 0.5rem;">
            <div style="font-size: 0.65rem; text-transform: uppercase; color: #ffcc66;">SECCIÓN</div>
            <div style="font-size: 0.9rem; font-weight: 500; color: #fff;">${escapeHtml(art.seccion)}</div>
            <div style="font-size: 0.75rem; color: #888;">${escapeHtml(art.seccion_descripcion || '')}</div>
        </div>
        ` : ''}
    `;
    document.getElementById('detalleContenidoInf').innerHTML = `
        <div style="font-size: 0.9rem; font-weight: bold; color: #ffcc66; margin: 0.5rem 0;">Artículo ${artId}</div>
        <div style="font-size: 0.85rem; line-height: 1.6; color: #ccc; background: #0a0c12; padding: 0.8rem; border-radius: 8px; max-height: 200px; overflow-y: auto;">${escapeHtml(art.texto_completo).replace(/\n/g, '<br>')}</div>
    `;
    
    window.artActual = art;
    window.artIdActual = artId;
}

function mostrarArticulos() {
    if (!conceptoActual) return;
    
    const nodoData = NODOS_ARTICULOS.find(n => n.id === conceptoActual.id);
    if (!nodoData || !nodoData.articulos) {
        addLog(`⚠️ No hay artículos para ${conceptoActual.centro_label}`);
        return;
    }
    
    // Crear panel lateral si no existe
    if (!panelArticulos) {
        panelArticulos = document.createElement('div');
        panelArticulos.id = 'panelArticulosLateral';
        panelArticulos.style.cssText = `
            position: fixed;
            top: 80px;
            right: 0;
            bottom: 0;
            width: 380px;
            background: #1a1a3a;
            border-left: 3px solid #ffcc66;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            box-shadow: -4px 0 20px rgba(0,0,0,0.5);
        `;
        panelArticulos.innerHTML = `
            <div style="padding: 1rem; border-bottom: 1px solid #ffcc66; display: flex; justify-content: space-between;">
                <h3 style="color: #ffcc66; margin: 0;"><i class="fas fa-file-alt"></i> <span id="panelNodoNombreLat">Artículos relacionados</span></h3>
                <button id="btnCerrarPanelLat" style="background: none; border: none; color: #ffcc66; font-size: 1.2rem; cursor: pointer;">✕</button>
            </div>
            <div id="scrollArticulosLat" style="flex: 1; overflow-y: auto; padding: 1rem;"></div>
        `;
        document.body.appendChild(panelArticulos);
        document.getElementById('btnCerrarPanelLat').onclick = () => {
            panelArticulos.style.display = 'none';
        };
    }
    
    panelArticulos.style.display = 'flex';
    
    const scrollContainer = document.getElementById('scrollArticulosLat');
    const panelNodoNombre = document.getElementById('panelNodoNombreLat');
    
    panelNodoNombre.textContent = `Artículos relacionados con ${conceptoActual.centro_label}`;
    scrollContainer.innerHTML = '';
    
    nodoData.articulos.forEach(artId => {
        const art = ARTICULOS_DETALLE[String(artId)];
        if (!art) return;
        
        const preview = art.texto_completo.substring(0, 100) + '...';
        const item = document.createElement('div');
        item.style.cssText = `
            background: #0a0a1a;
            border: 1px solid #2a2a4a;
            border-radius: 8px;
            padding: 0.8rem;
            margin-bottom: 0.8rem;
            cursor: pointer;
            transition: all 0.2s;
        `;
        item.innerHTML = `
            <div style="color: #ffcc66; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.3rem;">📜 Artículo ${artId}</div>
            <div style="color: #aaa; font-size: 0.7rem; line-height: 1.4;">${escapeHtml(preview)}</div>
        `;
        item.ondblclick = () => mostrarDetalleArticulo(artId);
        scrollContainer.appendChild(item);
    });
    
    addLog(`📄 Mostrados ${nodoData.articulos.length} artículos`);
}

function actualizarUI() {
    if (!conceptoActual) return;
    
    document.getElementById('conceptoPrincipalValue').textContent = conceptoActual.centro_label;
    document.getElementById('conceptoPrincipalSection').classList.remove('hidden');
    
    const satelites = obtenerSatelitesEnriquecidos(conceptoActual, GRAFOS_DATA);
    const relContainer = document.getElementById('relacionesContainer');
    document.getElementById('relacionesSection').classList.remove('hidden');
    document.getElementById('relacionesCount').textContent = satelites.length;
    
    if (satelites.length > 0) {
        relContainer.innerHTML = satelites.map(rel => `
            <div class="relacion-btn" data-concepto="${rel.label_corto}" style="cursor: pointer;">${rel.label_corto} (${rel.peso})</div>
        `).join('');
        
        document.querySelectorAll('.relacion-btn').forEach(btn => {
            btn.onclick = () => {
                const nodo = encontrarConcepto(btn.dataset.concepto, GRAFOS_DATA);
                if (nodo) {
                    conceptoActual = nodo;
                    actualizarUI();
                }
            };
        });
    }
    
    if (!visualizadorInicializado) {
        visualizadorInicializado = initThreeVisualizer('visualizacion3d', 'canvas3d');
    }
    
    if (visualizadorInicializado) {
        setTimeout(() => {
            actualizarVisualizador3D(
                conceptoActual.texto_esfera || conceptoActual.centro_label,
                satelites.map(s => ({ label_corto: s.label_corto, concepto: s.centro_label, capa: s.capa, peso: s.peso })),
                (conceptoNombre) => {
                    const nodo = encontrarConcepto(conceptoNombre, GRAFOS_DATA);
                    if (nodo) {
                        conceptoActual = nodo;
                        actualizarUI();
                    }
                }
            );
        }, 100);
    }
    
    const btnAtras = document.getElementById('btnAtras');
    if (btnAtras) btnAtras.style.display = historial.length > 0 ? 'inline-flex' : 'none';
}

function navegarA(nuevoNodo, guardar = true) {
    if (!nuevoNodo) return;
    if (guardar && conceptoActual) historial.push(conceptoActual);
    conceptoActual = nuevoNodo;
    actualizarUI();
    if (panelArticulos) panelArticulos.style.display = 'none';
}

function irAtras() {
    if (historial.length > 0) {
        const anterior = historial.pop();
        navegarA(anterior, false);
    }
}

function reiniciar() {
    historial = [];
    const demanda = GRAFOS_DATA.find(n => n.id === 1);
    if (demanda) navegarA(demanda, false);
}

function buscar() {
    const consulta = document.getElementById('inputConcepto').value.trim();
    if (!consulta) return;
    const nodo = encontrarConcepto(consulta, GRAFOS_DATA);
    if (nodo) navegarA(nodo, true);
}

function init() {
    document.getElementById('btnBuscar').onclick = buscar;
    document.getElementById('inputConcepto').onkeypress = (e) => { if (e.key === 'Enter') buscar(); };
    document.getElementById('btnAtras').onclick = irAtras;
    document.getElementById('btnReset').onclick = reiniciar;
    document.getElementById('btnMostrarArticulos').onclick = mostrarArticulos;
    
    const demanda = GRAFOS_DATA.find(n => n.id === 1);
    if (demanda) navegarA(demanda, false);
    
    addLog('✅ Aplicación lista. El panel de artículos aparecerá a la DERECHA.');
}

init();