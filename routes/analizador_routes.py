# routes/analizador_routes.py
from flask import Blueprint, jsonify, request, render_template
from services.analizador_service import analizador_service

analizador_bp = Blueprint('analizador', __name__)


# ============================================
# RUTA PRINCIPAL (HTML)
# ============================================

@analizador_bp.route('/')
def index():
    """Sirve el frontend del analizador"""
    return render_template('analizador.html')


# ============================================
# ENDPOINTS PARA EXPORTACIÓN (frontend local)
# ============================================

@analizador_bp.route('/api/exportar/articulos', methods=['GET'])
def exportar_articulos():
    """
    Exporta TODOS los artículos para el frontend
    GET /analizador/api/exportar/articulos
    """
    try:
        data = analizador_service.exportar_articulos_json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@analizador_bp.route('/api/exportar/coocurrencias', methods=['GET'])
def exportar_coocurrencias():
    """
    Exporta el mapa de coocurrencias para el frontend
    GET /analizador/api/exportar/coocurrencias
    """
    try:
        mapa = analizador_service.exportar_coocurrencias_json()
        return jsonify(mapa)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@analizador_bp.route('/api/exportar/leyes', methods=['GET'])
def exportar_leyes():
    """
    Exporta lista de leyes para filtros
    GET /analizador/api/exportar/leyes
    """
    try:
        leyes = analizador_service.exportar_leyes_json()
        return jsonify({"leyes": leyes})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@analizador_bp.route('/api/exportar/todo', methods=['GET'])
def exportar_todo():
    """
    Exporta todo de una sola vez
    GET /analizador/api/exportar/todo
    """
    try:
        articulos = analizador_service.exportar_articulos_json()
        coocurrencias = analizador_service.exportar_coocurrencias_json()
        leyes = analizador_service.exportar_leyes_json()
        
        return jsonify({
            "articulos": articulos,
            "coocurrencias": coocurrencias,
            "leyes": leyes
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================
# ENDPOINTS DE RESPALDO (consulta individual)
# ============================================

@analizador_bp.route('/api/articulo/<int:id_articulo>', methods=['GET'])
def obtener_articulo(id_articulo):
    """
    Obtiene un artículo específico por ID
    GET /analizador/api/articulo/123
    """
    try:
        articulo = analizador_service.obtener_articulo_por_id(id_articulo)
        if not articulo:
            return jsonify({"error": "Artículo no encontrado"}), 404
        return jsonify(articulo)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================
# ENDPOINTS LEGACY (compatibilidad)
# ============================================

@analizador_bp.route('/api/buscar', methods=['GET'])
def buscar_por_concepto():
    """
    Búsqueda por concepto (legacy)
    GET /analizador/api/buscar?termino=tutela&ley=CCF
    """
    termino = request.args.get('termino', '').strip().lower()
    nombre_ley = request.args.get('ley', None)
    limit = request.args.get('limit', 100, type=int)
    
    if not termino:
        return jsonify({'error': 'Ingresa un término de búsqueda'}), 400
    
    if nombre_ley in ["todas", "null", "", None]:
        nombre_ley = None
    
    try:
        resultado = analizador_service.buscar_por_concepto(termino, nombre_ley, limit)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analizador_bp.route('/api/leyes', methods=['GET'])
def obtener_leyes_legacy():
    """Obtiene lista de leyes (legacy)"""
    try:
        leyes = analizador_service.exportar_leyes_json()
        return jsonify({'leyes': leyes})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
