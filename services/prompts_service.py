

# services/prompts_service.py


from supabase import create_client
from core.config import config

class PromptsService:
    """Servicio para gestionar prompts generados en Supabase"""
    
    def __init__(self):
        self.supabase = create_client(config.SUPABASE.url, config.SUPABASE.key)
        self.table_name = "prompts_generados"
    
    def guardar_prompt(self, consulta: str, prompt: str):
        """Guarda la consulta y el prompt generado en Supabase"""
        try:
            data = {
                "usuario_consulta": consulta,
                "prompt_generado": prompt
            }
            response = self.supabase.table(self.table_name).insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"❌ Error guardando prompt: {e}")
            raise e
    
    def actualizar_feedback(self, id_registro: int, feedback: str):
        """Actualiza el feedback de un prompt existente"""
        try:
            self.supabase.table(self.table_name) \
                .update({"feedback": feedback}) \
                .eq("id", id_registro) \
                .execute()
            return True
        except Exception as e:
            print(f"❌ Error actualizando feedback: {e}")
            raise e

# Instancia global
prompts_service = PromptsService()