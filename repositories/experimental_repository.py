# repositories/experimental_repository.py
from services.supabase_service import supabase_service
from datetime import datetime

class ExperimentalRepository:
    """Repositorio para el Espacio Experimental"""
    
    def __init__(self):
        self.supabase = supabase_service.get_client()
    
    # ============================================
    # CONTACTOS
    # ============================================
    
    def obtener_contacto_por_telefono(self, telefono):
        """Obtiene un contacto por su teléfono"""
        try:
            response = self.supabase.table('contactos') \
                .select('*') \
                .eq('telefono', telefono) \
                .execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    def crear_contacto(self, nombre, telefono, ocupacion, estado, correo):
        """Crea un nuevo contacto"""
        try:
            data = {
                'nombre': nombre,
                'telefono': telefono,
                'ocupacion': ocupacion,
                'estado': estado,
                'correo': correo if correo else None,
                'created_at': datetime.now().isoformat()
            }
            response = self.supabase.table('contactos').insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    # ============================================
    # CONSULTAS
    # ============================================
    
    def verificar_limite_diario(self, contacto_id):
        """Verifica si el usuario ya usó su consulta hoy (1 por día)"""
        try:
            response = self.supabase.table('consultas_experimental') \
                .select('id', count='exact') \
                .eq('contacto_id', contacto_id) \
                .gte('created_at', 'now()::date') \
                .execute()
            return response.count < 1
        except Exception as e:
            print(f"Error: {e}")
            return True
    
    def guardar_consulta(self, contacto_id, consulta_usuario, consulta_reformulada, 
                         analisis_interno, respuesta_usuario, tokens_consumidos):
        """Guarda una consulta en la base de datos"""
        try:
            data = {
                'contacto_id': contacto_id,
                'consulta_usuario': consulta_usuario,
                'consulta_reformulada': consulta_reformulada,
                'analisis_interno': analisis_interno,
                'respuesta_usuario': respuesta_usuario,
                'tokens_consumidos': tokens_consumidos,
                'created_at': datetime.now().isoformat()
            }
            response = self.supabase.table('consultas_experimental').insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    def guardar_feedback(self, consulta_id, respuesta_util, feedback_texto):
        """Guarda el feedback de una consulta"""
        try:
            self.supabase.table('consultas_experimental') \
                .update({
                    'respuesta_util': respuesta_util,
                    'feedback_texto': feedback_texto
                }) \
                .eq('id', consulta_id) \
                .execute()
            return True
        except Exception as e:
            print(f"Error: {e}")
            return False


# Instancia global
experimental_repository = ExperimentalRepository()