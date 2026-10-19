# Plan de implementación · sesión de Wix CMS y Velo
**No modificar HTML congelado**. Este orden minimiza regresiones.

## Etapa 0 · Inspección de sitio (solo lectura)
- Abrir sitio Wix correcto: ID `c2be21cd-0fb0-4709-bf5c-b68ef3e7633a`, nombre visto en MCP `Do not use ISC Group`. Confirmar contexto de Preview vs Published; el proveedor reporta tipo de editor `Editor`, así que verificar manualmente contra el editor abierto.
- Verificar nombres exactos de página NP3, lightboxes NP4 y NP5, HTML component id principal `#html1` en Velo histórico, HTML component id real en NP5; no adivinar.
- Inspeccionar el Velo vigente en página NP3, NP4 y NP5 antes de editar. Respaldar el código vigente.
- Verificar colección `MentoringIntroVideos` y sus tres registros; no tocar videos si funcionan.
- Asegurar usuario de prueba autenticado y segundo usuario de prueba para la privacidad.

## Etapa 1 · Colecciones
- Crear `MentoringProfiles` según diccionario y política de permisos, validando tipos y keys (sin renombrar claves del HTML).
- Crear `MentoringFeedback`. `MentoringConnections` queda a criterio del alcance operativo de conexiones aprobado, sin añadir UI ni chat.
- Acordar unicidad/idempotencia de `memberId`, índices y retención. No usar email como identificador primario.
- Datos iniciales: **cero datos falsos**. No migrar `sampleMembers`.

## Etapa 2 · Backend de datos
- Funciones seguras: `getMyMentoringProfile`, `saveMyMentoringProfile`, `listPublicMentoringMembers`, `getPublicMemberProfile`, `saveMentoringFeedback` (nombres de funciones propuestos, no existentes).
- Autorización por miembro logueado en cada función, validación de límites, sanitización y campos permitidos.
- `saveMyMentoringProfile`: convertir arrays de matrices y `visibility`, `roles`, `types`; subir `photoPreview` a media segura si llegó, si no mantener foto existente; registrar modificación; devolver `{success,...}` a NP3.
- `listPublicMentoringMembers`: no devolver perfiles privados; normalizar objeto consumible por `SET_MEMBERS`, paginar y no exponer campos ocultos.
- `getPublicMemberProfile`: consultar uno por ID real y chequear permiso antes de `SET_PROFILE` al NP5; nunca cargar muestras en producción.
- `saveMentoringFeedback`: insert autenticado, vínculo del autor, validación de longitud/tamaño.

## Etapa 3 · Wiring de NP3 (Velo de página)
- Conservar `OPEN_VIDEO` y los tres videos CMS existentes.
- Añadir listeners para `PROFILE_SAVE_REQUEST`, `FEEDBACK_SAVE_REQUEST`, `OPEN_PROFILE`, `HEIGHT`; responder `SAVE_RESULT`, `PROFILE_OPEN_ACK`, `PROFILE_OPEN_FAILED`.
- Al completar handshake, solicitar directorio real, enviar `SET_MEMBERS` y recuperar perfil propio para el formulario (**si el HTML congelado no admite precarga mediante mensajes, NO modificarlo sin autorización**; documentar el bloqueo). Este es un punto de evaluación explícita, no solución improvisada.
- Para HTML principal, `HEIGHT` debe adecuar el componente/section de Wix donde sea técnicamente posible; probar alturas cuando hay 3 y 50 resultados. No generar scroll externo duplicado.

## Etapa 4 · Wiring de NP5 (Velo del lightbox)
- Abrir lightbox nativo con contexto de miembro autorizado; validar el nombre exacto del popup en editor.
- `READY` de `ISC_PROFILE_HTML` -> Velo responde `SET_PROFILE` con estructura exacta; probar el loop de handshake.
- `CONTACT` -> acción de email autorizada; no permitir revelar direcciones de perfiles privados.
- `CLOSE` -> cerrar lightbox.
- `HEIGHT` -> ajustar altura del embed/lightbox sin romper curva inferior ni scroll fijo.
- Datos del popup **solo de lectura**; NP5 no guarda perfiles.

## Etapa 5 · Pruebas reales
- En Preview: login miembro A, guardar perfil, recargar; directorio solo público; ver NP5; contacto; feedback; tres videos.
- Login miembro B: probar bloqueo de ediciones ajenas, privacidad e inexistencia de exposición de email.
- Probar sin sesión y con red lenta.
- Aprobación QA -> publicación controlada posterior, no automática mañana.

## Prohibido durante estas etapas
Editar cualquiera de los HTML/estilos, recrear botones/checks, cambiar fuentes/copy, sobrescribir Wix NP4, duplicar `MentoringIntroVideos`, limpiar colecciones de producción, publicar sin QA, o declarar integración terminada basándose solo en Preview.
