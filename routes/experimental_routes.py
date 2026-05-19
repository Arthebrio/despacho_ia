# routes/experimental_routes.py
from flask import Blueprint, render_template, request, jsonify
from services.experimental_service import experimental_service
from repositories.experimental_repository import experimental_repository

experimental_bp = Blueprint('experimental', __name__)


@experimental_bp.route('/')
def index():
    return render_template('experimental.html')


@experimental_bp.route('/api/consultar', methods=['POST'])
def consultar():
    try:
        data = request.get_json()
        
        nombre = data.get('nombre', '').strip()
        telefono = data.get('telefono', '').strip()
        consulta = data.get('consulta', '').strip()
        ocupacion = data.get('ocupacion', '')
        estado = data.get('estado', '')
        correo = data.get('correo', '')
        
        if not nombre:
            return jsonify({'success': False, 'error': 'El nombre es requerido'}), 400
        
        if not telefono or len(telefono) != 10:
            return jsonify({'success': False, 'error': 'El teléfono debe tener 10 dígitos'}), 400
        
        if not consulta or len(consulta) < 20:
            return jsonify({'success': False, 'error': 'La consulta debe tener al menos 20 caracteres'}), 400
        
        resultado = experimental_service.procesar_consulta(
            nombre, telefono, consulta, ocupacion, estado, correo
        )
        
        return jsonify(resultado)
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@experimental_bp.route('/api/feedback', methods=['POST'])
def feedback():
    try:
        data = request.get_json()
        consulta_id = data.get('consulta_id')
        respuesta_util = data.get('respuesta_util')
        feedback_texto = data.get('feedback_texto')
        
        if not consulta_id:
            return jsonify({'success': False, 'error': 'ID requerido'}), 400
        
        experimental_repository.guardar_feedback(consulta_id, respuesta_util, feedback_texto)
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500