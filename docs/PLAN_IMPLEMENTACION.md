# Plan incremental para terminar ISC Group

## Fase CP01 (2026-10-19): terminada en su parte CMS

- Inspección real de esquema, Wix Members, índices y colección videos.
- Creación de MentoringProfiles y MentoringFeedback, precarga privada de 3 miembros.
- Respaldo de HTML aprobados en GitHub; sin cambios de presentación.

## Fase CP02: wiring NP3

- Leer de Wix el Velo ACTUAL proporcionado por usuario. Comparar con histórico sin reescribir NP4.
- Instalar backend `iscMentoring.web.js` y hacer pruebas de sitio.
- Añadir en Velo page-handshake y rutas de `PROFILE_SAVE_REQUEST`, `FEEDBACK_SAVE_REQUEST`, `OPEN_PROFILE`, `SET_MEMBERS`, `HEIGHT`, manteniendo `SET_VIDEOS`, `OPEN_VIDEO`.
- Asegurar que la identidad de sesión se resuelve siempre en backend.
- Confirmar el bloqueo de precarga `SET_MY_PROFILE` y solicitar permiso antes de incorporar sólo el listener invisible.

## Fase CP03: NP5

- Leer Velo ACTUAL del popup, confirmar nombre e IDs reales.
- Validar `READY` -> `SET_PROFILE`, cierre y contacto autorizado; foto HTTPS y scroll/height intactos.
- QA de repetición, privado/público, sin imagen, sin email, miembro deslogueado.

## Fase CP04: aceptación

- Dos usuarios Wix reales; pruebas con sesión y sin sesión, guardado/recarga, directorio, NP5 y feedback.
- Chequear permisos de perfiles, indices activos y videos nativos sin regresión.
- Publicación sólo después de instrucción y aceptación explícita; documentar commit SHA y rollback.

## Método TU TURNO

Mientras hay herramientas: el asistente lee, desarrolla, cambia, valida y documenta sin pedir permiso para cada paso reversible; detiene sólo para código Velo no accesible, confirmación de IDs, permisos y QA en editor, o decisión de cambiar un HTML bloqueado. Al finalizar cada corte crea checkpoint fechable y estado de tareas.
