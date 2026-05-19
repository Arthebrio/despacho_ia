# services/experimental_service.py
from repositories.experimental_repository import experimental_repository
from core.config import config
from openai import OpenAI
import json

class ExperimentalService:
    """Servicio para el Abogado Virtual"""
    
    def __init__(self):
        self.openai = OpenAI(api_key=config.OPENAI.api_key)
        self.model = config.OPENAI.modelo_default
    
    # ============================================
    # CONTACTOS
    # ============================================
    
    def obtener_o_crear_contacto(self, nombre, telefono, ocupacion, estado, correo):
        contacto = experimental_repository.obtener_contacto_por_telefono(telefono)
        if contacto:
            return contacto
        return experimental_repository.crear_contacto(
            nombre, telefono, ocupacion, estado, correo
        )
    
    # ============================================
    # CONSULTAS A OPENAI
    # ============================================
    
    def _get_system_prompt(self):
        return """
Eres un abogado experto en derecho mexicano. Tu tarea es analizar consultas legales y devolver ÚNICAMENTE un objeto JSON con la siguiente estructura:

{
  "consulta_reformulada": "Reformulación clara y profesional del problema legal del usuario",
  "estado_animo": "tranquilo/preocupado/urgente/neutro",
  "calidad_consulta": "pobre/básica/detallada/excelente",
  "validez": "válida/no válida/parcialmente válida",
  "campo_derecho": "Civil/Penal/Laboral/Administrativo/Constitucional/Familiar/Mercantil/Amparo/Otro",
  "figura_juridica": "Nombre de la figura jurídica principal",
  "tipo_accion": "Tipo de acción legal recomendada",
  "legislacion_aplicable": "Leyes y artículos aplicables en México",
  "respuesta_usuario": "Respuesta profesional, clara y limitada (máximo 150 palabras)"
}

Reglas:
- NO incluyas texto fuera del JSON
- Responde en español
"""
    
    def consultar_openai(self, consulta_usuario):
        try:
            response = self.openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": consulta_usuario}
                ],
                temperature=0.3,
                max_tokens=800
            )
            
            contenido = response.choices[0].message.content
            tokens = response.usage.total_tokens
            
            contenido = contenido.replace('```json', '').replace('```', '').strip()
            analisis = json.loads(contenido)
            analisis['tokens_consumidos'] = tokens
            
            return analisis
        except Exception as e:
            print(f"Error en OpenAI: {e}")
            return self._get_fallback_response(consulta_usuario)
    
    def _get_fallback_response(self, consulta_usuario):
        return {
            'consulta_reformulada': consulta_usuario,
            'estado_animo': 'neutro',
            'calidad_consulta': 'básica',
            'validez': 'válida',
            'campo_derecho': 'General',
            'figura_juridica': 'No determinada',
            'tipo_accion': 'Consultar con abogado',
            'legislacion_aplicable': 'Legislación mexicana aplicable',
            'respuesta_usuario': 'Gracias por tu consulta. Nuestro abogado virtual está en entrenamiento. Te recomendamos acudir con un abogado especializado.',
            'tokens_consumidos': 0
        }
    
    # ============================================
    # PROCESAMIENTO COMPLETO
    # ============================================
    
    def procesar_consulta(self, nombre, telefono, consulta, ocupacion, estado, correo):
        # 1. Contacto
        contacto = self.obtener_o_crear_contacto(nombre, telefono, ocupacion, estado, correo)
        if not contacto:
            return {'success': False, 'error': 'Error al registrar usuario'}
        
        # 2. Límite diario
        if not experimental_repository.verificar_limite_diario(contacto['id']):
            return {
                'success': False,
                'error': 'Ya usaste tu consulta de hoy. Vuelve mañana.'
            }
        
        # 3. Consultar OpenAI
        try:
            analisis = self.consultar_openai(consulta)
        except Exception as e:
            return {'success': False, 'error': f'Error del motor de IA: {str(e)}'}
        
        # 4. Guardar
        consulta_guardada = experimental_repository.guardar_consulta(
            contacto_id=contacto['id'],
            consulta_usuario=consulta,
            consulta_reformulada=analisis.get('consulta_reformulada', ''),
            analisis_interno={
                'estado_animo': analisis.get('estado_animo'),
                'calidad_consulta': analisis.get('calidad_consulta'),
                'validez': analisis.get('validez'),
                'campo_derecho': analisis.get('campo_derecho'),
                'figura_juridica': analisis.get('figura_juridica'),
                'tipo_accion': analisis.get('tipo_accion'),
                'legislacion_aplicable': analisis.get('legislacion_aplicable')
            },
            respuesta_usuario=analisis.get('respuesta_usuario', ''),
            tokens_consumidos=analisis.get('tokens_consumidos', 0)
        )
        
        if not consulta_guardada:
            return {'success': False, 'error': 'Error al guardar la consulta'}
        
        return {
            'success': True,
            'respuesta': analisis.get('respuesta_usuario', ''),
            'consulta_id': consulta_guardada['id']
        }


experimental_service = ExperimentalService()