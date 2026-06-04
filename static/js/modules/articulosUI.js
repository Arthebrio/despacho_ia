/**
 * ARTICULOSUI.JS - UI de lista de artículos relacionados
 * Versión Final con Resaltado Dinámico de Palabras Clave
 */

import { escapeHtml, resaltarTexto, addLog, scrollSuave } from '../core/utils.js';

let panelLista = null;
let articulosContainer = null;

export function initArticulosUI() {
    addLog('🔧 Inicializando UI de artículos...');
    
    panelLista = document.getElementById('visualizadorArticulos');
    articulosContainer = document.getElementById('articulosContainer');
    
    if (!panelLista) {
        addLog('❌ No se encontró #visualizadorArticulos', 'error');
        return false;
    }
    
    if (!articulosContainer) {
        addLog('❌ No se encontró #articulosContainer', 'error');
        return false;
    }
    
    addLog('✅ UI de artículos inicializada');
    return true;
}

export function mostrarListaArticulos(conceptoActual, busquedaActual, nodosArticulos) {
    addLog(`📋 Mostrando lista para: ${conceptoActual?.centro_label}`);
    
    if (!conceptoActual) {
        addLog('⚠️ Concepto actual nulo');
        return;
    }
    
    const nodoData = nodosArticulos.find(n => n.id === conceptoActual.id);
    
    if (!nodoData?.articulos?.length) {
        addLog(`ℹ️ No hay artículos para "${conceptoActual.centro_label}"`);
        articulosContainer.innerHTML = `
            <div style="color: #aaa; text-align: center; padding: 20px;">
                <i class="fas fa-info-circle"></i> No hay artículos relacionados con este concepto.
            </div>
        `;
        panelLista.style.display = 'block';
        return;
    }
    
    addLog(`📊 ${nodoData.articulos.length} artículos encontrados`);
    
    // 1. Cabecera limpia con el título del concepto actual
    const tituloElemento = panelLista.querySelector('h3');
    if (tituloElemento) {
        tituloElemento.style.color = '#ffcc66';      
        tituloElemento.style.background = '#0a0a22'; 
        tituloElemento.innerHTML = `<i class="fas fa-file-alt"></i> Artículos relacionados con "${conceptoActual.centro_label}"`;
    }
    
    // 2. Limpiar e inyectar tarjetas oscuras estilizadas
    articulosContainer.innerHTML = '';
    
    nodoData.articulos.forEach(artId => {
        const articulo = window.ARTICULOS_DETALLE?.[artId];
        
        // Generamos la vista previa inicial cortando a 180 caracteres
        let preview = articulo?.texto_completo 
            ? articulo.texto_completo.substring(0, 180) + '...'
            : 'Contenido no disponible temporalmente';
        
        // 🌟 LA MAGIA DEL RESALTADO:
        // Si el artículo tiene texto y el concepto actual tiene etiqueta, resaltamos la palabra al vuelo
        if (articulo?.texto_completo && conceptoActual?.centro_label) {
            preview = resaltarTexto(preview, conceptoActual.centro_label);
        }
        
        const card = document.createElement('div');
        card.className = 'articulo-card';
        
        card.style.cssText = `
            background: #131332;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 12px;
            border-left: 4px solid #ffcc66;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        card.onmouseenter = () => {
            card.style.transform = 'translateX(5px)';
            card.style.background = '#1a1a44';
            card.style.boxShadow = '0 4px 12px rgba(255,204,102,0.15)';
        };
        card.onmouseleave = () => {
            card.style.transform = 'translateX(0)';
            card.style.background = '#131332';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        };
        card.onclick = () => mostrarDetalleArticulo(artId, conceptoActual, articulo);
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <span style="font-weight: bold; color: #ffcc66; font-size: 16px;">
                    <i class="fas fa-gavel"></i> Artículo ${artId}
                </span>
            </div>
            <div style="font-size: 13px; color: #ccd0e0; line-height: 1.5; text-align: justify;">
                ${preview} </div>
            <div style="margin-top: 10px; text-align: right;">
                <span style="font-size: 12px; color: #ffcc66;">
                    <i class="fas fa-chevron-right"></i> Leer más
                </span>
            </div>
        `;
        articulosContainer.appendChild(card);
    });
    
    panelLista.style.display = 'block';
    panelLista.style.background = '#0a0a22'; 
    
    setTimeout(() => {
        scrollSuave(panelLista, 'start');
    }, 50);
    
    addLog(`✅ Lista mostrada con ${nodoData.articulos.length} artículos`);
}

