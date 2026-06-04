/* ============================================
   buscador.js - Buscador difuso de conceptos
   Encuentra el nodo más parecido a la consulta del usuario
   Basado en el código funcional del visualizador
   ============================================ */

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Normaliza texto: minúsculas, sin acentos, solo caracteres alfanuméricos
 */
export function normalizarTexto(texto) {
    if (!texto) return '';
    return texto.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '');
}

/**
 * Escapa HTML para evitar inyección
 */
export function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Calcula distancia de Levenshtein entre dos cadenas
 */
export function levenshteinDistance(a, b) {
    const matrix = [];
    
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i-1) === a.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1,
                    matrix[i][j-1] + 1,
                    matrix[i-1][j] + 1
                );
            }
        }
    }
    
    return matrix[b.length][a.length];
}

/**
 * Calcula similitud entre dos cadenas (0-1)
 */
export function calcularSimilitud(a, b) {
    if (!a || !b) return 0;
    const normA = normalizarTexto(a);
    const normB = normalizarTexto(b);
    if (normA === normB) return 1;
    const maxLen = Math.max(normA.length, normB.length);
    if (maxLen === 0) return 0;
    const distancia = levenshteinDistance(normA, normB);
    return 1 - (distancia / maxLen);
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

/**
 * Encuentra el nodo más parecido a la consulta del usuario
 * @param {string} consulta - Texto ingresado por el usuario
 * @param {Array} grafosData - Array de nodos (GRAFOS_DATA)
 * @returns {Object|null} - El nodo más parecido o null si no hay datos
 */
export function encontrarConceptoMasCercano(consulta, grafosData) {
    if (!grafosData || grafosData.length === 0) return null;
    
    const consultaNorm = normalizarTexto(consulta);
    
    // Si la consulta está vacía o es muy corta, devolver el primer nodo
    if (!consultaNorm || consultaNorm.length < 2) {
        return grafosData[0];
    }
    
    let mejorNodo = null;
    let mejorPuntaje = -1;
    
    for (const nodo of grafosData) {
        // Textos a comparar
        const textos = [
            normalizarTexto(nodo.centro_label),
            normalizarTexto(nodo.texto_esfera || ''),
            normalizarTexto(nodo.label_corto || '')
        ].filter(t => t.length > 0);
        
        let puntajeMaximo = 0;
        
        for (const texto of textos) {
            let puntaje = 0;
            
            // 1. Coincidencia EXACTA (100 puntos)
            if (texto === consultaNorm) {
                puntaje = 100;
            }
            // 2. La consulta está CONTENIDA en el texto (90 puntos)
            else if (texto.includes(consultaNorm)) {
                puntaje = 90;
            }
            // 3. El texto está CONTENIDO en la consulta (80 puntos)
            else if (consultaNorm.includes(texto) && texto.length >= 3) {
                puntaje = 80;
            }
            // 4. Coincidencia por PALABRAS (70 puntos)
            else {
                const palabrasConsulta = consultaNorm.split(' ');
                for (const palabra of palabrasConsulta) {
                    if (palabra.length >= 3 && texto.includes(palabra)) {
                        puntaje = Math.max(puntaje, 70);
                    }
                }
            }
            
            // 5. Coincidencia por PREFIJO/SUFIJO (60 puntos) - ej: "mand" en "demanda"
            if (puntaje < 60 && consultaNorm.length >= 3) {
                if (texto.startsWith(consultaNorm) || texto.endsWith(consultaNorm)) {
                    puntaje = 60;
                }
                // Buscar coincidencia de primeras 3-4 letras
                const prefijo = consultaNorm.substring(0, Math.min(4, consultaNorm.length));
                if (texto.includes(prefijo) && prefijo.length >= 3) {
                    puntaje = Math.max(puntaje, 55);
                }
            }
            
            // 6. Coincidencia por LEVENSHTEIN (distancia de edición) - hasta 50 puntos
            if (puntaje < 50 && consultaNorm.length >= 3 && texto.length >= 3) {
                const distancia = levenshteinDistance(consultaNorm, texto);
                const maxLen = Math.max(consultaNorm.length, texto.length);
                const similitud = 1 - (distancia / maxLen);
                if (similitud > 0.4) {
                    puntaje = Math.floor(similitud * 50);
                }
            }
            
            puntajeMaximo = Math.max(puntajeMaximo, puntaje);
        }
        
        if (puntajeMaximo > mejorPuntaje) {
            mejorPuntaje = puntajeMaximo;
            mejorNodo = nodo;
        }
    }
    
    // Si por algún motivo no se encontró nada, devolver el primer nodo
    if (!mejorNodo && grafosData.length > 0) {
        mejorNodo = grafosData[0];
    }
    
    return { nodo: mejorNodo, puntaje: mejorPuntaje };
}

/**
 * Versión simplificada que solo devuelve el nodo (sin puntaje)
 */
export function encontrarConcepto(consulta, grafosData) {
    const resultado = encontrarConceptoMasCercano(consulta, grafosData);
    return resultado ? resultado.nodo : null;
}

/**
 * Obtiene los satélites enriquecidos de un nodo
 * @param {Object} nodo - El nodo central
 * @param {Array} grafosData - Array completo de nodos
 * @returns {Array} - Lista de satélites con metadata
 */
export function obtenerSatelitesEnriquecidos(nodo, grafosData) {
    if (!nodo || !grafosData) return [];
    
    const satelitesIds = nodo.satelites || [];
    
    const resultado = satelitesIds.map(sat => {
        const nodoSatelite = grafosData.find(n => n.id === sat.id);
        return {
            id: sat.id,
            label_corto: nodoSatelite ? nodoSatelite.texto_esfera : "Concepto",
            centro_label: nodoSatelite ? nodoSatelite.centro_label : "Concepto",
            capa: nodoSatelite ? nodoSatelite.capa : 'Media',
            peso: nodoSatelite ? nodoSatelite.peso : 5
        };
    }).sort((a, b) => (b.peso || 0) - (a.peso || 0));
    
    return resultado;
}

// ============================================
// EXPORTACIÓN POR DEFECTO
// ============================================
export default {
    normalizarTexto,
    escapeHtml,
    levenshteinDistance,
    calcularSimilitud,
    encontrarConceptoMasCercano,
    encontrarConcepto,
    obtenerSatelitesEnriquecidos
};