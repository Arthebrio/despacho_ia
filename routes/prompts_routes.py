# routes/prompts_routes.py

from flask import Blueprint, render_template, request, jsonify
from services.openai_service import openai_service
from services.prompts_service import prompts_service

prompts_bp = Blueprint('prompts', __name__)

@prompts_bp.route('/')
def index():
    """Rinde la interfaz del Generador de Prompts (Corregido a prompts.html)"""
    return render_template('prompts.html')

@prompts_bp.route('/api/generate', methods=['POST'])
def generate_prompt():
    """Genera, almacena y devuelve un prompt estructurado mediante Inteligencia Artificial"""
    try:
        data = request.get_json() or {}
        # Captura segura soportando ambas variantes de llaves que puedan venir del frontend
        consulta = data.get('texto', data.get('consulta', '')).strip()
        
        if not consulta:
            return jsonify({'success': False, 'error': 'La descripción del caso jurídico está vacía'}), 400
            
        if len(consulta) < 15:
            return jsonify({'success': False, 'error': 'Análisis insuficiente. Describe el problema con al menos 15 caracteres.'}), 400
            
        # 1. Generar la estructura fina del prompt a través de OpenAI
        prompt_generado = openai_service.generate_legal_prompt(consulta)
        
        # 2. Persistencia asíncrona ligera en Supabase a través de nuestra arquitectura
        registro = prompts_service.guardar_prompt(consulta, prompt_generado)
        
        return jsonify({
            'success': True,
            'prompt': prompt_generado,
            'id': registro.get('id') if registro else None
        })
        
    except Exception as e:
        print(f"❌ Error en API generate_prompt: {e}")
        return jsonify({'success': False, 'error': 'Error interno al procesar el modelo de lenguaje jurídico'}), 500

@prompts_bp.route('/api/feedback', methods=['POST'])
def save_feedback():
    """Registra los comentarios o ajustes del abogado sobre el prompt de salida"""
    try:
        data = request.get_json() or {}
        id_registro = data.get('id')
        comentario = data.get('feedback', '').strip()
        
        if not id_registro or not comentario:
            return jsonify({'success': False, 'error': 'Parámetros e identificadores incompletos'}), 400
            
        prompts_service.actualizar_feedback(id_registro, comentario)
        return jsonify({'success': True, 'message': 'Retroalimentación guardada con éxito'})
        
    except Exception as e:
        print(f"❌ Error en API save_feedback: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500