# repositories/jurisprudencia_repository.py

from services.supabase_service import supabase_service

class JurisprudenciaRepository:
    """Repositorio optimizado para la tabla jurisprudencias_xii_final"""
    
    def __init__(self):
        self.supabase = supabase_service.get_client()
        self.table_name = "jurisprudencias_xii_final"
    
    def obtener_todas(self):
        """
        Obtiene todas las tesis de forma ligera para el listado inicial.
        Ordena desde Supabase por Registro Digital de mayor a menor (desc=True)
        para previsualizar siempre lo más reciente primero.
        """
        try:
            todos = []
            offset = 0
            batch_size = 500
            
            while True:
                # 🌟 Corregido: Usamos desc=True que es el estándar de supabase-py en Python
                response = self.supabase.table(self.table_name) \
                    .select("id, registro_digital, tipo, materias, fecha_publicacion, fecha_normalizada, rubro, resumen_ia") \
                    .order("registro_digital", desc=True) \
                    .range(offset, offset + batch_size - 1) \
                    .execute()
                
                if not response.data:
                    break
                
                todos.extend(response.data)
                
                if len(response.data) < batch_size:
                    break
                
                offset += batch_size
            
            return todos
        except Exception as e:
            print(f"❌ Error obteniendo tesis en repositorio: {e}")
            raise e
    
    def obtener_por_registro(self, registro):
        """Obtiene el detalle pesado de una tesis por su número de registro digital (On Demand)"""
        try:
            response = self.supabase.table(self.table_name) \
                .select("*") \
                .eq("registro_digital", str(registro)) \
                .execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"❌ Error obtuvo detalle de tesis {registro}: {e}")
            raise e
    
    def obtener_por_id(self, id_tesis):
        """Obtiene una tesis completa por su ID interno de base de datos"""
        try:
            response = self.supabase.table(self.table_name) \
                .select("*") \
                .eq("id", id_tesis) \
                .execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"❌ Error obteniendo tesis por id: {e}")
            raise e


# ✅ Instancia global para el uso unificado en la capa de servicios
jurisprudencia_repository = JurisprudenciaRepository()