# run.py - Enciende el servidor
from app import app

if __name__ == '__main__':
    # 🌟 Tu mensaje personalizado antes de arrancar Flask
    print("\n" + "="*50)
    print("⚖️  LEXIA MX — INTELIGENCIA JURÍDICA  ⚖️")
    print(f"   Versión: {app.config.get('VERSION', '1.0')}")
    print("   Estatus: Servidor local iniciado correctamente.")
    print("   Entorno: Desarrollo (Cancún, Q. Roo)")
    print("="*50 + "\n")
    
    # Arranca el servidor de desarrollo
    app.run(debug=True)