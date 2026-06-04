# app.py - El corazón de la plataforma
import os
from flask import Flask, render_template
from core.config import config

# Importar los Blueprints
from routes.main_routes import main_bp
from routes.prompts_routes import prompts_bp
from routes.juris_routes import juris_bp
from routes.experimental_routes import experimental_bp

# Crear la aplicación
app = Flask(__name__, template_folder='templates')

# Configuración
app.config['APP_NAME'] = config.APP_NAME
app.config['VERSION'] = config.VERSION
app.config['DEBUG'] = config.DEBUG

# ============================================
# RUTA PARA EL ANALIZADOR - VERSIÓN FINAL
# ============================================
@app.route('/analizador_2')
def analizador():
    return render_template('analizador_2.html')

# Registrar Blueprints
app.register_blueprint(main_bp)
app.register_blueprint(prompts_bp, url_prefix='/prompts')
app.register_blueprint(juris_bp, url_prefix='/jurisprudencias')
app.register_blueprint(experimental_bp, url_prefix='/experimental')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)  # debug=True para ver errores