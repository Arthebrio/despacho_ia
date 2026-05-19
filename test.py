from services.analizador_service import analizador_service

# Probar exportación de artículos
data = analizador_service.exportar_articulos_json()
print(f"📚 Artículos exportables: {data['total']}")

# Probar mapa de coocurrencias
mapa = analizador_service.exportar_coocurrencias_json()
print(f"🔗 Conceptos en el mapa: {len(mapa)}")
print(f"   Ejemplo 'tutela': {mapa.get('tutela', [])[:3]}")

# Probar leyes
leyes = analizador_service.exportar_leyes_json()
print(f"⚖️ Leyes: {leyes}")