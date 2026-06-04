# services/experimental_service.py
from repositories.experimental_repository import experimental_repository
from core.config import config
from openai import OpenAI
import json
import os
import traceback

class ExperimentalService:
    """Servicio para el Abogado Virtual con IA"""
    
    def __init__(self):
        print("🚀 Inicializando ExperimentalService...")
        try:
            self.openai = OpenAI(api_key=config.OPENAI.api_key)
            self.model = config.OPENAI.modelo_default
            print(f"✅ OpenAI configurado - Modelo: {self.model}")
        except Exception as e:
            print(f"❌ Error configurando OpenAI: {e}")
            traceback.print_exc()
            raise
    
    # ============================================
    # MANEJO DEL PROMPT (desde archivo externo)
    # ============================================
    
    def _get_system_prompt(self):
        """Carga el prompt desde archivo externo en core/prompts/legal_prompt.txt"""
        prompt_path = os.path.join('core', 'prompts', 'legal_prompt.txt')
        try:
            with open(prompt_path, 'r', encoding='utf-8') as f:
                prompt = f.read()
                print(f"📝 Prompt cargado desde: {prompt_path}")
                return prompt
        except FileNotFoundError:
            print(f"⚠️ Archivo no encontrado en: {prompt_path}")
            return self._get_default_prompt()
        except Exception as e:
            print(f"❌ Error cargando prompt: {e}")
            return self._get_default_prompt()
    
    def _get_default_prompt(self):
        """Prompt por defecto en caso de error"""
        return """Eres un asistente jurídico experto en derecho mexicano.
Responde ÚNICAMENTE con un objeto JSON válido. NO incluyas texto fuera del JSON.

{
  "hechos_reconstruidos": "Descripción clara y ordenada de los hechos",
  "materia_principal": "Civil | Penal | Laboral | Familiar | Mercantil",
  "figura_juridica": "Ej: Contrato, Despido, Divorcio",
  "tipo_accion": "Ej: Demanda, Denuncia, Amparo",
  "pruebas_sugeridas": ["Prueba 1", "Prueba 2"],
  "riesgos": ["1. Riesgo: descripción"],
  "legislacion_aplicable": "Leyes aplicables en México",
  "respuesta_usuario": "Respuesta clara y empática (máximo 200 palabras)",
  "datos_faltantes": ["Dato faltante 1"],
  "estado_emergencia": false
}"""
    
    # ============================================
    # CONSULTA A OPENAI
    # ============================================
    
    def consultar_openai(self, consulta_usuario, estado_usuario, perfil_usuario):
        """Envía consulta a OpenAI con el prompt desde archivo externo"""
        try:
            print("🤖 Enviando consulta a OpenAI...")
            print(f"📝 Estado: {estado_usuario}, Perfil: {perfil_usuario}")
            
            # Construir mensaje enriquecido con contexto del usuario
            mensaje_usuario = f"""
Perfil del usuario: {perfil_usuario}
Estado de la república: {estado_usuario}

Consulta legal: {consulta_usuario}

Por favor, particulariza la respuesta según el estado {estado_usuario} y el perfil {perfil_usuario}.
"""
            
            response = self.openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": mensaje_usuario}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            contenido = response.choices[0].message.content
            tokens_consumidos = response.usage.total_tokens
            
            print(f"✅ OpenAI respondió - Tokens: {tokens_consumidos}")
            
            # Limpiar y parsear JSON
            contenido = contenido.replace('```json', '').replace('```', '').strip()
            
            try:
                analisis = json.loads(contenido)
                print("✅ JSON parseado correctamente")
            except json.JSONDecodeError as e:
                print(f"⚠️ Error parseando JSON: {e}")
                print(f"Contenido recibido: {contenido[:300]}...")
                analisis = self._get_fallback_response()
            
            # Agregar metadatos
            analisis['tokens_consumidos'] = tokens_consumidos
            
            # Calcular costo estimado (GPT-4o-mini: ~$0.00015/1K tokens)
            costo_usd = (tokens_consumidos / 1000) * 0.00015
            costo_mxn = costo_usd * 20  # Tipo de cambio aproximado
            analisis['costo_estimado_mxn'] = round(costo_mxn, 6)
            
            return analisis
            
        except Exception as e:
            print(f"❌ Error CRÍTICO en consultar_openai: {e}")
            traceback.print_exc()
            return self._get_fallback_response()
    
    def _get_fallback_response(self):
        """Respuesta de emergencia si OpenAI falla"""
        print("🔄 Usando respuesta de fallback")
        return {
            "hechos_reconstruidos": "No se pudieron reconstruir los hechos automáticamente",
            "materia_principal": "NO PROPORCIONADO",
            "figura_juridica": "NO PROPORCIONADO",
            "tipo_accion": "Consultar con abogado presencial",
            "pruebas_sugeridas": [],
            "riesgos": ["1. El sistema no pudo completar el análisis automático"],
            "legislacion_aplicable": "Consultar con abogado especialista",
            "respuesta_usuario": "Lo sentimos, nuestro sistema está experimentando problemas técnicos. Por favor, intenta de nuevo en unos minutos. Si el problema persiste, contacta a un abogado directamente.\n\nEsta orientación no sustituye la asesoría de un abogado.",
            "datos_faltantes": ["No se pudo procesar la consulta automáticamente"],
            "estado_emergencia": False,
            "tokens_consumidos": 0,
            "costo_estimado_mxn": 0
        }
    
    # ============================================
    # PROCESAMIENTO COMPLETO
    # ============================================
    
    def procesar_consulta(self, nombre, telefono, consulta, perfil_usuario, estado, correo, ip_usuario):
        """
        Procesa la consulta completa:
        1. Verifica límite de 5 minutos por teléfono
        2. Consulta a OpenAI
        3. Guarda directamente en Supabase (sin tabla contactos)
        """
        print("\n" + "="*50)
        print("🆕 NUEVA CONSULTA RECIBIDA")
        print("="*50)
        print(f"👤 Usuario: {nombre} ({telefono})")
        print(f"📋 Perfil: {perfil_usuario}")
        print(f"📍 Estado: {estado}")
        print(f"🌐 IP: {ip_usuario}")
        print(f"🔍 PERFIL RECIBIDO EN SERVICE: '{perfil_usuario}'")
        print(f"🔍 ESTADO RECIBIDO EN SERVICE: '{estado}'")
        
        # 1. Verificar límite por teléfono (5 minutos global)
        
        print("\n⏰ Verificando tiempo desde última consulta...")
        permitido, segundos_restantes, mensaje = experimental_repository.verificar_ultima_consulta_por_telefono(telefono)
        
        if not permitido:
            print(f"❌ Consulta RECHAZADA: {mensaje}")
            return {
                'success': False, 
                'error': mensaje,
                'tiempo_espera': segundos_restantes
            }
        
        print("✅ Tiempo verificado - Consulta permitida")
        
        # 2. Consultar OpenAI
        print("\n🤖 Llamando a OpenAI...")
        try:
            analisis = self.consultar_openai(consulta, estado, perfil_usuario)
            print("✅ OpenAI respondió exitosamente")
        except Exception as e:
            print(f"❌ Error en OpenAI: {e}")
            traceback.print_exc()
            return {'success': False, 'error': f'Error del motor de IA: {str(e)}'}
        
        # 3. Extraer respuesta para usuario
        respuesta_para_usuario = analisis.get('respuesta_usuario', 'No se pudo generar una respuesta.')
        print(f"📤 Respuesta generada ({len(respuesta_para_usuario)} caracteres)")
        
        # 4. Guardar en Supabase (TODO EN UNA SOLA TABLA)
        print("\n💾 Guardando en Supabase...")
        datos_guardar = {
            'nombre_usuario': nombre,
            'telefono_contacto': telefono,
            'correo_usuario': correo if correo else None,
            'perfil_usuario': perfil_usuario,
            'estado': estado,
            'ip_usuario': ip_usuario,
            'consulta_usuario': consulta,
            'hechos_reconstruidos': analisis.get('hechos_reconstruidos', ''),
            'materia_principal': analisis.get('materia_principal', ''),
            'figura_juridica': analisis.get('figura_juridica', ''),
            'tipo_accion': analisis.get('tipo_accion', ''),
            'pruebas_sugeridas': analisis.get('pruebas_sugeridas', []),
            'riesgos': analisis.get('riesgos', []),
            'legislacion_aplicable': analisis.get('legislacion_aplicable', ''),
            'respuesta_usuario': respuesta_para_usuario,
            'datos_faltantes': analisis.get('datos_faltantes', []),
            'estado_emergencia': analisis.get('estado_emergencia', False),
            'tokens_consumidos': analisis.get('tokens_consumidos', 0),
            'costo_estimado_mxn': analisis.get('costo_estimado_mxn', 0)
        }
        
        consulta_guardada = experimental_repository.guardar_consulta(datos_guardar)
        
        if not consulta_guardada:
            print("❌ Error: No se pudo guardar la consulta en BD")
            return {'success': False, 'error': 'Error al guardar la consulta'}
        
        print(f"✅ Consulta guardada - ID: {consulta_guardada['id']}")
        print(f"💰 Costo estimado: ${analisis.get('costo_estimado_mxn', 0)} MXN")
        print("="*50 + "\n")
        
        # 5. Devolver respuesta exitosa
        return {
            'success': True,
            'respuesta': respuesta_para_usuario,
            'consulta_id': consulta_guardada['id'],
            'tokens_usados': analisis.get('tokens_consumidos', 0),
            'costo_estimado': analisis.get('costo_estimado_mxn', 0)
        }


# Instancia global
print("🏗️ Creando instancia global de ExperimentalService...")
experimental_service = ExperimentalService()
print("✅ ExperimentalService listo para usar")