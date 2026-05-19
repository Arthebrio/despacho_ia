// ============================================
// LEXIA_MX - JURISPRUDENCIAS
// ============================================

let todasLasTesis = [];
let tesisFiltradas = [];
let tesisSeleccionada = null;
let tooltipTimeout = null;
let tooltipActivo = null;

// Elementos DOM
const listadoContainer = document.getElementById('listadoContainer');
const detalleContainer = document.getElementById('detalleContainer');
const detalleCard = document.getElementById('detalleCard');
const botonesDetalle = document.getElementById('botonesDetalle');
const contadorDiv = document.getElementById('contadorResultados');
const filtroTipo = document.getElementById('filtroTipo');
const filtroMateria = document.getElementById('filtroMateria');
const filtroBusqueda = document.getElementById('filtroBusqueda');
const btnCerrarDetalle = document.getElementById('btnCerrarDetalle');
const btnGuardarPDF = document.getElementById('btnGuardarPDF');

// Utilería
function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function limpiarTexto(texto) {
    if (!texto) return 'No disponible';
    return texto.replace(/\n/g, '<br>');
}

function formatearFecha(fechaStr) {
    if (!fechaStr) return 'Fecha N/A';
    const partes = fechaStr.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/);
    if (partes) return `${partes[1]}/${partes[2].substring(0,3)}/${partes[3]}`;
    return fechaStr;
}

// Cargar tesis
async function cargarTesis() {
    try {
        const response = await fetch('/jurisprudencias/api/todas');
        const data = await response.json();
        if (data.success) {
            todasLasTesis = data.tesis;
            todasLasTesis.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));
            filtrarTesis();
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        listadoContainer.innerHTML = '<div class="loading-state">❌ Error cargando datos</div>';
        contadorDiv.innerHTML = '❌ Error de conexión';
    }
}

// Filtrar
function filtrarTesis() {
    const tipo = filtroTipo.value;
    const materia = filtroMateria.value;
    const busqueda = filtroBusqueda.value.toLowerCase().trim();
    
    tesisFiltradas = todasLasTesis.filter(t => {
        if (tipo !== 'todas' && t.tipo !== tipo) return false;
        if (materia !== 'todas' && t.materias && !t.materias.includes(materia)) return false;
        if (busqueda) {
            const rubroMatch = t.rubro?.toLowerCase().includes(busqueda);
            const resumenMatch = t.resumen_ia?.toLowerCase().includes(busqueda);
            if (!rubroMatch && !resumenMatch) return false;
        }
        return true;
    });
    
    actualizarContador();
    renderizarListado();
}

// Contador destacado
function actualizarContador() {
    const tipo = filtroTipo.value;
    const materia = filtroMateria.value;
    
    let base = todasLasTesis.filter(t => {
        if (tipo !== 'todas' && t.tipo !== tipo) return false;
        if (materia !== 'todas' && t.materias && !t.materias.includes(materia)) return false;
        return true;
    });
    
    const totalJuris = base.filter(t => t.tipo === 'Jurisprudencia').length;
    const totalAisl = base.filter(t => t.tipo === 'Aislada').length;
    const materiaNombre = materia === 'todas' ? 'todas las materias' : `materia ${materia}`;
    
    if (tipo === 'Jurisprudencia') {
        contadorDiv.innerHTML = `📊 <span>${tesisFiltradas.length}</span> jurisprudencias en ${materiaNombre}`;
    } else if (tipo === 'Aislada') {
        contadorDiv.innerHTML = `📊 <span>${tesisFiltradas.length}</span> tesis aisladas en ${materiaNombre}`;
    } else {
        const filtJuris = tesisFiltradas.filter(t => t.tipo === 'Jurisprudencia').length;
        const filtAisl = tesisFiltradas.filter(t => t.tipo === 'Aislada').length;
        if (filtJuris > 0 && filtAisl > 0) {
            contadorDiv.innerHTML = `📊 <span>${filtJuris}</span> jurisprudencias en ${materiaNombre} · <span>${filtAisl}</span> tesis aisladas en ${materiaNombre}`;
        } else if (filtJuris > 0) {
            contadorDiv.innerHTML = `📊 <span>${filtJuris}</span> jurisprudencias en ${materiaNombre}`;
        } else {
            contadorDiv.innerHTML = `📊 <span>${filtAisl}</span> tesis aisladas en ${materiaNombre}`;
        }
    }
}

