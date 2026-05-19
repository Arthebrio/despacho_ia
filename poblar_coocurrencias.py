# scripts/poblar_coocurrencias.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.supabase_service import supabase_service
from collections import defaultdict
from itertools import combinations


def poblar_coocurrencias():
    supabase = supabase_service.get_client()
    
    # 1. Obtener todos los artículos
    print("📚 Obteniendo artículos...")
    response = supabase.table("articulos").select("id, atomos_semanticos").execute()
    articulos = response.data
    
    print(f"✅ {len(articulos)} artículos encontrados")
    
    # 2. Contar co-ocurrencias
    coocurrencias = defaultdict(int)
    articulos_sin_atomos = 0
    
    for articulo in articulos:
        atomos = articulo.get("atomos_semanticos", [])
        
        if not atomos or len(atomos) < 2:
            articulos_sin_atomos += 1
            continue
        
        # Generar todos los pares únicos de átomos
        for a1, a2 in combinations(sorted(set(atomos)), 2):
            par = (a1, a2)
            coocurrencias[par] += 1
    
    print(f"⚠️ Artículos sin átomos: {articulos_sin_atomos}")
    print(f"🔗 Pares únicos encontrados: {len(coocurrencias)}")
    
    # 3. Guardar en Supabase
    print("💾 Guardando co-ocurrencias...")
    
    datos_para_insertar = []
    for (a1, a2), frecuencia in coocurrencias.items():
        datos_para_insertar.append({
            "atomo_1": a1,
            "atomo_2": a2,
            "frecuencia": frecuencia
        })
    
    # Insertar en batches de 100 para evitar timeout
    batch_size = 100
    for i in range(0, len(datos_para_insertar), batch_size):
        batch = datos_para_insertar[i:i+batch_size]
        
        # Usar upsert para evitar duplicados
        response = supabase.table("coocurrencias_atomos").upsert(
            batch, 
            on_conflict="atomo_1, atomo_2"
        ).execute()
        
        print(f"   Procesados {min(i+batch_size, len(datos_para_insertar))}/{len(datos_para_insertar)}")
    
    print("\n✅ Tabla de co-ocurrencias poblada exitosamente")

if __name__ == "__main__":
    poblar_coocurrencias()