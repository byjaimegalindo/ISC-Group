# ISC GROUP · WIX MEMBERS + MENTORING CMS · 19 OCT 2026

## EMPEZAR AQUÍ — estado real, sin confundir preparado vs. instalado

**SITIO INSPECCIONADO:** `Do not use ISC Group`, ID `c2be21cd-0fb0-4709-bf5c-b68ef3e7633a`, Wix Editor, Velo habilitado, BORRADOR. No fue publicado. Coincide con las capturas y los 3 miembros existentes.

### CAMBIOS APLICADOS REALMENTE EN WIX CON MCP

1. Colección `MentoringProfiles` creada con 24 campos y permisos `read/insert/update/remove = ADMIN`.
2. Colección `MentoringFeedback` creada con 5 campos y los mismos permisos ADMIN.
3. Índice único `isc_member_id_unique` sobre `MentoringProfiles.memberId`: **ACTIVE**.
4. Índice regular `isc_directory_visibility` sobre `visibility/isActive`: **ACTIVE**.
5. Precarga desde Wix Members: **3 perfiles**, cada `_id` = `Wix Members memberId`, `contactId` conservado como referencia independiente. Se copiaron todos los nombres existentes y emails disponibles; 1 nombre de pila no existe en la fuente nativa. Se pasaron 2 fotos que existían en Wix Members. Todas las filas `visibility=private`, `isActive=false`, `profileCompleted=false` por seguridad.
6. `MentoringIntroVideos` ya existía y se verificaron **3 registros**, sin modificarlos.
7. NO se crearon demo items, NO se alteró ningún sistema `Members/*`, NO se publicaron cambios visuales.

### ENTREGABLES IMPLEMENTADOS LOCALMENTE, **NO INSTALADOS** EN EDITOR

- `backend/iscMentoring.web.js`: 5 funciones Velo `getMyMentoringProfile`, `saveMyMentoringProfile`, `listPublicMentoringMembers`, `getPublicMemberProfile`, `saveMentoringFeedback`. Permiso SiteMember en cada webMethod, identidad siempre desde Wix Members backend, whitelist de campos, arrays validados contra checks exactos, subida de imagen al Media Manager validada, almacenamiento seguro en CMS, colección de feedback.
- `velo/NP3-Mentoring-MERGE-REFERENCE.js`: integración de mensajes de HTML NP3 con el backend; derivado del único código Velo histórico dentro del handoff. NO usar sin confirmar el Velo ACTUAL del editor; debe **fusionarse**, no sustituirse a ciegas.
- `velo/NP5-Profile-Details-MERGE-REFERENCE.js`: integración popup, recibe ID validado y recupera datos frescos; elemento `#html1` y nombre NP5 pendientes de inspección en editor.
- `tests/backend-security.test.cjs`: simulaciones locales; prueba autorización por sesión, perfiles privados, ID forjado, perfiles públicos, feedback, validación de imagen. `node tests/backend-security.test.cjs` -> PASS. **No prueba el sitio real**.

### BLOQUEOS REALES: DETENCIÓN JUSTIFICADA PARA TURNO DEL USUARIO

**A) Código real en Wix:** las herramientas Wix disponibles administran CMS, miembros y APIs, pero no permiten leer/escribir el Velo actual de NP3/NP5. Es indispensable que el usuario suministre el código de página NP3 vigente y el del popup NP5, además del nombre literal del popup NP5 y el ID del HTML component dentro de él. Los `velo/*REFERENCE.js` se generan a partir de una referencia histórica; sin el archivo actual NO sobrescribir.

**B) Precarga de formulario `Your Profile`:** El HTML congelado v3.5 NO IMPLEMENTA mensaje entrante para rehidratar campos en la pestaña 2. Los mensajes admitidos son `PING`, `SET_VIDEOS`, `SET_MEMBERS`, `PROFILE_OPEN_ACK`, `PROFILE_OPEN_FAILED`, `SAVE_RESULT`. No responde a `SET_MY_PROFILE`. Por tanto, aunque Wix almacene correctamente el perfil, volver a entrar no lo pinta en los inputs. Para lograr el objetivo explícito, habría que acordar un **cambio estrictamente JS, sin CSS/HTML/layout/visual** en una copia versionada, previo permiso explícito del usuario. Mientras esté bloqueado, NO alterar el HTML. NO proclamar P02 como exitoso.

**C) GitHub:** la cuenta conectada `byjaimegalindo` tiene otros repositorios pero no `isc-group` accesible. No se hizo commit/push. Requerimos `git remote -v` del repositorio local ISC y confirmación de la ruta/carpeta existente. No mezclar con proyectos ajenos.

**D) QA real:** ejecutar con dos cuentas miembros: registro/login, save, reload, verificación de CMS, privacidad pública/privada, NP5 foto/contact, feedback, NP4 y capturas parity. Wix Velo miembros no siempre opera completamente en Preview; QA ideal en entorno de pruebas publicado solo previa decisión del usuario.

### FRENTE VISUAL CONGELADO — NO MODIFICADO

- NP3 `ISC-Group-Mentoring-v3.5-Altura-Restaurada.html` SHA256 `cec991cdba5338cb33857d628706a1080e826057bf8a3066cf121c37c7a4ebd9`.
- NP5 `ISC-Group-NP5-Profile-Details-v2.0-Scroll-Principal-Exacto.html` SHA256 `faa9ff8c998541dc5019aec039a9b55f0a26bb5a58ae62023f9088498bcca222`.
- Ninguno de estos HTML va incluido en este paquete; los originales del handoff son la fuente inmutable.
- El evento `HEIGHT` se recibe pero no modifica el iframe hasta revisar paridad de diseño. No se manipularon alturas ni scroll.
- `MentoringConnections` NO se creó: los HTML aprobados no exponen botones reales para solicitar/aceptar conexiones; fase futura aprobada sin chat.

### PRÓXIMO TURNO EN WIX (MÍNIMO)

1. Abre la página **NP3 Mentoring** en este editor Wix, panel de Código Velo, copia completo el código vigente (desde los `import` al final) y compártelo.
2. Abre el popup **NP5 Profile Details**, copia su código Velo actual y confirma el **nombre exacto del popup** y el **ID del componente HTML** (por ejemplo `#html1` SOLO si así aparece realmente).
3. En PowerShell, **desde el repositorio local ISC**, ejecuta `pwd; git status -sb; git remote -v; git branch --show-current; git log -3 --oneline` y comparte salida. No se necesita tocar ni publicar los HTML.
4. Indica si autorizas posteriormente **un listener JS invisible** para precargar los campos al volver a entrar, sin alterar diseño y con versión + diff visual. Hasta ese permiso, queda bloqueado.

Cuando estos datos lleguen, compararé Velo ACTUAL con el histórico, prepararé el **código completo definitivo para copiar/pegar** y las pruebas, sin improvisar IDs.