// Renderizar listado
function renderizarListado() {
    if (tesisFiltradas.length === 0) {
        listadoContainer.innerHTML = '<div class="loading-state">🔍 No hay tesis con estos filtros</div>';
        return;
    }
    
    let html = '';
    for (const t of tesisFiltradas) {
        const badgeClass = t.tipo === 'Jurisprudencia' ? 'badge-jurisprudencia' : 'badge-aislada';
        const materiaClass = `materia-${t.materias?.replace(/\s/g, '') || 'default'}`;
        html += `
            <div class="tesis-card" data-id="${t.id}" data-registro="${t.registro_digital}">
                <div class="meta-line">
                    <span>📌 ${t.registro_digital || 'N/A'}</span>
                    <span class="${badgeClass}">${t.tipo === 'Jurisprudencia' ? '⚖️ Jurisprudencia' : '📄 Aislada'}</span>
                    <span class="${materiaClass}">📚 ${t.materias || 'N/A'}</span>
                    <span>📅 ${formatearFecha(t.fecha_publicacion)}</span>
                </div>
                <div class="rubro-text rubro-click">${escapeHtml(t.rubro) || 'Sin rubro'}</div>
            </div>
        `;
    }
    
    listadoContainer.innerHTML = html;
    
    document.querySelectorAll('.tesis-card').forEach(card => {
        const tdata = tesisFiltradas.find(t => t.id == card.dataset.id);
        const rubroEl = card.querySelector('.rubro-click');
        
        // Un clic para abrir detalle
        card.addEventListener('click', () => seleccionarTesis(tdata));
        
        // Tooltip en el rubro
        if (rubroEl && tdata?.resumen_ia) {
            rubroEl.addEventListener('mouseenter', (e) => {
                tooltipTimeout = setTimeout(() => mostrarTooltip(e, tdata.resumen_ia), 400);
            });
            rubroEl.addEventListener('mouseleave', () => {
                clearTimeout(tooltipTimeout);
                ocultarTooltip();
            });
        }
    });
}

// Tooltip
function mostrarTooltip(event, texto) {
    if (tooltipActivo) {
        tooltipActivo.remove();
        tooltipActivo = null;
    }
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-ai';
    tooltip.innerHTML = `<div style="color:#fbbf24;font-size:10px;margin-bottom:4px;">🤖 Análisis IA</div><div>${escapeHtml(texto)}</div>`;
    document.body.appendChild(tooltip);
    tooltipActivo = tooltip;
    
    const x = Math.min(event.clientX + 15, window.innerWidth - tooltip.offsetWidth - 10);
    const y = event.clientY - tooltip.offsetHeight - 10;
    
    tooltip.style.left = Math.max(10, x) + 'px';
    tooltip.style.top = Math.max(10, y) + 'px';
    setTimeout(() => tooltip.classList.add('visible'), 5);
}

function ocultarTooltip() {
    if (tooltipActivo) {
        tooltipActivo.classList.remove('visible');
        setTimeout(() => {
            if (tooltipActivo) tooltipActivo.remove();
            tooltipActivo = null;
        }, 150);
    }
}

