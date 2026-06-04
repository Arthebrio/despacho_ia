// ============================================
// LEXIA_MX - v7.0 OPTIMIZADO
// Con validación de campos + toast + feedback mejorado
// ============================================

let isLoading = false;
let consultaActualId = null;
let progressInterval = null;
let stepInterval = null;
let startTime = null;

// ============================================
// DOM ELEMENTS
// ============================================
const DOM = {
    nombre: document.getElementById('nombre'),
    perfil: document.getElementById('perfil'),
    estado: document.getElementById('estado'),
    telefono: document.getElementById('telefono'),
    correo: document.getElementById('correo'),
    consulta: document.getElementById('consulta'),
    btnEnviar: document.getElementById('btnEnviar'),
    formulario: document.getElementById('formularioContainer'),
    spinner: document.getElementById('spinnerContainer'),
    respuesta: document.getElementById('respuestaContainer'),
    respuestaTexto: document.getElementById('respuestaTexto'),
    error: document.getElementById('errorContainer'),
    errorTexto: document.getElementById('errorTexto'),
    charCount: document.getElementById('charCount'),
    feedback: document.getElementById('feedbackContainer'),
    limiteMensaje: document.getElementById('limiteMensaje'),
    limiteTexto: document.getElementById('limiteTexto'),
    progressContainer: document.getElementById('progressContainer'),
    progressBar: document.getElementById('progressBar'),
    // Elementos de error por campo
    errorNombre: document.getElementById('errorNombre'),
    errorTelefono: document.getElementById('errorTelefono'),
    errorConsulta: document.getElementById('errorConsulta'),
    grupoNombre: document.getElementById('grupoNombre'),
    grupoTelefono: document.getElementById('grupoTelefono'),
    grupoConsulta: document.getElementById('grupoConsulta')
};

// ============================================
// PASOS DEL ANÁLISIS LEGAL
// ============================================
const pasosAnalisis = [
    { principal: "🔍 Analizando los hechos", secundario: "Extrayendo información clave de tu caso", progreso: 15 },
    { principal: "⚖️ Identificando normas aplicables", secundario: "Buscando en legislación mexicana", progreso: 30 },
    { principal: "📋 Estructurando la respuesta", secundario: "Organizando la información legal", progreso: 50 },
    { principal: "🧠 Consultando jurisprudencia", secundario: "Revisando tesis relevantes", progreso: 70 },
    { principal: "✨ Generando orientación personalizada", secundario: "Adaptando al contexto de tu caso", progreso: 85 },
    { principal: "✍️ Redactando respuesta final", secundario: "Preparando tu orientación legal", progreso: 95 }
];

// ============================================
// TOAST PARA VALIDACIONES
// ============================================
function showToast(message) {
    // Eliminar toast existente
    const existingToast = document.querySelector('.toast-validation');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-validation';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============================================
// VALIDACIÓN DE CAMPOS CON BORDE ROJO
// ============================================
function limpiarErrores() {
    const errorDivs = document.querySelectorAll('.field-error');
    errorDivs.forEach(div => div.classList.remove('show'));
    
    const errorInputs = document.querySelectorAll('input.error, select.error, textarea.error');
    errorInputs.forEach(input => input.classList.remove('error'));
}

function mostrarErrorCampo(elementoId, mensaje) {
    const errorDiv = document.getElementById(`error${elementoId}`);
    const input = document.getElementById(elementoId.toLowerCase());
    
    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.classList.add('show');
    }
    if (input) {
        input.classList.add('error');
    }
}

function validarFormulario() {
    let valido = true;
    limpiarErrores();
    
    // Validar nombre
    const nombre = DOM.nombre?.value.trim() || '';
    if (!nombre) {
        mostrarErrorCampo('Nombre', 'El nombre completo es requerido');
        valido = false;
    }
    
    // Validar teléfono
    const telefono = DOM.telefono?.value.trim() || '';
    if (!telefono) {
        mostrarErrorCampo('Telefono', 'El número de teléfono es requerido');
        valido = false;
    } else if (telefono.length !== 10 || !/^\d+$/.test(telefono)) {
        mostrarErrorCampo('Telefono', 'El teléfono debe tener 10 dígitos numéricos');
        valido = false;
    }
    
    // Validar consulta
    const consulta = DOM.consulta?.value.trim() || '';
    if (!consulta) {
        mostrarErrorCampo('Consulta', 'Describe tu situación legal');
        valido = false;
    } else if (consulta.length < 20) {
        mostrarErrorCampo('Consulta', 'Mínimo 20 caracteres para un análisis preciso');
        valido = false;
    }
    
    return valido;
}

