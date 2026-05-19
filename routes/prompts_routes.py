# routes/prompts_routes.py
from flask import Blueprint, render_template, request, jsonify
from services.openai_service import openai_service
from services.prompts_service import prompts_service

prompts_bp = Blueprint('prompts', __name__)


@prompts_bp.route('/')
def index():
    """Página principal del Generador de Prompts"""
    return render_template('generador.html')


@prompts_bp.route('/api/generate', methods=['POST'])
def generate_prompt():
    """
    Genera un prompt jurídico a partir de una consulta del usuario
    POST /api/prompts/generate
    Body: { "texto": "descripción del caso" }
    """
    try:
        data = request.get_json()
        consulta = data.get('texto', data.get('consulta', '')).strip()
        
        if not consulta:
            return jsonify({'success': False, 'error': 'La consulta está vacía'}), 400
        
        if len(consulta) < 15:
            return jsonify({'success': False, 'error': 'Mínimo 15 caracteres'}), 400
        
        # Generar prompt con OpenAI
        prompt_generado = openai_service.generate_legal_prompt(consulta)
        
        # Guardar en Supabase (tabla prompts_generados)
        registro = prompts_service.guardar_prompt(consulta, prompt_generado)
        
        return jsonify({
            'success': True,
            'prompt': prompt_generado,
            'id': registro.get('id') if registro else None
        })
        
    except Exception as e:
        print(f"❌ Error en generate_prompt: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@prompts_bp.route('/api/feedback', methods=['POST'])
def save_feedback():
    """
    Guarda feedback del usuario sobre un prompt generado
    POST /api/prompts/feedback
    Body: { "id": 123, "feedback": "comentario" }
    """
    try:
        data = request.get_json()
        id_registro = data.get('id')
        comentario = data.get('feedback', '').strip()
        
        if not id_registro or not comentario:
            return jsonify({'success': False, 'error': 'Datos incompletos'}), 400
        
        prompts_service.actualizar_feedback(id_registro, comentario)
        
        return jsonify({'success': True, 'message': 'Feedback guardado'})
        
    except Exception as e:
        print(f"❌ Error en save_feedback: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500