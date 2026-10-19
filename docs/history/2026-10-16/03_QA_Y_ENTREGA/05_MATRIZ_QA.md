# QA de liberación · ISC Mentoring (no declarar completado sin ejecutar)

| ID | Prueba | Resultado esperado | Estado inicial |
|---|---|---|---|
| F01 | Visual tabs 1–4 vs HTML congelado | Misma distribución, fuentes, checks y colores | FROZEN; QA Wix pendiente |
| F02 | Popup NP5 visual vs v2.0 | Mismo alto/scroll/curvas/separación | FROZEN; QA Wix pendiente |
| F03 | NP4 video 1,2,3 | Abre lightbox correcto sin superposición | Histórico funcional, retest pendiente |
| H01 | Scroll en principal | Header y tabs fijos, contenido móvil, scrollbar discreto, sin doble scroll | Retest en Wix pendiente |
| H02 | Scroll popup | Header fijo, final sin invadir curva, distancia igual al principal | Retest en Wix pendiente |
| C01 | CMS datos | Colecciones nuevas con keys/tipos/permisos aprobados | No creado |
| C02 | CMS intro videos | Tres videos activos desde colección existente | Reconfirmar |
| A01 | Usuario logueado | Identidad del servidor real | Pendiente |
| A02 | Usuario anónimo | No puede guardar ni obtener privados | Pendiente |
| P01 | Guardar perfil | `PROFILE_SAVE_REQUEST` -> colección -> `SAVE_RESULT.success=true` | Pendiente |
| P02 | Editar perfil y recargar | Persisten todos los campos y foto | Pendiente |
| P03 | Validaciones | Email, obligatorios, arrays permitidos y textos <=300 | Pendiente |
| P04 | Mentor / Mentee / ambos | Badges y preferencias exactos y persistidos | Pendiente |
| P05 | Perfil privado | No sale en directorio para terceros | Pendiente |
| P06 | Acceso cruzado | Usuario B no edita ni lee datos privados de A | Pendiente |
| M01 | Directorio real | `SET_MEMBERS` no muestra `sample-*` | Pendiente |
| M02 | Búsqueda / grid / list | Funcionan sin alterar frontend | Pendiente |
| M03 | Popup profile | `OPEN_PROFILE` -> ACK -> `SET_PROFILE` correcto | Pendiente |
| M04 | Perfil sin foto | Avatar placeholder y sin error | Pendiente |
| M05 | CONTACT | Solo email autorizado, no revela privado | Pendiente |
| FB01 | Feedback | Guardar / `SAVE_RESULT`, fecha y autor correctos | Pendiente |
| R01 | Cambiar de tab | No pierde header ni produce iframe bajo/recortado | Pendiente |
| R02 | Resize desktop/tablet/móvil | Sin desbordamientos ni desplazamiento lateral | Pendiente |
| G01 | GitHub | commit + push + URL verificables (si remoto disponible) | Bloqueado por remoto |
| G02 | Freeze | SHA de ambos HTML idéntico a manifest | Preparado |

## Evidencias que se guardan mañana
- URL/site ID exactos, Preview y Published separados.
- IDs reales de colecciones y campos; capturas de permisos.
- Código Velo completo por archivo y diff sobre backup.
- Capturas de las 4 pestañas, NP4 y NP5 sin regresiones.
- Capturas o logs de flujos save/read con datos de prueba ficticios.
- Hashes finales del frontend: deben coincidir con `MANIFEST_SHA256.txt`.
- Commit SHA, branch y URL remota si y solo si el push realmente concluye.

## Criterio de salida
Ningún paso se marca **operativo** hasta demostrarlo con dos miembros reales de prueba y guardar evidencia de autorización. Un formulario que muestra “Saved successfully” sin registro verificado en Wix CMS NO pasa QA.