// ============================================
// LOCALSTORAGE
// ============================================
function loadSavedData() {
    try {
        const savedNombre = localStorage.getItem('lexia_nombre');
        const savedTelefono = localStorage.getItem('lexia_telefono');
        const savedPerfil = localStorage.getItem('lexia_perfil');
        
        if (savedNombre && DOM.nombre) DOM.nombre.value = savedNombre;
        if (savedTelefono && DOM.telefono) DOM.telefono.value = savedTelefono;
        if (savedPerfil && DOM.perfil) DOM.perfil.value = savedPerfil;
    } catch (e) {
        console.log('localStorage no disponible');
    }
}

function saveUserData() {
    try {
        if (DOM.nombre && DOM.nombre.value.trim()) {
            localStorage.setItem('lexia_nombre', DOM.nombre.value.trim());
        }
        if (DOM.telefono && DOM.telefono.value.trim()) {
            localStorage.setItem('lexia_telefono', DOM.telefono.value.trim());
        }
        if (DOM.perfil && DOM.perfil.value) {
            localStorage.setItem('lexia_perfil', DOM.perfil.value);
        }
    } catch (e) {
        console.log('Error guardando en localStorage');
    }
}

// ============================================
// CONTADOR DE CARACTERES
// ============================================
if (DOM.consulta) {
    DOM.consulta.addEventListener('input', () => {
        const len = DOM.consulta.value.length;
        if (DOM.charCount) {
            DOM.charCount.innerHTML = `${len} caracteres (mínimo 20)`;
            DOM.charCount.style.color = len < 20 && len > 0 ? '#f59e0b' : '#64748b';
        }
        // Limpiar error mientras escribe
        if (len >= 20) {
            const errorConsulta = document.getElementById('errorConsulta');
            if (errorConsulta) errorConsulta.classList.remove('show');
            if (DOM.consulta) DOM.consulta.classList.remove('error');
        }
    });
}

// ============================================
// BARRA DE PROGRESO Y PASOS ANIMADOS
// ============================================
function startProgress() {
    startTime = Date.now();
    
    if (DOM.spinner) DOM.spinner.classList.remove('hidden');
    
    const progressFill = document.getElementById('progressBarFill');
    const progressPercent = document.getElementById('progressPercent');
    const spinnerStep = document.getElementById('spinnerStep');
    const spinnerSubStep = document.getElementById('spinnerSubStep');
    
    if (progressFill) progressFill.style.width = '0%';
    if (progressPercent) progressPercent.textContent = '0%';
    
    let currentStepIndex = 0;
    let currentProgress = 0;
    
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        if (DOM.spinner && DOM.spinner.classList.contains('hidden')) return;
        
        const elapsed = (Date.now() - startTime) / 1000;
        let newStepIndex = Math.min(pasosAnalisis.length - 1, Math.floor(elapsed / 2.2));
        
        if (newStepIndex !== currentStepIndex && newStepIndex < pasosAnalisis.length) {
            currentStepIndex = newStepIndex;
            const paso = pasosAnalisis[currentStepIndex];
            
            if (spinnerStep) {
                spinnerStep.style.opacity = '0';
                setTimeout(() => {
                    if (spinnerStep) spinnerStep.innerHTML = `<i class="fas ${getIconForStep(currentStepIndex)}"></i> ${paso.principal}`;
                    if (spinnerStep) spinnerStep.style.opacity = '1';
                }, 150);
            }
            
            if (spinnerSubStep) {
                spinnerSubStep.style.opacity = '0';
                setTimeout(() => {
                    if (spinnerSubStep) spinnerSubStep.textContent = paso.secundario;
                    if (spinnerSubStep) spinnerSubStep.style.opacity = '1';
                }, 150);
            }
            
            currentProgress = Math.min(95, paso.progreso);
        } else if (currentProgress < 85) {
            currentProgress += Math.random() * 1.2;
            if (currentProgress > 85) currentProgress = 85;
        }
        
        if (progressFill) progressFill.style.width = `${currentProgress}%`;
        if (progressPercent) progressPercent.textContent = `${Math.floor(currentProgress)}%`;
    }, 150);
}

