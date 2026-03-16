# Frontend Improvement Tasks
Proyecto: ia-chatbot-front

Este documento describe mejoras necesarias en la interfaz del frontend del proyecto.

El objetivo es mejorar la coherencia visual y la experiencia de uso siguiendo un estilo similar a interfaces modernas de asistentes de IA como:

- ChatGPT
- Claude
- Perplexity

Las mejoras se concentran principalmente en la **barra lateral (sidebar)**.

---

# 1. Contexto del proyecto

El proyecto es un frontend construido con:

- Next.js (App Router)
- TypeScript
- TailwindCSS

Este frontend interactúa con un backend FastAPI que provee endpoints como:

- `/ingest`
- `/documents`
- `/chat`
- `/sessions`
- `/health`
- `/logs/recent`

El sistema permite:

- subir PDFs
- realizar consultas a documentos usando IA
- manejar sesiones de chat.

---

# 2. Problema actual

La **sidebar actual tiene inconsistencias visuales**.

Los siguientes elementos no siguen el mismo estilo:

### Botones

- Nueva sesión
- Documentos
- FAQ
- Estructurados

Cada uno utiliza estilos distintos de:

- padding
- bordes
- hover
- fondo

Esto rompe la coherencia visual de la aplicación.

---

# 3. Objetivo del rediseño

Unificar la barra lateral siguiendo patrones de UX modernos como los utilizados en:

- ChatGPT
- Claude

Características deseadas:

- diseño minimalista
- botones consistentes
- hover suave
- padding uniforme
- navegación clara

---

# 4. Mejora 1 — Rediseño del botón "Nueva sesión"

El botón **Nueva sesión** debe convertirse en el botón principal de la sidebar.

### Requisitos visuales

Debe ser:

- ancho completo
- bordes redondeados
- padding uniforme
- color primario de la app
- hover suave
- icono opcional (+)

Ejemplo conceptual:

+ Nueva sesión

### Estilo sugerido (Tailwind)


w-full
rounded-xl
bg-primary
hover:bg-primary-dark
transition
px-4
py-2
font-medium


---

# 5. Mejora 2 — Unificación de botones de documentos

Los botones actuales:

- Documentos
- FAQ
- Estructurados

No deben verse como botones independientes.

Deben convertirse en **items de navegación dentro de una sección**.

Ejemplo esperado:


Documentos
FAQ
Estructurados


### Estilo sugerido


rounded-lg
px-3
py-2
hover:bg-sidebar-hover
cursor-pointer


Todos deben compartir exactamente el mismo estilo.

---

# 6. Mejora 3 — Listado de sesiones estilo ChatGPT

Actualmente la aplicación no muestra sesiones anteriores.

Se debe agregar una sección **Sesiones** dentro de la sidebar.

### Ubicación

Debajo del botón **Nueva sesión**.

### Ejemplo esperado


Nueva sesión

Sesiones
Consulta presupuesto cliente
Informe técnico proyecto
Contrato proveedor análisis

Documentos
Documentos
FAQ
Estructurados


---

# 7. Comportamiento de las sesiones

Cada sesión representa una conversación con el chatbot.

Cada item de sesión debe permitir:

- abrir sesión
- cargar historial
- continuar conversación

---

# 8. Interacciones de sesión

Cada sesión debe permitir:

### Click

Abrir la sesión.

### Estado activo

La sesión abierta debe aparecer resaltada.

Ejemplo:


bg-sidebar-active


---

# 9. Diseño visual de cada sesión

Cada sesión debe verse similar a ChatGPT.

Características:

- texto truncado
- hover highlight
- padding consistente

Ejemplo Tailwind:


rounded-lg
px-3
py-2
hover:bg-sidebar-hover
truncate


---

# 10. Organización final de la sidebar

La sidebar final debería quedar organizada así:


Nueva sesión

Sesiones
Sesión 1
Sesión 2
Sesión 3

Documentos
Documentos
FAQ
Estructurados


---

# 11. Requisitos técnicos

El refactor debe:

- reutilizar estilos existentes
- evitar duplicación de componentes
- respetar arquitectura modular

---

# 12. Componentes sugeridos

Se recomienda crear o refactorizar los siguientes componentes:


components/sidebar/

Sidebar.tsx
SidebarSection.tsx
SidebarSessionItem.tsx
SidebarNavItem.tsx


---

# 13. Endpoint para sesiones

Las sesiones pueden obtenerse desde:


GET /sessions


Formato esperado de sesión:


{
id: string
title: string
created_at: string
}


---

# 14. Manejo de sesión activa

El estado de la sesión activa debe mantenerse en:

- ChatContext
o
- hook `useChatSession()`

---

# 15. UX esperada

La experiencia final debe parecerse a interfaces modernas de asistentes IA:

- ChatGPT
- Claude

Características:

- navegación rápida entre sesiones
- sidebar clara
- diseño coherente
- acciones simples

---

# 16. Restricciones

El refactor **no debe romper funcionalidades existentes**:

Debe seguir funcionando:

- subida de PDFs
- consulta a documentos
- chat con IA
- endpoints actuales

---

# Resultado esperado

Una interfaz más limpia, consistente y profesional que mejore la experiencia de usuario y acerque el diseño al estándar actual de aplicaciones de IA conversacional.