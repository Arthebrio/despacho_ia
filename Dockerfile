# Usar imagen oficial de Python
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements.txt primero (mejor para caché)
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código
COPY . .

# Variables de entorno (Render las sobreescribirá)
ENV PORT=10000
ENV PYTHONUNBUFFERED=1

# Exponer puerto
EXPOSE 10000

# Comando para ejecutar la app
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:10000"]