// Seleccionar tesis
async function seleccionarTesis(tesis) {
    if (!tesis) return;
    
    detalleCard.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Cargando detalle...</div>';
    detalleContainer.classList.remove('hidden');
    botonesDetalle.classList.remove('hidden');
    
    try {
        const response = await fetch(`/jurisprudencias/api/detalle/${tesis.registro_digital}`);
        const data = await response.json();
        const t = data.success ? data.tesis : tesis;
        tesisSeleccionada = t;
        
        detalleCard.innerHTML = `
            <div class="detalle-titulo">${escapeHtml(t.rubro) || 'Sin título'}</div>
            <div class="detalle-meta">
                <div><strong>📌 Registro:</strong> ${t.registro_digital || 'N/A'}</div>
                <div><strong>📚 Tipo:</strong> ${t.tipo || 'N/A'}</div>
                <div><strong>🏷️ Materias:</strong> ${t.materias || 'N/A'}</div>
                <div><strong>📆 Fecha:</strong> ${formatearFecha(t.fecha_publicacion)}</div>
            </div>
            <div class="detalle-ia">
                <div class="detalle-ia-title">🤖 Análisis IA</div>
                <div class="detalle-ia-text">${escapeHtml(t.resumen_ia) || 'No disponible'}</div>
            </div>
            <div class="detalle-section-title">📋 Hechos</div>
            <div class="detalle-section-text">${limpiarTexto(t.hechos)}</div>
            <div class="detalle-section-title">⚖️ Criterio Jurídico</div>
            <div class="detalle-section-text">${limpiarTexto(t.criterio_juridico)}</div>
            <div class="detalle-section-title">📝 Justificación</div>
            <div class="detalle-section-text">${limpiarTexto(t.justificacion)}</div>
        `;
        
        detalleCard.classList.remove('visible');
        setTimeout(() => detalleCard.classList.add('visible'), 20);
        

        
    } catch (error) {
        detalleCard.innerHTML = '<div class="loading-state">❌ Error cargando detalle</div>';
    }
}

// Cerrar detalle
function cerrarDetalle() {
    detalleContainer.classList.add('hidden');
    botonesDetalle.classList.add('hidden');
    tesisSeleccionada = null;
}

// Guardar PDF
async function guardarPDF() {
    if (!tesisSeleccionada) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const t = tesisSeleccionada;
    let y = 20;
    
    doc.setFontSize(14);
    const titulo = doc.splitTextToSize(t.rubro || 'Tesis sin título', 170);
    doc.text(titulo, 20, y);
    y += titulo.length * 5 + 6;
    
    doc.setFontSize(9);
    doc.text(`Registro: ${t.registro_digital || 'N/A'} | Tipo: ${t.tipo || 'N/A'} | Materias: ${t.materias || 'N/A'} | Fecha: ${formatearFecha(t.fecha_publicacion)}`, 20, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Análisis IA:', 20, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    const resumen = doc.splitTextToSize(t.resumen_ia || 'No disponible', 170);
    doc.text(resumen, 20, y);
    y += resumen.length * 5 + 8;
    
    if (y > 270) { doc.addPage(); y = 20; }
    
    doc.setFont(undefined, 'bold');
    doc.text('Hechos:', 20, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    const hechos = doc.splitTextToSize(t.hechos || 'No disponible', 170);
    doc.text(hechos, 20, y);
    y += hechos.length * 5 + 8;
    
    if (y > 270) { doc.addPage(); y = 20; }
    
    doc.setFont(undefined, 'bold');
    doc.text('Criterio Jurídico:', 20, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    const criterio = doc.splitTextToSize(t.criterio_juridico || 'No disponible', 170);
    doc.text(criterio, 20, y);
    y += criterio.length * 5 + 8;
    
    if (y > 270) { doc.addPage(); y = 20; }
    
    doc.setFont(undefined, 'bold');
    doc.text('Justificación:', 20, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    const justi = doc.splitTextToSize(t.justificacion || 'No disponible', 170);
    doc.text(justi, 20, y);
    
    doc.save(`tesis_${t.registro_digital || t.id}.pdf`);
}

// Eventos
filtroTipo.addEventListener('change', filtrarTesis);
filtroMateria.addEventListener('change', filtrarTesis);
filtroBusqueda.addEventListener('input', filtrarTesis);
btnCerrarDetalle.addEventListener('click', cerrarDetalle);
btnGuardarPDF.addEventListener('click', guardarPDF);

// Iniciar
cargarTesis();