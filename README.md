# ISC Group — Mentor / Mentee

Repositorio maestro de ISC Group sobre Wix Members, CMS y Velo.

**SEGURIDAD:** repositorio PÚBLICO. No almacenar datos personales de miembros, contactos reales, credenciales, tokens, exportaciones privadas ni configuraciones sensibles. El frontend está VISUALMENTE BLOQUEADO; no cambiar HTML/CSS/scroll, tipografías, iconos ni dimensiones sin permiso explícito.

## Estado verificado · 2026-10-19 · CP01 · v0.1.0

| Componente | Estado |
| --- | --- |
| Wix sitio ISC (editor, borrador) | Inspeccionado, NO publicado |
| Wix Members | 3 usuarios comprobados; claves memberId y contactId pueden ser distintas |
| MentoringProfiles | CMS creada (24 campos), permisos ADMIN |
| MentoringFeedback | CMS creada (5 campos), permisos ADMIN |
| MentoringIntroVideos | Preexistente, 3 videos |
| Índices CMS | 1 único por memberId y 1 compuesto visibilidad/activo, ambos ACTIVE |
| Precarga | 3 perfiles, cada ID = memberId; todos privados e inactivos |
| Backend Velo | Preparado en paquete local; NO instalado |
| Wiring NP3 y NP5 | Pendiente de cotejar códigos Velo actuales en editor |
| QA integrado | Pendiente; se requiere sesión real de 2 miembros |
| Frontend NP3 y NP5 | Versiones aprobadas e inmutables |

## Integridad visual

NP3: ISC-Group-Mentoring-v3.5-Altura-Restaurada.html

SHA256: cec991cdba5338cb33857d628706a1080e826057bf8a3066cf121c37c7a4ebd9

NP5: ISC-Group-NP5-Profile-Details-v2.0-Scroll-Principal-Exacto.html

SHA256: faa9ff8c998541dc5019aec039a9b55f0a26bb5a58ae62023f9088498bcca222

Estos hashes identifican artefactos aprobados del handoff del 2026-10-16; no atribuir su presencia en GitHub mientras la importación no se verifique.

## Método y documentación

- [Checkpoints](docs/CHECKPOINTS.md)
- [CP01 · 2026-10-19 · v0.1.0](docs/checkpoints/2026-10-19_CP01_v0.1.0.md)
- [Fuentes de verdad y bloqueo visual](docs/FUENTES_Y_BLOQUEOS.md)
- [Plan de implementación](docs/PLAN_IMPLEMENTACION.md)

El registro de un commit en GitHub no acredita la instalación en Wix. Ningún dato de demostración sustituye registros reales. Alcance actual: sin chat. Cambios futuros en ramas pequeñas con checkpoint, pruebas, rollback y estados objetivos.


## Estado CP02 · v0.2.0 (19 de octubre de 2026)

La integración NP3/NP5 y el backend ya están versionados en la rama `feature/isc-cp02-velo-wiring-20261019`. **NO se ha instalado código en el editor Wix** y este trabajo no se ha fusionado en `main`. Consulte [checkpoint CP02](docs/checkpoints/2026-10-19_CP02_v0.2.0.md) y [guía de instalación Wix](wix/README_WIRING.md).

- Código de página: [`wix/pages/NP3-Mentoring.js`](wix/pages/NP3-Mentoring.js)
- Popup: [`wix/lightboxes/NP5-Profile-Details.js`](wix/lightboxes/NP5-Profile-Details.js)
- Backend privado: [`backend/iscMentoring.web.js`](backend/iscMentoring.web.js)
- Video NP4: **SIN CAMBIOS**; snapshot de referencia.
- Pruebas locales: 16 backend + 12 bridge; QA end-to-end **PENDIENTE**.
- El formulario HTML congelado todavía no implementa precarga visual `SET_MY_PROFILE`; se requiere permiso para un listener JS invisible.
