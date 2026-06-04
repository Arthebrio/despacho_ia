import os
import json
import time
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase = create_client(url, key)

# Cargar tu archivo JSON
with open('grafos_amparo_rows (2).json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"📦 Cargando {len(data)} registros...")

for i, row in enumerate(data, 1):
    # Convertir satelites de string a objeto JSON si es necesario
    satelites = row['satelites']
    if isinstance(satelites, str):
        satelites = json.loads(satelites)
    
    supabase.table('grafos_amparo').upsert({
        'id': row['id'],
        'centro_id': row['centro_id'],
        'centro_label': row['centro_label'],
        'satelites': satelites,
        'label_corto': row['label_corto'],
        'created_at': row['created_at']
    }, on_conflict='id').execute()
    
    print(f"✅ {i}/193: {row['centro_label']} → {row['label_corto']}")
    time.sleep(0.05)

print("🎉 ¡Carga completada!")