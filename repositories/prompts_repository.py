# repositories/prompts_repository.py

from services.supabase_service import supabase_service

class PromptsRepository:
    """Capa de persistencia unificada para la tabla prompts_generados"""
    
    def __init__(self):
        self.supabase = supabase_service.get_client()
        self.table_name = "prompts_generados"
        
    def guardar(self, consulta: str, prompt: str):
        """Inserta el prompt generado utilizando el pool unificado de conexiones"""
        try:
            data = {
                "usuario_consulta": consulta,
                "prompt_generado": prompt
            }
            response = self.supabase.table(self.table_name).insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"❌ Error en PromptsRepository.guardar: {e}")
            raise e
            
    def actualizar_feedback(self, id_registro: int, feedback: str):
        """Actualiza la columna de feedback de un registro específico por su ID"""
        try:
            self.supabase.table(self.table_name) \
                .update({"feedback": feedback}) \
                .eq("id", id_registro) \
                .execute()
            return True
        except Exception as e:
            print(f"❌ Error en PromptsRepository.actualizar_feedback: {e}")
            raise e

# ✅ Instancia global unificada para el uso en la capa de servicios
prompts_repository = PromptsRepository()