// ========== DOM Elements ==========
const DOM = {
    btnGenerar: document.getElementById('btnGenerar'),
    consulta: document.getElementById('consulta'),
    charCount: document.getElementById('charCount'),
    promptTexto: document.getElementById('promptTexto'),
    resultado: document.getElementById('resultado'),
    loading: document.getElementById('loading'),
    btnFeedback: document.getElementById('btnEnviarFeedback'),
    inputFeedback: document.getElementById('inputFeedback'),
    feedbackMsg: document.getElementById('msgFeedbackOk'),
    btnCopiar: document.getElementById('btnCopiar')
};

let currentPromptId = null;
let progressInterval = null;

// ========== Progress Bar ==========
function startProgress() {
    const container = document.getElementById('progressContainer');
    const bar = document.getElementById('progressBar');
    if (!container || !bar) return;
    
    container.style.display = 'block';
    bar.style.width = '0%';
    
    let width = 0;
    progressInterval = setInterval(() => {
        if (width < 85) {
            width += Math.random() * 8;
            if (width > 85) width = 85;
            bar.style.width = `${width}%`;
        }
    }, 200);
}

function completeProgress() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    const bar = document.getElementById('progressBar');
    const container = document.getElementById('progressContainer');
    if (bar) {
        bar.style.width = '100%';
        setTimeout(() => {
            if (container) container.style.display = 'none';
            if (bar) bar.style.width = '0%';
        }, 400);
    }
}

function resetProgress() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    const container = document.getElementById('progressContainer');
    if (container) container.style.display = 'none';
}

// ========== Toast (sin colores agresivos) ==========
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = '';
    switch(type) {
        case 'warning': icon = '⚠️ '; break;
        case 'error': icon = '✗ '; break;
        case 'success': icon = '✓ '; break;
        default: icon = '● ';
    }
    
    toast.textContent = icon + message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

// ========== Helpers ==========
function updateCharCount() {
    const len = DOM.consulta.value.length;
    DOM.charCount.textContent = `${len} caracteres`;
    if (len < 15 && len > 0) {
        DOM.charCount.classList.add('warning');
    } else {
        DOM.charCount.classList.remove('warning');
    }
}

function copyToClipboard() {
    const text = DOM.promptTexto.textContent;
    if (!text || text.trim() === '') {
        showToast('No hay prompt para copiar', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = DOM.btnCopiar.innerHTML;
        DOM.btnCopiar.innerHTML = '<i class="fas fa-check"></i> COPIADO';
        setTimeout(() => {
            DOM.btnCopiar.innerHTML = originalHTML;
        }, 2000);
        showToast('Prompt copiado', 'success');
    }).catch(() => {
        showToast('Error al copiar', 'error');
    });
}

function resetFeedbackUI() {
    if (DOM.btnFeedback) {
        DOM.btnFeedback.disabled = false;
        DOM.btnFeedback.textContent = 'Guardar Feedback';
    }
    if (DOM.feedbackMsg) DOM.feedbackMsg.classList.remove('show');
    if (DOM.inputFeedback) DOM.inputFeedback.value = '';
}

// ========== API Calls ==========
async function generatePrompt() {
    const consulta = DOM.consulta.value.trim();
    
    if (consulta.length < 15) {
        showToast('Describe el caso con al menos 15 caracteres', 'warning');
        return;
    }
    
    if (consulta.length > 5000) {
        showToast('Descripción muy larga (máximo 5000 caracteres)', 'warning');
        return;
    }
    
    // UI Loading
    DOM.loading.classList.remove('hidden');
    DOM.resultado.classList.add('hidden');
    DOM.btnGenerar.disabled = true;
    startProgress();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
        const response = await fetch('/prompts/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: consulta }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || `Error ${response.status}`);
        if (!data.success) throw new Error(data.error || 'Error desconocido');
        
        // Éxito
        DOM.promptTexto.textContent = data.prompt;
        currentPromptId = data.id;
        
        completeProgress();
        DOM.loading.classList.add('hidden');
        DOM.resultado.classList.remove('hidden');
        resetFeedbackUI();
        DOM.resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Prompt generado correctamente', 'success');
        
    } catch (error) {
        resetProgress();
        DOM.loading.classList.add('hidden');
        
        if (error.name === 'AbortError') {
            showToast('Tiempo de espera agotado', 'error');
        } else {
            showToast(error.message, 'error');
        }
        console.error('Generate error:', error);
    } finally {
        DOM.btnGenerar.disabled = false;
    }
}

async function saveFeedback() {
    const comentario = DOM.inputFeedback.value.trim();
    
    if (!comentario) {
        showToast('Escribe un comentario antes de guardar', 'warning');
        return;
    }
    
    if (!currentPromptId) {
        showToast('No hay un prompt activo', 'error');
        return;
    }
    
    DOM.btnFeedback.disabled = true;
    DOM.btnFeedback.textContent = 'Enviando...';
    
    try {
        const response = await fetch('/prompts/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentPromptId, feedback: comentario })
        });
        
        const data = await response.json();
        
        if (!data.success) throw new Error(data.error || 'Error al guardar');
        
        DOM.feedbackMsg.classList.add('show');
        DOM.btnFeedback.textContent = '✓ Guardado';
        showToast('Comentario registrado', 'success');
        
        setTimeout(() => {
            DOM.feedbackMsg.classList.remove('show');
        }, 3000);
        
    } catch (error) {
        showToast(error.message, 'error');
        DOM.btnFeedback.disabled = false;
        DOM.btnFeedback.textContent = 'Reintentar';
    }
}

// ========== Event Listeners ==========
function bindEvents() {
    if (DOM.consulta) DOM.consulta.addEventListener('input', updateCharCount);
    if (DOM.btnGenerar) DOM.btnGenerar.addEventListener('click', generatePrompt);
    if (DOM.btnCopiar) DOM.btnCopiar.addEventListener('click', copyToClipboard);
    if (DOM.btnFeedback) DOM.btnFeedback.addEventListener('click', saveFeedback);
    
    // Ctrl+Enter para generar
    if (DOM.consulta) {
        DOM.consulta.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                DOM.btnGenerar.click();
            }
        });
    }
}

// ========== Tooltip Ctrl+Enter ==========
function addShortcutHint() {
    if (!DOM.consulta) return;
    
    // Evitar duplicados
    if (document.querySelector('.shortcut-hint')) return;
    
    const hint = document.createElement('small');
    hint.className = 'shortcut-hint';
    hint.textContent = '⌨️ Ctrl+Enter para generar';
    hint.style.display = 'block';
    hint.style.marginTop = '0.5rem';
    hint.style.fontSize = '0.7rem';
    hint.style.color = '#64748b';
    DOM.consulta.parentNode.appendChild(hint);
}

// ========== Initialization ==========
document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    updateCharCount();
    addShortcutHint();
});