// ============================================
// LEXIA_MX - JURISPRUDENCIAS (CONCEPTO LIMPIO)
// ============================================

const AppState = {
    todasLasTesis: [],
    tesisFiltradas: [],
    tesisSeleccionada: null,
    tooltipTimeout: null,
    tooltipActivo: null
};

const DOM = {
    listadoContainer: document.getElementById('listadoContainer'),
    detalleContainer: document.getElementById('detalleContainer'),
    detalleCard: document.getElementById('detalleCard'),
    botonesDetalle: document.getElementById('botonesDetalle'),
    contadorDiv: document.getElementById('contadorResultados'),
    filtroTipo: document.getElementById('filtroTipo'),
    filtroMateria: document.getElementById('filtroMateria'),
    filtroBusqueda: document.getElementById('filtroBusqueda'),
    btnCerrarDetalle: document.getElementById('btnCerrarDetalle'),
    btnGuardarPDF: document.getElementById('btnGuardarPDF')
};

// ============================================
// UTILERÍAS
// ============================================

function escapeHtml(texto) {
    if (!texto) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(texto).replace(/[&<>"']/g, m => map[m]);
}

function limpiarTexto(texto, esParaPDF = false) {
    if (!texto) return 'No disponible';
    
    // 1. Escapamos HTML si es para pantalla (el PDF necesita el texto plano limpio)
    let textoLimpio = esParaPDF ? texto : escapeHtml(texto);
    
    // 2. ALGORITMO DE RECONSTRUCCIÓN JURÍDICA:
    // Identificamos los saltos dobles verdaderos (párrafos reales) y los protegemos temporalmente
    textoLimpio = textoLimpio.replace(/\r?\n\s*\r?\n/g, '___PARRAFO_REAL___');
    
    // 3. Eliminamos los saltos de línea individuales (los "Enters" falsos que cortan las frases a la mitad)
    // Cambiamos esos cortes artificiales por un espacio simple para que el texto fluya continuo
    textoLimpio = textoLimpio.replace(/\r?\n/g, ' ');
    
    // 4. Limpiamos espacios dobles consecutivos que hayan quedado tras la unión
    textoLimpio = textoLimpio.replace(/\s+/g, ' ');
    
    // 5. Restauramos los párrafos reales con su separación limpia según el destino
    if (esParaPDF) {
        // Para el PDF usamos saltos de línea de texto plano nativos
        return textoLimpio.split('___PARRAFO_REAL___').map(p => p.trim()).join('\n\n');
    } else {
        // Para la pantalla web usamos etiquetas HTML <br><br>
        return textoLimpio.split('___PARRAFO_REAL___').map(p => p.trim()).join('<br><br>');
    }
}

function formatearFecha(fechaStr) {
    if (!fechaStr) return 'Fecha N/A';
    const fecha = new Date(fechaStr);
    if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    const partes = fechaStr.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/);
    if (partes) return `${partes[1]}/${partes[2].substring(0,3)}/${partes[3]}`;
    return fechaStr;
}

function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// ============================================
// OPERACIONES DE DATOS
// ============================================

async function cargarTesis() {
    try {
        DOM.listadoContainer.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Cargando base de datos...</div>';
        const response = await fetch('/jurisprudencias/api/todas');
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const data = await response.json();
        if (data.success) {
            AppState.todasLasTesis = data.tesis;
            AppState.todasLasTesis.sort((a, b) => Number(b.registro_digital || 0) - Number(a.registro_digital || 0));
            filtrarTesis();
        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    } catch (error) {
        console.error("Error al cargar tesis:", error);
        DOM.listadoContainer.innerHTML = '<div class="loading-state">❌ Error cargando datos jurídicos</div>';
        DOM.contadorDiv.innerHTML = '❌ Error de conexión';
    }
}

function filtrarTesis() {
    const tipo = DOM.filtroTipo.value;
    const materia = DOM.filtroMateria.value;
    const busqueda = DOM.filtroBusqueda.value.toLowerCase().trim();
    
    AppState.tesisFiltradas = AppState.todasLasTesis.filter(t => {
        if (tipo !== 'todas' && t.tipo !== tipo) return false;
        if (materia !== 'todas' && t.materias && !t.materias.includes(materia)) return false;
        if (busqueda) {
            return t.rubro?.toLowerCase().includes(busqueda) || t.resumen_ia?.toLowerCase().includes(busqueda);
        }
        return true;
    });
    
    actualizarContador(tipo, materia);
    renderizarListado();
}

function actualizarContador(tipo, materia) {
    const desplegadasTotal = AppState.tesisFiltradas.length;
    const desplegadasJuris = AppState.tesisFiltradas.filter(t => t.tipo === 'Jurisprudencia').length;
    const desplegadasAisl = AppState.tesisFiltradas.filter(t => t.tipo === 'Aislada').length;

    let mensajeMetricas = '';
    if (tipo === 'Jurisprudencia') {
        const complementoMateria = materia === 'todas' ? 'en todas las materias' : `en materia ${materia}`;
        mensajeMetricas = `<b>${desplegadasJuris}</b> jurisprudencias ${complementoMateria}`;
    } else if (tipo === 'Aislada') {
        const complementoMateria = materia === 'todas' ? 'de todas las materias' : `en materia ${materia}`;
        mensajeMetricas = `<b>${desplegadasAisl}</b> tesis aisladas ${complementoMateria}`;
    } else {
        mensajeMetricas = `<b>${desplegadasTotal}</b> total: <b>${desplegadasJuris}</b> jurisprudencias y <b>${desplegadasAisl}</b> tesis aisladas`;
    }

    let mensajePeriodo = '';
    if (desplegadasTotal > 0) {
        const tesisConRegistro = AppState.tesisFiltradas.filter(t => t.registro_digital && !isNaN(t.registro_digital));
        if (tesisConRegistro.length > 0) {
            const ordenadasPorRegistro = [...tesisConRegistro].sort((a, b) => Number(a.registro_digital) - Number(b.registro_digital));
            const fechaInicio = formatearFecha(ordenadasPorRegistro[0].fecha_publicacion);
            const fechaFin = formatearFecha(ordenadasPorRegistro[ordenadasPorRegistro.length - 1].fecha_publicacion);
            mensajePeriodo = `<br><span class="texto-periodo">Periodo del <b>${fechaInicio}</b> al <b>${fechaFin}</b></span>`;
        }
    } else {
        mensajePeriodo = '<br><span class="texto-error">Sin registros para el periodo</span>';
    }

    DOM.contadorDiv.innerHTML = `📊 ${mensajeMetricas}${mensajePeriodo}`;
}

// ============================================
// RENDERIZADO Y UI
// ============================================

function renderizarListado() {
    if (AppState.tesisFiltradas.length === 0) {
        DOM.listadoContainer.innerHTML = '<div class="loading-state">🔍 No hay tesis con estos filtros</div>';
        return;
    }
    
    const html = AppState.tesisFiltradas.map(t => {
        const badgeClass = t.tipo === 'Jurisprudencia' ? 'badge-jurisprudencia' : 'badge-aislada';
        const materiaClass = `materia-${t.materias?.replace(/\s/g, '') || 'default'}`;
        return `
            <div class="tesis-card" data-id="${t.id}">
                <div class="meta-line">
                    <span>📌 ${t.registro_digital || 'N/A'}</span>
                    <span class="${badgeClass}">${t.tipo === 'Jurisprudencia' ? '⚖️ Jurisprudencia' : '📄 Aislada'}</span>
                    <span class="${materiaClass}">📚 ${t.materias || 'N/A'}</span>
                    <span>📅 ${formatearFecha(t.fecha_publicacion)}</span>
                </div>
                <div class="rubro-text rubro-click">${escapeHtml(t.rubro) || 'Sin rubro'}</div>
            </div>
        `;
    }).join('');
    
    DOM.listadoContainer.innerHTML = html;
}

DOM.listadoContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.tesis-card');
    if (!card) return;
    const tdata = AppState.tesisFiltradas.find(t => t.id == card.dataset.id);
    if (tdata) seleccionarTesis(tdata);
});

