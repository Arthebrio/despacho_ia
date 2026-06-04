# repositories/experimental_repository.py
from services.supabase_service import supabase_service
from datetime import datetime, timezone
import traceback

class ExperimentalRepository:
    """Repositorio simplificado - Una sola tabla: consultas_experimental"""
    
    def __init__(self):
        print("🚀 Inicializando ExperimentalRepository...")
        self.supabase = supabase_service.get_client()
        self.timezone = timezone.utc
        print("✅ Supabase cliente conectado")
    
    # ============================================
    # CONTROL DE ESPERA GLOBAL (5 minutos)
    # ============================================
    
    def verificar_ultima_consulta_por_telefono(self, telefono):
        """
        Verifica si pasaron al menos 5 minutos desde la última consulta del mismo teléfono
        Retorna: (permitido, segundos_restantes, mensaje)
        """
        try:
            print(f"⏰ Verificando tiempo para teléfono: {telefono}")
            
            TIEMPO_ESPERA_SEGUNDOS = 120  # 5 minutos global
            
            # Buscar última consulta de este teléfono
            response = self.supabase.table('consultas_experimental') \
                .select('created_at') \
                .eq('telefono_contacto', telefono) \
                .order('created_at', desc=True) \
                .limit(1) \
                .execute()
            
            if not response.data:
                print("✅ No hay consultas previas para este teléfono")
                return True, 0, "Primera consulta"
            
            ultima_consulta_str = response.data[0]['created_at']
            
            # Limpiar cadena
            if ultima_consulta_str.endswith('+00:00'):
                ultima_consulta_str = ultima_consulta_str.replace('+00:00', '')
            if ultima_consulta_str.endswith('Z'):
                ultima_consulta_str = ultima_consulta_str.replace('Z', '')
            
            ultima_consulta_utc = datetime.fromisoformat(ultima_consulta_str)
            ultima_consulta_utc = ultima_consulta_utc.replace(tzinfo=timezone.utc)
            
            ahora_utc = datetime.now(timezone.utc)
            diferencia_segundos = (ahora_utc - ultima_consulta_utc).total_seconds()
            
            print(f"⏱️ Han pasado {diferencia_segundos:.1f} segundos")
            
            if diferencia_segundos < TIEMPO_ESPERA_SEGUNDOS:
                segundos_restantes = int(TIEMPO_ESPERA_SEGUNDOS - diferencia_segundos)
                minutos_rest = segundos_restantes // 60
                seg_rest = segundos_restantes % 60
                mensaje = f"Nuestro abogado asistido de inteligencia artificial está analizando otra consulta. Te sugerimos esperar {minutos_rest} min {seg_rest} seg para una nueva consulta."
                print(f"❌ {mensaje}")
                return False, segundos_restantes, mensaje
            
            print("✅ Tiempo cumplido - Consulta permitida")
            return True, 0, "Tiempo cumplido - Puedes realizar tu consulta"
            
        except Exception as e:
            print(f"❌ Error: {e}")
            traceback.print_exc()
            return True, 0, "Error en verificación - Consulta permitida"
    
    # ============================================
    # GUARDAR CONSULTA (todo en una fila)
    # ============================================
    
    def guardar_consulta(self, datos_consulta):
        """Guarda la consulta completa con todos los campos"""
        try:
            print("💾 Guardando consulta en Supabase...")
            ahora = datetime.now(self.timezone)
            datos_consulta['created_at'] = ahora.isoformat()
            
            response = self.supabase.table('consultas_experimental').insert(datos_consulta).execute()
            
            if response.data:
                print(f"✅ Consulta guardada con ID: {response.data[0]['id']}")
                return response.data[0]
            else:
                print("❌ No se recibió respuesta")
                return None
        except Exception as e:
            print(f"❌ Error: {e}")
            traceback.print_exc()
            return None
    
    def guardar_feedback(self, consulta_id, respuesta_util, feedback_texto):
        """Guarda el feedback de una consulta"""
        try:
            print(f"💬 Guardando feedback para consulta ID: {consulta_id}")
            self.supabase.table('consultas_experimental') \
                .update({
                    'respuesta_util': respuesta_util,
                    'feedback_texto': feedback_texto
                }) \
                .eq('id', consulta_id) \
                .execute()
            print("✅ Feedback guardado")
            return True
        except Exception as e:
            print(f"❌ Error: {e}")
            return False


# Instancia global
print("🏗️ Creando instancia global de ExperimentalRepository...")
experimental_repository = ExperimentalRepository()
print("✅ ExperimentalRepository listo para usar")