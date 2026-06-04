# routes/experimental_routes.py
from flask import Blueprint, render_template, request, jsonify
from services.experimental_service import experimental_service
from repositories.experimental_repository import experimental_repository
import traceback

experimental_bp = Blueprint('experimental', __name__)

print("🚀 Cargando experimental_routes...")


@experimental_bp.route('/')
def index():
    print("📄 Sirviendo página experimental.html")
    return render_template('experimental.html')


@experimental_bp.route('/api/consultar', methods=['POST'])
def consultar():
    print("\n" + "="*50)
    print("📨 POST /api/consultar - Nueva solicitud")
    print("="*50)
    
    try:
        # Capturar IP
        ip_usuario = request.remote_addr
        if request.headers.get('X-Forwarded-For'):
            ip_usuario = request.headers.get('X-Forwarded-For').split(',')[0]
        
        print(f"🌐 IP del cliente: {ip_usuario}")
        
        # Obtener datos del request
        data = request.get_json()
        print(f"📦 Datos recibidos: {list(data.keys()) if data else 'None'}")
        
        nombre = data.get('nombre', '').strip()
        telefono = data.get('telefono', '').strip()
        consulta = data.get('consulta', '').strip()
        perfil_usuario = data.get('perfil_usuario', 'particular').strip()  # ← CORREGIDO
        estado = data.get('estado', '').strip()
        correo = data.get('correo', '')
        
        print(f"👤 Nombre: {nombre}")
        print(f"📞 Teléfono: {telefono}")
        print(f"📋 Perfil: {perfil_usuario}")  # ← CORREGIDO
        print(f"📍 Estado: {estado}")
        print(f"📝 Consulta: {consulta[:100]}..." if len(consulta) > 100 else f"📝 Consulta: {consulta}")
        
        # Validaciones
        if not nombre:
            print("❌ Validación falló: Nombre vacío")
            return jsonify({'success': False, 'error': 'El nombre es requerido'}), 400
        
        if not telefono or len(telefono) != 10 or not telefono.isdigit():
            print("❌ Validación falló: Teléfono inválido")
            return jsonify({'success': False, 'error': 'El teléfono debe tener 10 dígitos numéricos'}), 400
        
        if not consulta or len(consulta) < 20:
            print(f"❌ Validación falló: Consulta demasiado corta ({len(consulta)} caracteres)")
            return jsonify({'success': False, 'error': 'La consulta debe tener al menos 20 caracteres'}), 400
        
        print("✅ Validaciones pasadas")
        
        # Procesar consulta (CORREGIDO: perfil_usuario en lugar de ocupacion)
        print("🔄 Llamando a experimental_service.procesar_consulta()...")
        resultado = experimental_service.procesar_consulta(
            nombre, telefono, consulta, perfil_usuario, estado, correo, ip_usuario
        )
        
        print(f"📤 Resultado: success={resultado.get('success')}")
        if not resultado.get('success'):
            print(f"❌ Error en resultado: {resultado.get('error')}")
        
        return jsonify(resultado)
        
    except Exception as e:
        print(f"❌ EXCEPCIÓN en consultar(): {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


@experimental_bp.route('/api/verificar_limites', methods=['POST'])
def verificar_limites():
    """Verifica límites sin hacer consulta (para el frontend)"""
    print("\n📨 POST /api/verificar_limites")
    try:
        data = request.get_json()
        telefono = data.get('telefono', '').strip()
        
        ip_usuario = request.remote_addr
        if request.headers.get('X-Forwarded-For'):
            ip_usuario = request.headers.get('X-Forwarded-For').split(',')[0]
        
        print(f"📞 Verificando límites para teléfono: {telefono}")
        
        if not telefono:
            return jsonify({'success': False, 'error': 'Teléfono requerido'}), 400
        
        permitido, segundos, mensaje = experimental_repository.verificar_ultima_consulta_global()
        
        print(f"✅ Permitido: {permitido} - {mensaje}")
        
        return jsonify({
            'success': True,
            'permitido': permitido,
            'mensaje': mensaje,
            'segundos_restantes': segundos
        })
        
    except Exception as e:
        print(f"❌ Error en /api/verificar_limites: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


@experimental_bp.route('/api/feedback', methods=['POST'])
def feedback():
    print("\n📨 POST /api/feedback")
    try:
        data = request.get_json()
        consulta_id = data.get('consulta_id')
        respuesta_util = data.get('respuesta_util')
        feedback_texto = data.get('feedback_texto')
        
        print(f"📝 Feedback para consulta {consulta_id}: útil={respuesta_util}")
        
        if not consulta_id:
            return jsonify({'success': False, 'error': 'ID de consulta requerido'}), 400
        
        experimental_repository.guardar_feedback(consulta_id, respuesta_util, feedback_texto)
        
        print("✅ Feedback guardado")
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"❌ Error en feedback: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


print("✅ experimental_routes cargado correctamente")