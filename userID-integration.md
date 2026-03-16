# Frontend User ID Integration
Proyecto: ia-chatbot-front

Objetivo:
Agregar `user_id` persistente en el frontend y enviarlo en todas las requests necesarias al backend para soportar aislamiento multiusuario.

Contexto:
El frontend actual usa Next.js App Router, TypeScript y estructura por features (`chat`, `documents`, `sessions`, `system`). El README también documenta integración con endpoints como `/ingest`, `/documents`, `/chat`, `/sessions` y `/sessions/{id}`. El backend ahora requiere ownership por usuario, por lo que el frontend debe empezar a enviar `user_id` en las solicitudes. 

---

# 1. Objetivo funcional

Implementar un `user_id` persistente por navegador/cliente y enviarlo en:

- subida de documentos
- chat normal
- chat streaming
- listado de sesiones
- detalle de sesión
- listado de documentos

El `user_id` debe persistir en `localStorage`.

---

# 2. Estrategia

## Fuente del `user_id`
Usar `localStorage`.

Clave recomendada:

```ts
docmind_user_id
Reglas

si no existe docmind_user_id, generar uno con crypto.randomUUID()

guardarlo en localStorage

reutilizarlo en todas las requests

3. Crear utilidad compartida

Crear archivo:

app/shared/lib/auth/user-id.ts

Contenido esperado:

const USER_ID_STORAGE_KEY = "docmind_user_id"

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") {
    return ""
  }

  const existingUserId = localStorage.getItem(USER_ID_STORAGE_KEY)

  if (existingUserId) {
    return existingUserId
  }

  const newUserId = crypto.randomUUID()
  localStorage.setItem(USER_ID_STORAGE_KEY, newUserId)

  return newUserId
}

export function getStoredUserId(): string {
  if (typeof window === "undefined") {
    return ""
  }

  return localStorage.getItem(USER_ID_STORAGE_KEY) ?? ""
}
4. Inicializar user_id en la página principal

Archivo:

app/page.tsx
Requisitos

agregar estado local userId

inicializarlo en useEffect

usar getOrCreateUserId()

Ejemplo conceptual:

const [userId, setUserId] = useState<string | null>(null)

useEffect(() => {
  const id = getOrCreateUserId()
  setUserId(id)
}, [])
5. Enviar user_id en chat normal

Archivo:

app/features/chat/types/chat.types.ts

Actualizar ChatRequest:

export interface ChatRequest {
  user_id: string
  session_id: string
  document_ids: string[]
  message: string
}

Archivo:

app/page.tsx

Al enviar mensaje, incluir user_id.

Antes:

await chatService.sendMessage({
  session_id: sessionId,
  document_ids: selectedDocs,
  message: currentQuestion,
})

Después:

await chatService.sendMessage({
  user_id: userId,
  session_id: sessionId,
  document_ids: selectedDocs,
  message: currentQuestion,
})

Agregar validación:

no enviar si userId es null o vacío

6. Enviar user_id en chat streaming

Si existe método streaming en:

app/features/chat/services/chat.service.ts

también debe incluir user_id.

Ejemplo esperado:

sendMessageStream({
  user_id: userId,
  session_id: sessionId,
  document_ids: selectedDocs,
  message: currentQuestion,
})
7. Enviar user_id en upload de documentos

Archivo:

app/features/documents/services/documents.service.ts

Modificar uploadDocument() para incluir user_id.

Recomendación

Usar FormData con:

file

type

user_id

Ejemplo:

async uploadDocument(file: File, type: string, userId: string): Promise<IngestResponse> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("type", type)
  formData.append("user_id", userId)

  return apiClient.postFormData("/ingest", formData)
}

Archivo:

app/page.tsx

Actualizar llamada:

await documentsService.uploadDocument(file, type, userId)

No enviar upload si userId todavía no está listo.

8. Enviar user_id al listar documentos

Archivo:

app/features/documents/services/documents.service.ts

Modificar listDocuments() para incluir user_id.

Opción recomendada

Enviar como query param:

GET /documents?user_id=...

Ejemplo:

async listDocuments(userId: string): Promise<DocumentsResponse> {
  return apiClient.get(`/documents?user_id=${encodeURIComponent(userId)}`)
}

Archivo:

app/page.tsx

Actualizar:

const res = await documentsService.listDocuments(userId)
9. Enviar user_id al listar sesiones

Archivo:

app/features/sessions/services/sessions.service.ts

Modificar listSessions():

async listSessions(userId: string): Promise<SessionsResponse> {
  return apiClient.get(`/sessions?user_id=${encodeURIComponent(userId)}`)
}
10. Enviar user_id al pedir una sesión específica

Archivo:

app/features/sessions/services/sessions.service.ts

Modificar getSession():

async getSession(sessionId: string, userId: string): Promise<SessionData> {
  return apiClient.get(
    `/sessions/${sessionId}?user_id=${encodeURIComponent(userId)}`
  )
}
11. Actualizar SessionManager

Archivo:

app/features/sessions/components/session-manager.tsx
Cambios

Agregar prop:

userId: string | null

No cargar sesiones si userId es null.

Cambiar:

const response = await sessionsService.listSessions()

por:

if (!userId) return
const response = await sessionsService.listSessions(userId)

Y también para getSession() si ahí se usa.

12. Actualizar Sidebar si corresponde

Archivo:

app/components/sidebar/Sidebar.tsx

Si Sidebar renderiza SessionManager, pasar userId como prop.

13. Actualizar page.tsx para recuperación de sesión

Donde se haga:

const sessionData = await sessionsService.getSession(targetSessionId)

cambiar a:

if (!userId) return
const sessionData = await sessionsService.getSession(targetSessionId, userId)
14. Bloquear acciones hasta tener user_id

No permitir acciones si todavía no existe userId.

Bloquear:

upload

chat

recuperación de sesión

listado de documentos

listado de sesiones

Mientras tanto mostrar placeholder simple:

"Inicializando usuario..."
o

skeleton/loading suave

15. Mostrar user_id solo si ayuda al debugging

No mostrar user_id en UI final pública, salvo modo debug.

Si se quiere exponer para pruebas, mostrarlo pequeño y discreto en modo desarrollo.

16. Archivos a revisar

Este cambio probablemente impacte en:

app/page.tsx

app/features/chat/types/chat.types.ts

app/features/chat/services/chat.service.ts

app/features/documents/services/documents.service.ts

app/features/sessions/services/sessions.service.ts

app/features/sessions/components/session-manager.tsx

app/components/sidebar/Sidebar.tsx

app/shared/lib/auth/user-id.ts (nuevo)

17. Requisitos importantes

no romper funcionalidades actuales

mantener compatibilidad con chat y sesiones

no generar hydration errors

usar useEffect para leer localStorage

no acceder a window fuera de cliente

18. Resultado esperado

Después de esta tarea, el frontend debe:

generar/persistir un user_id

enviar user_id en todas las requests relevantes

trabajar solo con sesiones del usuario actual

trabajar solo con documentos del usuario actual

19. Validaciones manuales

Verificar:

recargar la página mantiene el mismo user_id

crear sesiones nuevas sigue funcionando

listar sesiones muestra solo las del usuario

abrir una sesión vieja funciona

upload de documentos sigue funcionando

chat normal funciona

chat streaming funciona

documentos listados pertenecen solo al usuario