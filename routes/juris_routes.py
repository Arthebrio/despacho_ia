# routes/juris_routes.py
from flask import Blueprint, render_template, request, jsonify
from services.jurisprudencia_service import jurisprudencia_service

juris_bp = Blueprint('juris', __name__)


@juris_bp.route('/')
def index():
    """Página principal del buscador de jurisprudencias"""
    return render_template('jurisprudencias.html')


@juris_bp.route('/api/todas')
def obtener_todas():
    """Obtiene todas las tesis (para listado inicial)"""
    try:
        tesis = jurisprudencia_service.obtener_todas()
        return jsonify({
            'success': True,
            'tesis': tesis,
            'total': len(tesis)
        })
    except Exception as e:
        print(f"❌ Error en obtener_todas: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@juris_bp.route('/api/detalle/<registro>')
def obtener_detalle(registro):
    """Obtiene el detalle completo de una tesis por su número de registro"""
    try:
        tesis = jurisprudencia_service.obtener_detalle(registro)
        return jsonify({
            'success': True,
            'tesis': tesis
        })
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 404
    except Exception as e:
        print(f"❌ Error en obtener_detalle: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500