DOM.listadoContainer.addEventListener('mouseover', (e) => {
    const rubroEl = e.target.closest('.rubro-click');
    if (!rubroEl) return;
    const card = rubroEl.closest('.tesis-card');
    const tdata = AppState.tesisFiltradas.find(t => t.id == card.dataset.id);
    if (tdata?.resumen_ia) {
        clearTimeout(AppState.tooltipTimeout);
        AppState.tooltipTimeout = setTimeout(() => mostrarTooltip(e, tdata.resumen_ia), 400);
    }
});

DOM.listadoContainer.addEventListener('mouseout', (e) => {
    if (e.target.closest('.rubro-click')) {
        clearTimeout(AppState.tooltipTimeout);
        ocultarTooltip();
    }
});

function mostrarTooltip(event, texto) {
    if (AppState.tooltipActivo) AppState.tooltipActivo.remove();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-ai';
    tooltip.innerHTML = `<div class="tooltip-title">🤖 Análisis IA</div><div>${escapeHtml(texto)}</div>`;
    document.body.appendChild(tooltip);
    AppState.tooltipActivo = tooltip;
    
    const x = Math.min(event.clientX + 15, window.innerWidth - tooltip.offsetWidth - 10);
    const y = event.clientY - tooltip.offsetHeight - 10;
    
    tooltip.style.left = `${Math.max(10, x)}px`;
    tooltip.style.top = `${Math.max(10, y)}px`;
    requestAnimationFrame(() => tooltip.classList.add('visible'));
}

function ocultarTooltip() {
    if (AppState.tooltipActivo) {
        const tempTooltip = AppState.tooltipActivo;
        tempTooltip.classList.remove('visible');
        AppState.tooltipActivo = null;
        setTimeout(() => tempTooltip.remove(), 150);
    }
}

