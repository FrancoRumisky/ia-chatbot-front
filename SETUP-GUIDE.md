# 🚀 Guía de Inicio Rápido - AI Document Assistant

## ⚠️ Error: Backend no disponible

El error "Failed to fetch" indica que el **backend no está corriendo**. Este proyecto requiere tanto el frontend como el backend para funcionar.

## 📋 Requisitos

1. **Backend corriendo** en `http://localhost:8000`
2. **Frontend** corriendo en `http://localhost:3000`

## 🛠️ Pasos para ejecutar el proyecto completo

### 1. Iniciar el Backend

El backend está en un repositorio separado. Necesitas clonarlo e iniciarlo:

```bash
# Clonar el repositorio del backend
git clone https://github.com/FrancoRumisky/ia-chatbot.git
cd ia-chatbot

# Instalar dependencias (dependiendo del gestor de paquetes usado)
pip install -r requirements.txt
# o
poetry install
# o
conda env create -f environment.yml

# Iniciar el servidor
python main.py
# o
uvicorn main:app --host 0.0.0.0 --port 8000
# o el comando específico del proyecto
```

### 2. Iniciar el Frontend

```bash
# En otra terminal, desde el directorio del frontend
cd /home/mun/Descargas/ai-document-assistant-frontend
npm run dev
```

### 3. Verificar funcionamiento

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Health check: http://localhost:8000/health

## 🔧 Solución de problemas

### Error "Failed to fetch"
- ✅ Verificar que el backend esté corriendo en el puerto 8000
- ✅ Verificar que no haya firewall bloqueando la conexión
- ✅ Verificar que la URL del backend sea correcta

### Error de CORS
- ✅ El backend debe permitir requests desde `http://localhost:3000`

### Backend no inicia
- ✅ Verificar que todas las dependencias estén instaladas
- ✅ Verificar que Ollama esté corriendo (si es requerido)
- ✅ Verificar que los modelos de IA estén disponibles

## 📞 Soporte

Si continúas teniendo problemas, verifica:
1. Los logs del backend para errores
2. Que el puerto 8000 no esté ocupado por otra aplicación
3. La documentación del repositorio del backend

---

**Repositorio del Backend**: https://github.com/FrancoRumisky/ia-chatbot