function mostrarDetalleArticulo(artId, conceptoActual, articulo) {
    addLog(`📖 Abriendo detalle del artículo ${artId}`);
    
    let modal = document.getElementById('modalDetalleArticulo');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalDetalleArticulo';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                width: 90%;
                max-width: 850px;
                max-height: 85vh;
                border-radius: 16px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            ">
                <div style="
                    background: linear-gradient(135deg, #1a1a3a 0%, #0a0a2a 100%);
                    padding: 18px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; color: #ffcc66;">
                        <i class="fas fa-file-alt"></i> Artículo ${artId}
                    </h3>
                    <button id="cerrarModalBtn" style="
                        background: none;
                        border: none;
                        color: #ffcc66;
                        font-size: 28px;
                        cursor: pointer;
                        padding: 0 8px;
                    ">&times;</button>
                </div>
                <div id="modalContenido" style="
                    padding: 24px;
                    overflow-y: auto;
                    flex: 1;
                    font-size: 15px;
                    line-height: 1.6;
                    color: #333;
                "></div>
                <div style="
                    padding: 12px 24px;
                    border-top: 1px solid #eee;
                    background: #fafafa;
                    font-size: 12px;
                    color: #888;
                ">
                    <i class="fas fa-gavel"></i> Ley de Amparo · Artículo ${artId}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
        
        const cerrarBtn = document.getElementById('cerrarModalBtn');
        if (cerrarBtn) cerrarBtn.onclick = cerrarModal;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.opacity === '1') {
                cerrarModal();
            }
        });
    }
    
    const modalContenido = document.getElementById('modalContenido');
    
    if (!articulo) {
        modalContenido.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #cc4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px;"></i>
                <p>No se encontró el contenido del artículo ${artId}</p>
            </div>
        `;
    } else {
        let metadataHtml = '';
        if (articulo.titulo) {
            metadataHtml += `<strong>Título:</strong> ${articulo.titulo}${articulo.titulo_descripcion ? ` - ${articulo.titulo_descripcion}` : ''}<br>`;
        }
        if (articulo.capitulo) {
            metadataHtml += `<strong>Capítulo:</strong> ${articulo.capitulo}${articulo.capitulo_descripcion ? ` - ${articulo.capitulo_descripcion}` : ''}<br>`;
        }
        if (articulo.seccion) {
            metadataHtml += `<strong>Sección:</strong> ${articulo.seccion}${articulo.seccion_descripcion ? ` - ${articulo.seccion_descripcion}` : ''}<br>`;
        }
        
        modalContenido.innerHTML = `
            ${metadataHtml ? `<div style="background: #f5f5f0; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; color: #555;">${metadataHtml}</div>` : ''}
            <div style="text-align: justify;">
                ${escapeHtml(articulo.texto_completo || 'Contenido no disponible').replace(/\n/g, '<br>')}
            </div>
        `;
    }
    
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        const modalInner = modal.querySelector('div > div');
        if (modalInner) modalInner.style.transform = 'scale(1)';
    }, 10);
    
    function cerrarModal() {
        const modalInner = modal.querySelector('div > div');
        if (modalInner) modalInner.style.transform = 'scale(0.9)';
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

export function ocultarListaArticulos() {
    if (panelLista) {
        panelLista.style.display = 'none';
        addLog('🔒 Lista ocultada');
    }
}

export function limpiarPanelesArticulos() {
    ocultarListaArticulos();
}

export const mostrarVisualizadorArticulos = mostrarListaArticulos;
export const ocultarVisualizadorArticulos = ocultarListaArticulos;