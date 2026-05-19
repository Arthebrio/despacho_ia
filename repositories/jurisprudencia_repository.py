

# repositories/jurisprudencia_repository.py


from services.supabase_service import supabase_service

class JurisprudenciaRepository:
    """Repositorio para la tabla jurisprudencias_xii_final"""
    
    def __init__(self):
        self.supabase = supabase_service.get_client()
        self.table_name = "jurisprudencias_xii_final"
    
    def obtener_todas(self):
        """Obtiene todas las tesis (con paginación para evitar límite de 1000)"""
        try:
            todos = []
            offset = 0
            batch_size = 500
            
            while True:
                response = self.supabase.table(self.table_name) \
                    .select("id, registro_digital, tipo, materias, fecha_publicacion, rubro, resumen_ia") \
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
            print(f"❌ Error obteniendo tesis: {e}")
            raise e
    
    def obtener_por_registro(self, registro):
        """Obtiene una tesis por su número de registro"""
        try:
            response = self.supabase.table(self.table_name) \
                .select("*") \
                .eq("registro_digital", str(registro)) \
                .execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"❌ Error obteniendo tesis {registro}: {e}")
            raise e
    
    def obtener_por_id(self, id_tesis):
        """Obtiene una tesis por su ID interno"""
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


# ✅ Instancia global (importante para que funcione la importación)
jurisprudencia_repository = JurisprudenciaRepository()