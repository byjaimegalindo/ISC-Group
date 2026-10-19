# Cierre visual y estado real (fuente de verdad 2026-10-16)

## Artefactos CANÓNICOS e INMUTABLES
| Módulo | Referencia final aprobada | SHA-256 |
|---|---|---|
| NP3 · HTML Mentoring, tabs 1–4 | `ISC-Group-Mentoring-v3.5-Altura-Restaurada.html` | `cec991cdba5338cb33857d628706a1080e826057bf8a3066cf121c37c7a4ebd9` |
| NP5 · Profile Details, popup | `ISC-Group-NP5-Profile-Details-v2.0-Scroll-Principal-Exacto.html` | `faa9ff8c998541dc5019aec039a9b55f0a26bb5a58ae62023f9088498bcca222` |

Estos archivos se incluyen **byte a byte** en `01_FRONTEND_BLOQUEADO/`. No usar versiones v2.7/v2.9/v1.9 como sustitutos: aparecen en la historia del proyecto pero no son el corte visual final.

## Cerrado / No tocar
- Pestaña 1: introducción + 3 videos + NP4 Video Player nativo ya aprobado.
- Pestaña 2: Your Profile, todos los inputs, privacidad, badges, cajas y las matrices Mentor/Mentee de 3 columnas; iconos/checks validados.
- Pestaña 3: Members Match — tarjetas, grid/list, buscador, contadores, botones PROFILE/CONTACT.
- Pestaña 4: Leave Us a Comment — formulario, botones y disposición.
- NP5 popup Profile Details — campos de solo lectura, foto, tarjetas Mentor/Mentee, types, botones, encabezado y scrollbar idéntico al principal (3 px, gris-morado tenue).
- Conjunto global: Flexo, escalas, colores azul `#4379BD`, morado `#29022B`, gris `#D9D9D9`, radio, scroll interno, encabezado fijo, contraste visual, responsive.

## Falta conectar (sin cambios visuales)
| Ámbito | Estado confirmado desde artefactos | Próxima acción |
|---|---|---|
| MentoringIntroVideos | Histórico del proyecto: colección existente con 3 videos; NP3 histórico la consulta | Revalidar conexión real antes de modificar |
| Autenticación | Wix Members instalado; **no hay persistencia en HTML** | Resolver memberId del usuario autenticado en Velo/backend |
| Perfil editable | `PROFILE_SAVE_REQUEST` emitido desde iframe | Validar y persistir con propiedad de miembro |
| Foto | HTML envía `photoPreview` como DataURL | Subida segura a Wix Media Manager; guardar URL/mediaId |
| Directorio | `sampleMembers` en HTML hasta recibir `SET_MEMBERS` | Backend solo retorna perfiles públicos, reales, saneados |
| Profile popup NP5 | Front listo, handshake por `READY/SET_PROFILE`; puente NP3 incompleto en histórico | Abrir lightbox NP5 y enviar perfil autorizado |
| Feedback | Emite `FEEDBACK_SAVE_REQUEST` | Persistir con autor, timestamp y estado |
| Altura iframe | HTML emite `HEIGHT` por contenido | Verificar/implementar recepción y límite en Wix |
| Solicitudes mentor/mentee | Alcance funcional futuro sin chat | Esquema propuesto; no agregar botones al frontend cerrado |
| GitHub | Sin remoto `isc-group` visible | Resolver repositorio; después commit/push verificables |

## Restricciones de implementación
- No editar los HTML canónicos ni el CSS, ni siquiera para corregir textos o cambiar hooks.
- No insertar UI administrativa en los iframe.
- Los mensajes existentes son el **contrato de interfaz**, no una invitación a reescribirlo.
- Respeto a privacidad: perfiles privados fuera del directorio; solo el titular edita; no confiar en `memberId` enviado desde el navegador.
- No usar fixtures/sampleMembers como registros reales ni publicarlos.
- No chat en esta entrega.

## Antecedentes que reemplaza este cierre
`05_REFERENCIAS_HISTORICAS/STATE-20261016.md` y `LOCK-TABS-1-4.md` decían que el popup estaba pendiente. Su valor es histórico; esta aprobación **posterior** cierra visualmente NP5 v2.0. El Velo NP3 incluido es referencia de implementación previa, no evidencia de wiring completo.
