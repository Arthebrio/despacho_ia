"""
exportar_consultas.py - Exporta las consultas del Experimental a Markdown
Ejecutar: python exportar_consultas.py
"""

from supabase import create_client
from core.config import config
from datetime import datetime

def exportar_consultas():
    print("\n📊 Conectando a Supabase...")
    supabase = create_client(config.SUPABASE.url, config.SUPABASE.key)
    
    # Obtener consultas con datos del contacto
    response = supabase.table('consultas_experimental') \
        .select('*, contactos(*)') \
        .order('created_at', desc=True) \
        .execute()
    
    consultas = response.data
    
    if not consultas:
        print("❌ No hay consultas para exportar")
        return
    
    print(f"✅ {len(consultas)} consultas encontradas")
    
    # Crear archivo Markdown
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    nombre_archivo = f"consultas_export_{timestamp}.md"
    
    with open(nombre_archivo, 'w', encoding='utf-8') as f:
        f.write(f"# 📋 Consultas del Abogado Virtual\n\n")
        f.write(f"**Exportado:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"**Total de consultas:** {len(consultas)}\n\n")
        f.write("---\n\n")
        
        for i, c in enumerate(consultas, 1):
            contacto = c.get('contactos', {})
            
            f.write(f"## Consulta #{i}\n\n")
            f.write(f"**ID:** `{c['id']}`\n\n")
            f.write(f"**Fecha:** {c['created_at']}\n\n")
            f.write("### 👤 Usuario\n\n")
            f.write(f"- **Nombre:** {contacto.get('nombre', 'N/A')}\n")
            f.write(f"- **Teléfono:** {contacto.get('telefono', 'N/A')}\n")
            f.write(f"- **Ocupación:** {contacto.get('ocupacion', 'N/A')}\n")
            f.write(f"- **Estado:** {contacto.get('estado', 'N/A')}\n")
            f.write(f"- **Correo:** {contacto.get('correo', 'N/A')}\n\n")
            
            f.write("### 💬 Consulta del usuario\n\n")
            f.write(f"> {c['consulta_usuario']}\n\n")
            
            f.write("### 🔄 Consulta reformulada (IA)\n\n")
            f.write(f"*{c['consulta_reformulada'] or 'N/A'}*\n\n")
            
            f.write("### 🤖 Respuesta del abogado virtual\n\n")
            f.write(f"{c['respuesta_usuario']}\n\n")
            
            f.write("### 📊 Análisis interno\n\n")
            f.write("```json\n")
            analisis = c.get('analisis_interno', {})
            f.write(f"{{\n")
            f.write(f'  "estado_animo": "{analisis.get("estado_animo", "N/A")}",\n')
            f.write(f'  "calidad_consulta": "{analisis.get("calidad_consulta", "N/A")}",\n')
            f.write(f'  "validez": "{analisis.get("validez", "N/A")}",\n')
            f.write(f'  "campo_derecho": "{analisis.get("campo_derecho", "N/A")}",\n')
            f.write(f'  "figura_juridica": "{analisis.get("figura_juridica", "N/A")}",\n')
            f.write(f'  "tipo_accion": "{analisis.get("tipo_accion", "N/A")}",\n')
            f.write(f'  "legislacion_aplicable": "{analisis.get("legislacion_aplicable", "N/A")}"\n')
            f.write(f"}}\n")
            f.write("```\n\n")
            
            f.write(f"**Tokens consumidos:** {c.get('tokens_consumidos', 0)}\n\n")
            
            if c.get('respuesta_util') is not None:
                f.write(f"**¿Respuesta útil?** {'✅ Sí' if c['respuesta_util'] else '❌ No'}\n\n")
            
            if c.get('feedback_texto'):
                f.write(f"**Feedback del usuario:** {c['feedback_texto']}\n\n")
            
            f.write("---\n\n")
    
    print(f"\n✅ Exportación completada")
    print(f"📁 Archivo: {nombre_archivo}")
    print(f"📂 Ubicación: {os.path.abspath(nombre_archivo)}")

if __name__ == "__main__":
    import os
    exportar_consultas()