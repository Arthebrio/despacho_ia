# services/supabase_service.py
from supabase import create_client, Client
from core.config import config

class SupabaseService:
    """Servicio central para interactuar con Supabase"""
    
    def __init__(self):
        self.client: Client = create_client(
            supabase_url=config.SUPABASE.url,
            supabase_key=config.SUPABASE.key
        )
    
    def get_client(self) -> Client:
        return self.client

# ✅ Esta línea crea la instancia global
supabase_service = SupabaseService()