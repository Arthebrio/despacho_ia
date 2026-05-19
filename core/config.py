# core/config.py
# Configuración central de Despacho IA

import os
from dotenv import load_dotenv

# Cargar variables del archivo .env (que está en la raíz)
load_dotenv()

# ============================================
# CONFIGURACIÓN DE OPENAI
# ============================================

class OpenAIConfig:
    """Configuración para OpenAI"""
    
    @property
    def api_key(self) -> str:
        key = os.getenv('OPENAI_API_KEY')
        if not key:
            raise ValueError("❌ OPENAI_API_KEY no encontrada en .env")
        return key
    
    @property
    def modelo_default(self) -> str:
        return "gpt-4o-mini"  # Modelo más económico y rápido
    
    @property
    def temperatura(self) -> float:
        return 0.3  # Más bajo = más preciso, menos creativo


# ============================================
# CONFIGURACIÓN DE SUPABASE
# ============================================

class SupabaseConfig:
    """Configuración para Supabase"""
    
    @property
    def url(self) -> str:
        url = os.getenv('SUPABASE_URL')
        if not url:
            raise ValueError("❌ SUPABASE_URL no encontrada en .env")
        return url
    
    @property
    def key(self) -> str:
        key = os.getenv('SUPABASE_KEY')
        if not key:
            raise ValueError("❌ SUPABASE_KEY no encontrada en .env")
        return key


# ============================================
# CONFIGURACIÓN GENERAL
# ============================================

class Config:
    """Configuración general de la aplicación"""
    
    # OpenAI
    OPENAI = OpenAIConfig()
    
    # Supabase
    SUPABASE = SupabaseConfig()
    
    # Modo debug (True en desarrollo, False en producción)
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    
    # Título de la aplicación
    APP_NAME = "Despacho IA"
    
    # Versión
    VERSION = "1.0.0"


# Instancia global de configuración (para importar fácil)
config = Config()