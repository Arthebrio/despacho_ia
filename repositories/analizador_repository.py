# repositories/analizador_repository.py
from services.supabase_service import supabase_service

class AnalizadorRepository:
    def __init__(self):
        self.supabase = supabase_service.get_client()
        self.table_articulos = "articulos"
        self.table_coocurrencias = "coocurrencias_atomos"
    
    def obtener_todos_articulos(self):
        """Obtiene TODOS los artículos con paginación automática"""
        todos = []
        offset = 0
        limite = 1000
        
        while True:
            response = self.supabase.table(self.table_articulos) \
                .select("*") \
                .range(offset, offset + limite - 1) \
                .execute()
            
            datos = response.data
            if not datos:
                break
            
            todos.extend(datos)
            offset += limite
            
            # Si devolvió menos del límite, es la última página
            if len(datos) < limite:
                break
        
        print(f"📚 Total artículos recuperados: {len(todos)}")
        return todos
    
    def obtener_todas_coocurrencias(self):
        """Obtiene TODAS las relaciones con paginación automática"""
        todos = []
        offset = 0
        limite = 1000
        
        while True:
            response = self.supabase.table(self.table_coocurrencias) \
                .select("atomo_1, atomo_2, frecuencia") \
                .range(offset, offset + limite - 1) \
                .execute()
            
            datos = response.data
            if not datos:
                break
            
            todos.extend(datos)
            offset += limite
            
            if len(datos) < limite:
                break
        
        print(f"🔗 Total relaciones recuperadas: {len(todos)}")
        return todos
    
    def obtener_leyes(self):
        """Obtiene lista única de nombres de leyes (con paginación)"""
        todos = []
        offset = 0
        limite = 1000
        
        while True:
            response = self.supabase.table(self.table_articulos) \
                .select("nombre_ley") \
                .range(offset, offset + limite - 1) \
                .execute()
            
            datos = response.data
            if not datos:
                break
            
            todos.extend(datos)
            offset += limite
            
            if len(datos) < limite:
                break
        
        # Extraer valores únicos, ignorar nulos/vacíos
        leyes = list(set([
            item["nombre_ley"] for item in todos 
            if item.get("nombre_ley") and item["nombre_ley"] not in ["", "null", None]
        ]))
        return sorted(leyes)
    
    def obtener_articulo_por_id(self, id_articulo: int):
        """Obtiene un artículo específico (sin paginación necesaria)"""
        response = self.supabase.table(self.table_articulos) \
            .select("*") \
            .eq("id", id_articulo) \
            .execute()
        return response.data[0] if response.data else None


analizador_repository = AnalizadorRepository()