async function seleccionarTesis(tesis) {
    if (!tesis) return;
    
    document.body.style.overflow = 'hidden'; // Congela el listado de fondo
    DOM.detalleCard.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Cargando desglose jurídico...</div>';
    DOM.detalleContainer.classList.remove('hidden');
    
    try {
        const response = await fetch(`/jurisprudencias/api/detalle/${tesis.registro_digital}`);
        if (!response.ok) throw new Error();
        
        const data = await response.json();
        const t = data.success ? data.tesis : tesis;
        
        // 1. Aseguramos el estado antes de pintar los botones
        AppState.tesisSeleccionada = t;
        
        // 2. Inyectamos la estructura dividida: Barra Fija Superior + Cuerpo Desplazable
        DOM.detalleCard.innerHTML = `
            <div class="modal-barra-superior">
                <button id="btnGuardarPDFInterno" class="btn-pdf-modal" onclick="guardarPDF()">
                    <i class="fas fa-file-pdf"></i> Guardar PDF
                </button>
                <button id="modalCerrarX" class="btn-cerrar-modal-caja" onclick="cerrarDetalle()" title="Cerrar consulta">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>

            <div class="modal-cuerpo-lectura">
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
            </div>
        `;
        
        // Forzamos a que el área de lectura inicie estrictamente al principio
        const cuerpoLectura = DOM.detalleCard.querySelector('.modal-cuerpo-lectura');
        if (cuerpoLectura) cuerpoLectura.scrollTop = 0;
        
        // Animación fluida de entrada
        DOM.detalleCard.classList.remove('visible');
        requestAnimationFrame(() => DOM.detalleCard.classList.add('visible'));
        
    } catch (error) {
        console.error("Error al obtener detalle:", error);
        DOM.detalleCard.innerHTML = `
            <div class="modal-barra-superior">
                <button class="btn-cerrar-modal-caja" onclick="cerrarDetalle()"><i class="fas fa-times"></i> Cerrar</button>
            </div>
            <div class="loading-state" style="margin-top: 60px;">❌ Error cargando el detalle de la tesis</div>
        `;
    }
}

function cerrarDetalle() {
    DOM.detalleContainer.classList.add('hidden');
    DOM.botonesDetalle.classList.add('hidden');
    AppState.tesisSeleccionada = null;
    document.body.style.overflow = ''; // Libera el listado
}

// ============================================
// EXPORTACIÓN PDF
// ============================================

async function guardarPDF() {
    const t = AppState.tesisSeleccionada;
    if (!t) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;
    const margin = 20;
    const pageHeight = doc.internal.pageSize.height;
    
    const verificarYAgregarSeccion = (titulo, contenido) => {
        if (y > pageHeight - 30) { doc.addPage(); y = 20; }
        doc.setFont(undefined, 'bold');
        doc.text(titulo, margin, y);
        y += 6;
        
        doc.setFont(undefined, 'normal');
        const lineas = doc.splitTextToSize(contenido || 'No disponible', 170);
        lineas.forEach(linea => {
            if (y > pageHeight - 15) { doc.addPage(); y = 20; }
            doc.text(linea, margin, y);
            y += 6;
        });
        y += 4;
    };
    
    // Procesamos el título/rubro quitándole los saltos de línea físicos para el PDF
    doc.setFontSize(14);
    const tituloMeta = doc.splitTextToSize(limpiarTexto(t.rubro, true), 170);
    tituloMeta.forEach(linea => {
        if (y > pageHeight - 15) { doc.addPage(); y = 20; }
        doc.text(linea, margin, y);
        y += 6;
    });
    y += 2;
    
    doc.setFontSize(9);
    doc.text(`Registro: ${t.registro_digital || 'N/A'} | Tipo: ${t.tipo || 'N/A'} | Materias: ${t.materias || 'N/A'} | Fecha: ${formatearFecha(t.fecha_publicacion)}`, margin, y);
    y += 10;
    
    // Imprimimos cada sección pasando rigurosamente por el filtro de reconstrucción de párrafos
    doc.setFontSize(10);
    verificarYAgregarSeccion('Análisis IA:', limpiarTexto(t.resumen_ia, true));
    verificarYAgregarSeccion('Hechos:', limpiarTexto(t.hechos, true));
    verificarYAgregarSeccion('Criterio Jurídico:', limpiarTexto(t.criterio_juridico, true));
    verificarYAgregarSeccion('Justificación:', limpiarTexto(t.justificacion, true));
    
    doc.save(`tesis_${t.registro_digital || t.id}.pdf`);
}

// ============================================
// LISTENERS DE CONTROL Y DISPARADORES
// ============================================

DOM.filtroTipo.addEventListener('change', filtrarTesis);
DOM.filtroMateria.addEventListener('change', filtrarTesis);
DOM.filtroBusqueda.addEventListener('input', debounce(filtrarTesis, 300));
DOM.btnCerrarDetalle.addEventListener('click', cerrarDetalle);

document.addEventListener('DOMContentLoaded', cargarTesis);