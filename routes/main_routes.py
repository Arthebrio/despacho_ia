# routes/main_routes.py
from flask import Blueprint, render_template

# Crear el Blueprint (este es el nombre correcto)
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def inicio():
    return render_template('index.html')

@main_bp.route('/jurisprudencias')
def jurisprudencias():
    return render_template('jurisprudencias.html')

@main_bp.route('/prompts')
def prompts():
    return render_template('prompts.html')

@main_bp.route('/experimental')
def experimental():
    return render_template('experimental.html')