function completeProgress() {
    const progressFill = document.getElementById('progressBarFill');
    const progressPercent = document.getElementById('progressPercent');
    const spinnerStep = document.getElementById('spinnerStep');
    const spinnerSubStep = document.getElementById('spinnerSubStep');
    
    if (progressFill) progressFill.style.width = '100%';
    if (progressPercent) progressPercent.textContent = '100%';
    
    if (spinnerStep) spinnerStep.innerHTML = '<i class="fas fa-check-circle"></i> ¡Respuesta lista!';
    if (spinnerSubStep) spinnerSubStep.textContent = 'Preparando tu orientación legal...';
    
    setTimeout(() => {
        if (progressInterval) clearInterval(progressInterval);
        if (stepInterval) clearInterval(stepInterval);
        if (DOM.spinner) DOM.spinner.classList.add('hidden');
        resetProgress();
    }, 400);
}

function resetProgress() {
    if (progressInterval) clearInterval(progressInterval);
    if (stepInterval) clearInterval(stepInterval);
    progressInterval = null;
    stepInterval = null;
}

function getIconForStep(index) {
    const icons = ['fa-search', 'fa-gavel', 'fa-file-alt', 'fa-brain', 'fa-magic', 'fa-pen-fancy'];
    return icons[index] || 'fa-circle-notch';
}

// ============================================
// UI FUNCTIONS
// ============================================
function mostrarError(mensaje) {
    if (DOM.errorTexto) DOM.errorTexto.textContent = mensaje;
    if (DOM.error) DOM.error.classList.remove('hidden');
    DOM.error.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
        if (DOM.error) DOM.error.classList.add('hidden');
    }, 5000);
}

function mostrarMensajeLimite(mensaje) {
    if (DOM.limiteMensaje) {
        DOM.limiteMensaje.classList.remove('hidden');
        if (DOM.limiteTexto) DOM.limiteTexto.textContent = mensaje;
        DOM.limiteMensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function ocultarMensajeLimite() {
    if (DOM.limiteMensaje) DOM.limiteMensaje.classList.add('hidden');
}

function resetearFeedback() {
    const feedbackSi = document.getElementById('feedbackSi');
    const feedbackNo = document.getElementById('feedbackNo');
    const feedbackTexto = document.getElementById('feedbackTexto');
    const feedbackTextoContainer = document.getElementById('feedbackTextoContainer');
    const feedbackGracias = document.getElementById('feedbackGracias');
    
    if (feedbackSi) feedbackSi.disabled = false;
    if (feedbackNo) feedbackNo.disabled = false;
    if (feedbackTexto) feedbackTexto.value = '';
    if (feedbackTextoContainer) feedbackTextoContainer.classList.add('hidden');
    if (feedbackGracias) feedbackGracias.classList.add('hidden');
}

function mostrarRespuesta(respuesta, consultaId) {
    if (DOM.respuestaTexto) DOM.respuestaTexto.textContent = respuesta;
    if (DOM.respuesta) DOM.respuesta.classList.remove('hidden');
    if (DOM.formulario) DOM.formulario.classList.add('hidden');
    
    consultaActualId = consultaId;
    
    if (DOM.feedback) DOM.feedback.classList.remove('hidden');
    resetearFeedback();
    DOM.respuesta.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// ENVIAR CONSULTA
// ============================================
async function enviarConsulta() {
    if (isLoading) return;
    
    // Validar todos los campos
    if (!validarFormulario()) {
        showToast('⚠️ Completa todos los campos requeridos');
        return;
    }
    
    const nombre = DOM.nombre?.value.trim() || '';
    const perfil = DOM.perfil?.value || 'particular';
    const estado = DOM.estado?.value || 'Ciudad de México';
    const telefono = DOM.telefono?.value.trim() || '';
    const correo = DOM.correo?.value.trim() || '';
    const consulta = DOM.consulta?.value.trim() || '';
    
    // Guardar datos del usuario
    saveUserData();
    ocultarMensajeLimite();
    
    isLoading = true;
    if (DOM.btnEnviar) {
        DOM.btnEnviar.disabled = true;
        DOM.btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando respuesta...';
    }
    
    if (DOM.formulario) DOM.formulario.classList.add('hidden');
    startProgress();
    if (DOM.respuesta) DOM.respuesta.classList.add('hidden');
    if (DOM.feedback) DOM.feedback.classList.add('hidden');
    if (DOM.error) DOM.error.classList.add('hidden');
    
    DOM.spinner?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    try {
        const response = await fetch('/experimental/api/consultar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombre,
                telefono: telefono,
                consulta: consulta,
                perfil_usuario: perfil,
                estado: estado,
                correo: correo
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            completeProgress();
            mostrarRespuesta(data.respuesta, data.consulta_id);
        } else {
            resetProgress();
            if (DOM.spinner) DOM.spinner.classList.add('hidden');
            if (data.tiempo_espera) {
                mostrarMensajeLimite(data.error);
                if (DOM.formulario) DOM.formulario.classList.remove('hidden');
            } else {
                mostrarError(data.error || '❌ Error al procesar la consulta');
                if (DOM.formulario) DOM.formulario.classList.remove('hidden');
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
        resetProgress();
        if (DOM.spinner) DOM.spinner.classList.add('hidden');
        if (DOM.formulario) DOM.formulario.classList.remove('hidden');
        mostrarError('🔌 Error de conexión. Verifica tu internet.');
    } finally {
        isLoading = false;
        if (DOM.btnEnviar && !consultaActualId) {
            DOM.btnEnviar.disabled = false;
            DOM.btnEnviar.innerHTML = '<i class="fas fa-gavel"></i> Enviar consulta legal';
        }
    }
}

// ============================================
// FEEDBACK (rápido)
// ============================================
let feedbackUtil = null;

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
            if (graciasDiv) {
                graciasDiv.classList.remove('hidden');
                // Ocultar el contenedor de feedback después de 2 segundos
                setTimeout(() => {
                    if (DOM.feedback) DOM.feedback.classList.add('hidden');
                }, 2000);
            }
        }
    } catch (error) {
        console.error('Error en feedback:', error);
    }
}

// ============================================
// EVENTOS
// ============================================
if (DOM.btnEnviar) {
    DOM.btnEnviar.addEventListener('click', enviarConsulta);
}

if (DOM.consulta) {
    DOM.consulta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            enviarConsulta();
        }
    });
}

