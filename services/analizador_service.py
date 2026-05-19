# services/analizador_service.py
from repositories.analizador_repository import analizador_repository

class AnalizadorService:
    
    def exportar_articulos_json(self):
        """Obtiene todos los artículos para exportar al frontend"""
        articulos = analizador_repository.obtener_todos_articulos()
        
        # Estructurar para fácil consumo en frontend
        return {
            "total": len(articulos),
            "articulos": articulos,
            "ultima_actualizacion": "2026-05-18"  # Podrías agregar lógica real
        }
    
    def exportar_coocurrencias_json(self):
        """Estructura las coocurrencias para búsqueda rápida en frontend"""
        relaciones = analizador_repository.obtener_todas_coocurrencias()
        
        # Diccionario: concepto -> lista de relacionados
        mapa = {}
        for row in relaciones:
            a1 = row["atomo_1"]
            a2 = row["atomo_2"]
            freq = row["frecuencia"]
            
            # Dirección a1 -> a2
            if a1 not in mapa:
                mapa[a1] = []
            mapa[a1].append({"concepto": a2, "frecuencia": freq})
            
            # Dirección a2 -> a1 (relación simétrica)
            if a2 not in mapa:
                mapa[a2] = []
            mapa[a2].append({"concepto": a1, "frecuencia": freq})
        
        # Ordenar cada lista por frecuencia (descendente)
        for concepto in mapa:
            mapa[concepto].sort(key=lambda x: x["frecuencia"], reverse=True)
        
        return mapa
    
    def exportar_leyes_json(self):
        """Obtiene lista de leyes para filtros"""
        return analizador_repository.obtener_leyes()
    
    def obtener_articulo_por_id(self, id_articulo: int):
        """Respaldo: obtener artículo individual"""
        return analizador_repository.obtener_articulo_por_id(id_articulo)


analizador_service = AnalizadorService()