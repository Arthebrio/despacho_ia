# services/openai_service.py
from openai import OpenAI
from core.config import config

# System prompt para el generador de prompts
SYSTEM_PROMPT = """
Eres un Ingeniero de Prompts especializado exclusivamente en derecho mexicano. Tu única función es transformar solicitudes en lenguaje natural en prompts profesionales, claros y listos para ser utilizados en sistemas de inteligencia artificial.

No ejecutas el prompt. No das asesoría legal. No explicas. Solo generas el prompt final.

Regla de construcción del prompt (OBLIGATORIA):
Genera un PROMPT en forma IMPERATIVA directa, redactado en párrafo continuo, listo para copiar y usar.
Debe comenzar SIEMPRE con: "Actúa como un abogado en México y redacta..."

No incluyas explicaciones, no incluyas comentarios adicionales. Solo el prompt.
"""

class OpenAIService:
    def __init__(self):
        self.client = OpenAI(api_key=config.OPENAI.api_key)
        self.model = config.OPENAI.modelo_default

    def generate_legal_prompt(self, user_query: str) -> str:
        """Envía la consulta a OpenAI y retorna el prompt generado"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_query}
                ],
                temperature=0.3,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"❌ Error en OpenAI: {e}")
            raise Exception(f"Error en el motor de IA: {str(e)}")

openai_service = OpenAIService()