// ============================================
// LEXIA_MX - ESPACIO EXPERIMENTAL
// ============================================

let isLoading = false;
let consultaActualId = null;

// Elementos DOM
const nombreInput = document.getElementById('nombre');
const ocupacionSelect = document.getElementById('ocupacion');
const estadoSelect = document.getElementById('estado');
const telefonoInput = document.getElementById('telefono');
const correoInput = document.getElementById('correo');
const consultaTextarea = document.getElementById('consulta');
const btnEnviar = document.getElementById('btnEnviar');
const spinner = document.getElementById('spinner');
const respuestaContainer = document.getElementById('respuestaContainer');
const respuestaTexto = document.getElementById('respuestaTexto');
const errorContainer = document.getElementById('errorContainer');
const errorTexto = document.getElementById('errorTexto');
const charCountSpan = document.getElementById('charCount');
const feedbackContainer = document.getElementById('feedbackContainer');

// Contador de caracteres
consultaTextarea.addEventListener('input', () => {
    const len = consultaTextarea.value.length;
    charCountSpan.textContent = `${len} caracteres`;
});

function mostrarError(mensaje) {
    errorTexto.textContent = mensaje;
    errorContainer.classList.remove('hidden');
    setTimeout(() => {
        errorContainer.classList.add('hidden');
    }, 5000);
}

function mostrarRespuesta(respuesta, consultaId) {
    respuestaTexto.textContent = respuesta;
    respuestaContainer.classList.remove('hidden');
    consultaActualId = consultaId;
    
    // Mostrar feedback después de la respuesta
    if (feedbackContainer) {
        feedbackContainer.classList.remove('hidden');
    }
    
    respuestaContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Enviar consulta
async function enviarConsulta() {
    if (isLoading) return;
    
    const nombre = nombreInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const consulta = consultaTextarea.value.trim();
    const ocupacion = ocupacionSelect.value;
    const estado = estadoSelect.value;
    const correo = correoInput.value.trim();
    
    if (!nombre) {
        mostrarError('Por favor, ingresa tu nombre completo');
        return;
    }
    
    if (!telefono || telefono.length !== 10 || !/^\d+$/.test(telefono)) {
        mostrarError('El teléfono debe tener 10 dígitos numéricos');
        return;
    }
    
    if (!consulta || consulta.length < 20) {
        mostrarError('La consulta debe tener al menos 20 caracteres');
        return;
    }
    
    isLoading = true;
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Procesando...';
    spinner.classList.remove('hidden');
    respuestaContainer.classList.add('hidden');
    if (feedbackContainer) feedbackContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
    
    try {
        const response = await fetch('/experimental/api/consultar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre, telefono, consulta, ocupacion, estado, correo
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarRespuesta(data.respuesta, data.consulta_id);
            consultaTextarea.value = '';
            charCountSpan.textContent = '0 caracteres';
        } else {
            mostrarError(data.error || 'Error al procesar la consulta');
        }
        
    } catch (error) {
        mostrarError('Error de conexión. Intenta de nuevo.');
    } finally {
        isLoading = false;
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = '<i class="fas fa-gavel mr-2"></i> Enviar consulta';
        spinner.classList.add('hidden');
    }
}

// ============================================
// FEEDBACK
// ============================================

async function enviarFeedback(util, texto) {
    if (!consultaActualId) return;
    
    try {
        const response = await fetch('/experimental/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                consulta_id: consultaActualId,
                respuesta_util: util,
                feedback_texto: texto || null
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const graciasDiv = document.getElementById('feedbackGracias');
            if (graciasDiv) graciasDiv.classList.remove('hidden');
            document.getElementById('feedbackSi').disabled = true;
            document.getElementById('feedbackNo').disabled = true;
            setTimeout(() => {
                if (feedbackContainer) feedbackContainer.classList.add('hidden');
            }, 3000);
        }
    } catch (error) {
        console.error('Error enviando feedback:', error);
    }
}

// Eventos de feedback
const feedbackSi = document.getElementById('feedbackSi');
const feedbackNo = document.getElementById('feedbackNo');
const btnEnviarFeedback = document.getElementById('btnEnviarFeedback');
const feedbackTexto = document.getElementById('feedbackTexto');
const feedbackTextoContainer = document.getElementById('feedbackTextoContainer');

let feedbackUtil = null;

if (feedbackSi) {
    feedbackSi.addEventListener('click', () => {
        feedbackUtil = true;
        feedbackTextoContainer.classList.remove('hidden');
    });
}

if (feedbackNo) {
    feedbackNo.addEventListener('click', () => {
        feedbackUtil = false;
        feedbackTextoContainer.classList.remove('hidden');
    });
}

if (btnEnviarFeedback) {
    btnEnviarFeedback.addEventListener('click', () => {
        const texto = feedbackTexto ? feedbackTexto.value : '';
        enviarFeedback(feedbackUtil, texto);
    });
}

// Eventos
btnEnviar.addEventListener('click', enviarConsulta);
consultaTextarea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        enviarConsulta();
    }
});