// Limpiar errores al hacer foco en campos
const camposNombre = document.getElementById('nombre');
const camposTelefono = document.getElementById('telefono');

if (camposNombre) {
    camposNombre.addEventListener('focus', () => {
        const errorDiv = document.getElementById('errorNombre');
        if (errorDiv) errorDiv.classList.remove('show');
        camposNombre.classList.remove('error');
    });
}

if (camposTelefono) {
    camposTelefono.addEventListener('focus', () => {
        const errorDiv = document.getElementById('errorTelefono');
        if (errorDiv) errorDiv.classList.remove('show');
        camposTelefono.classList.remove('error');
    });
}

if (DOM.consulta) {
    DOM.consulta.addEventListener('focus', () => {
        const errorDiv = document.getElementById('errorConsulta');
        if (errorDiv) errorDiv.classList.remove('show');
        DOM.consulta.classList.remove('error');
    });
}

// Feedback events
const feedbackSi = document.getElementById('feedbackSi');
const feedbackNo = document.getElementById('feedbackNo');
const btnEnviarFeedback = document.getElementById('btnEnviarFeedback');
const feedbackTexto = document.getElementById('feedbackTexto');
const feedbackTextoContainer = document.getElementById('feedbackTextoContainer');

if (feedbackSi) {
    feedbackSi.addEventListener('click', () => {
        feedbackUtil = true;
        if (feedbackTextoContainer) feedbackTextoContainer.classList.remove('hidden');
        if (feedbackTexto) {
            feedbackTexto.placeholder = '¿Qué fue lo más útil?';
            feedbackTexto.focus();
        }
    });
}

if (feedbackNo) {
    feedbackNo.addEventListener('click', () => {
        feedbackUtil = false;
        if (feedbackTextoContainer) feedbackTextoContainer.classList.remove('hidden');
        if (feedbackTexto) {
            feedbackTexto.placeholder = '¿Qué podríamos mejorar?';
            feedbackTexto.focus();
        }
    });
}

if (btnEnviarFeedback) {
    btnEnviarFeedback.addEventListener('click', () => {
        const texto = feedbackTexto ? feedbackTexto.value.trim() : '';
        enviarFeedback(feedbackUtil, texto);
        if (feedbackTexto) feedbackTexto.value = '';
        if (feedbackTextoContainer) feedbackTextoContainer.classList.add('hidden');
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================
loadSavedData();

console.log('✅ LEXIA_MX v7.0 - Optimizado');
console.log('✅ Validación de campos + toast');
console.log('✅ Feedback con colores de paleta');
console.log('✅ Respuesta con fondo azul claro');