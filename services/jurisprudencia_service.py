

# services/jurisprudencia_service.py


from repositories.jurisprudencia_repository import jurisprudencia_repository

class JurisprudenciaService:
    """Servicio para gestionar jurisprudencias"""
    
    def obtener_todas(self):
        """Obtiene todas las tesis"""
        try:
            return jurisprudencia_repository.obtener_todas()
        except Exception as e:
            raise Exception(f"Error al obtener tesis: {e}")
    
    def obtener_detalle(self, registro: int):
        """Obtiene el detalle completo de una tesis"""
        try:
            tesis = jurisprudencia_repository.obtener_por_registro(registro)
            if not tesis:
                raise ValueError(f"Tesis {registro} no encontrada")
            return tesis
        except Exception as e:
            raise Exception(f"Error al obtener detalle: {e}")

# Instancia global
jurisprudencia_service = JurisprudenciaService()