# app.py - El corazón de la plataforma
from flask import Flask
from core.config import config

# Importar los Blueprints
from routes.main_routes import main_bp
from routes.analizador_routes import analizador_bp
from routes.prompts_routes import prompts_bp
from routes.juris_routes import juris_bp
from routes.experimental_routes import experimental_bp

# Crear la aplicación
app = Flask(__name__)

# Configuración
app.config['APP_NAME'] = config.APP_NAME
app.config['VERSION'] = config.VERSION
app.config['DEBUG'] = config.DEBUG

# ============================================
# REGISTRAR BLUEPRINTS (rutas)
# ============================================

app.register_blueprint(main_bp)                              # Ruta principal /
app.register_blueprint(analizador_bp, url_prefix='/analizador')   # Analizador semántico
app.register_blueprint(prompts_bp, url_prefix='/prompts')          # Generador de prompts
app.register_blueprint(juris_bp, url_prefix='/jurisprudencias')    # Buscador de jurisprudencias
app.register_blueprint(experimental_bp, url_prefix='/experimental') # Herramientas experimentales

# ============================================
# (Para después) Más módulos:
# app.register_blueprint(estadisticas_bp, url_prefix='/estadisticas')
# app.register_blueprint(usuarios_bp, url_prefix='/usuarios')
# ============================================

# ============================================
# PARA RENDER (producción)
# ============================================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)