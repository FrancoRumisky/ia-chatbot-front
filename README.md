# 🤖 AI Document Assistant Frontend

Frontend para el asistente de documentos basado en IA local, construido con Next.js, TypeScript y Tailwind CSS.

## 🚀 Características

### ✨ Funcionalidades principales
- **Chat inteligente** con documentos PDF
- **Gestión de sesiones** persistentes
- **Clasificación de documentos** (docs, FAQ, estructurados)
- **Interfaz moderna** con tema oscuro
- **Streaming de respuestas** (próximamente)

### 🔧 Tecnologías
- **Next.js 16** - Framework React
- **TypeScript** - Tipado fuerte
- **Tailwind CSS** - Estilos
- **FastAPI Backend** - API REST

## 🛠️ Instalación y uso

### Prerrequisitos
- Node.js 18+
- Backend corriendo en `http://localhost:8000`

### Instalación
```bash
npm install
# o
yarn install
# o
pnpm install
```

### Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción
```bash
npm run build
npm start
```

## 📁 Estructura del proyecto

```
app/
├── features/
│   ├── chat/           # Componentes y servicios de chat
│   ├── documents/      # Gestión de documentos
│   ├── sessions/       # Gestión de sesiones
│   └── system/         # Servicios del sistema
├── shared/             # Utilidades compartidas
└── page.tsx           # Página principal
```

## 🎯 APIs utilizadas

### Backend requerido
- `POST /ingest` - Subir documentos con tipo
- `GET /documents` - Listar documentos
- `POST /chat` - Enviar mensajes
- `GET /sessions` - Listar sesiones guardadas
- `GET /sessions/{id}` - Obtener datos de sesión
- `GET /health` - Estado del sistema
- `GET /logs/recent` - Logs recientes

## 🔄 Mejoras recientes

### v1.1.0 - Gestión de sesiones y tipos de documento
- ✅ **Gestión de sesiones**: Crear, cambiar y persistir conversaciones
- ✅ **Clasificación de documentos**: Selector de tipo (docs/faq/structured)
- ✅ **Mejor UX**: Interfaz más intuitiva para manejo de sesiones
- ✅ **APIs extendidas**: Soporte para nuevas endpoints del backend

### Próximas mejoras
- 🔄 **Streaming de respuestas** en tiempo real
- 🔄 **Dashboard de métricas** del sistema
- 🔄 **Historial de logs** de interacciones
- 🔄 **Modo oscuro/claro** opcional

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Backend**: [ia-chatbot](https://github.com/FrancoRumisky/ia-chatbot)
