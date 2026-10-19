# Arquitectura de datos — PROPUESTA para construir mañana
> **Importante**: identificadores y tipos descritos aquí son una **propuesta técnica**, no un inventario de colecciones ya creadas. La única colección documentada como existente es `MentoringIntroVideos`. Confirmar en Wix los tipos de campos disponibles y permisos antes de crear.

## Colecciones y propósito
1. `MentoringIntroVideos` — **existente según historial**: reutilizar, no duplicar ni borrar registros. Campos que consulta NP3: `title`, `subtitle`, `description`, `videoUrl`, `thumbnail`, `sortOrder`, `isActive`. Histórico: 3 activos.
2. `MentoringProfiles` — **crear**: 1 registro por `memberId` de Wix Members; datos de presentación y filtros; visibilidad y roles.
3. `MentoringFeedback` — **crear**: respuestas del formulario pestaña 4; vínculo a autor autenticado y fecha.
4. `MentoringConnections` — **crear solo después de validar flujo de solicitudes**: emisor/receptor, estado pending/accepted/declined; no chat. Los HTML congelados hoy no contienen una interfaz de solicitudes completa, por lo que crear esta colección no significa activar el flujo.

## MentoringProfiles — diccionario propuesto
| Key | Tipo previsto* | Regla/uso |
|---|---|---|
| `memberId` | Texto | Único lógico, obtenido SERVER-SIDE de Wix Members; index/búsqueda |
| `firstName` | Texto | Obligatorio, del formulario |
| `lastName` | Texto | Obligatorio |
| `company` | Texto | Obligatorio |
| `jobTitle` | Texto | Obligatorio |
| `email` | Texto | Obligatorio para contacto; proteger lectura según privacidad |
| `visibility` | Texto enum | `public` / `private`; default privado al crear hasta consentimiento explícito si aplica |
| `roles` | Tags/lista | Solo `Mentor`, `Mentee`; puede incluir ambos |
| `types` | Tags/lista | `Traditional`, `Reverse`, `Peer-to-Peer` |
| `photoUrl` | Texto/imagen | URL/media de Wix; nunca guardar DataURL base64 como dato público |
| `mentorCareerLevel` | Tags/lista | Valores idénticos al HTML, solo para Mentor |
| `mentorFunction` | Tags/lista | Valores idénticos al HTML |
| `mentorArea` | Tags/lista | Valores idénticos al HTML |
| `mentorBio` | Texto largo | Longitud máxima 300 caracteres, según HTML |
| `menteeCareerLevel` | Tags/lista | Valores idénticos al HTML, solo para Mentee |
| `menteeFunction` | Tags/lista | Valores idénticos al HTML |
| `menteeArea` | Tags/lista | Valores idénticos al HTML |
| `menteeBio` | Texto largo | Máximo 300 caracteres |
| `isActive` | Booleano | Perfil válido/activo para directorio |
| `createdAt` / `updatedAt` | Fecha/hora | Auditoría: usar metadata Wix si suficiente |

\* Para listados múltiples, validar tipo CMS nativo (`Tags` u otro tipo que retorne arrays) y comportamiento real de consultas. Si ese tipo no admite el patrón requerido, definir una serialización consistente antes de crear; **no cambiar el payload esperado por el HTML**.

## Valores EXACTOS aprobados (no traducir ni renombrar)
- CAREER LEVEL: `Early Career`, `Middle Manage.`, `Senior Leadership`, `C-suite`, `Board Exec.`
- FUNCTION: `Marketing`, `Sales`, `Distribution`, `Broking`, `Underwriting`, `Risk`
- AREA: `Lloyd’s`, `London Market`, `General Insurance`, `Regulated`, `Unregulated`
- ROLE: `Mentor`, `Mentee`
- TYPE: `Traditional`, `Reverse`, `Peer-to-Peer`

## MentoringFeedback — diccionario propuesto
`memberId` (Texto; servidor), `overall` (Texto largo), `positive` (Texto largo), `improvements` (Texto largo), `status` (Texto: `new`/`reviewed`), timestamp de creación. *En el HTML*, el tercer campo sale como `improvements` pese a que el textarea tiene id `improved`: preservar nombre del payload.

## MentoringConnections — solo diseño futuro de persistencia
`requesterMemberId`, `recipientMemberId`, `status` (`pending`/`accepted`/`declined`), `createdAt`, `respondedAt`, `updatedAt`; índice lógico único del par según política de duplicados; validación server-side. No crear chat, mensajes, notificaciones ni botones nuevos sin fase aprobada.

## Permisos — regla no negociable
- Lectura/escritura de colecciones personales desde **backend validado**, no `wixData` directo desde un iframe.
- Perfil: editar solo donde `memberId` autenticado == propietario; no aceptar `memberId` del payload cliente para asignación.
- Directorio: devolver solo `visibility==='public'` e `isActive`; no exponer email/datos privados en una consulta pública indiscriminada.
- NP5: solo abrir el perfil que el solicitante tiene derecho a ver; validar autorización antes de enviar `SET_PROFILE`.
- Feedback: solo insertar desde sesión autenticada, con validación y controles de abusos.
- CMS Access & Permissions: mínimo privilegio; confirmar configuración real de Wix y revisar pruebas en Preview + Published.

## Integración Wix Members
La identidad canónica debe ser el ID de miembro de Wix Members (no email, no nombre visible, no ID de muestra). Vincular una sola fila `MentoringProfiles` por `memberId`; para evitar duplicados, guardar mediante upsert protegido / lock lógico. Si hacen falta badges nativos, mapear Mentor/Mentee sin romper Wix Members; no duplicar cuentas.
