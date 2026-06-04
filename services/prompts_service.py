# services/prompts_service.py

from repositories.prompts_repository import prompts_repository

class PromptsService:
    """Servicio encargado de gestionar la lógica de negocio de los prompts jurídicos"""
    
    def guardar_prompt(self, consulta: str, prompt: str):
        """Valida e instruye el guardado del prompt en el repositorio"""
        try:
            return prompts_repository.guardar(consulta, prompt)
        except Exception as e:
            raise Exception(f"Error al procesar el guardado del prompt: {e}")
            
    def actualizar_feedback(self, id_registro: int, feedback: str):
        """Valida e instruye la actualización del comentario del usuario"""
        try:
            return prompts_repository.actualizar_feedback(id_registro, feedback)
        except Exception as e:
            raise Exception(f"Error al registrar la retroalimentación: {e}")

# ✅ Instancia global para consumo en las rutas correspondientes
prompts_service = PromptsService()