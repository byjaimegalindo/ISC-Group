# ISC GROUP · MENTOR / MENTEE · HANDOFF OFICIAL
**Cierre visual:** 16 octubre 2026 · **Siguiente sesión:** 17 octubre 2026
**Fase siguiente autorizada:** CMS, backend Velo, permisos, datos reales, wiring y pruebas. **NO frontend**.

## LEE ESTO ANTES DE EMPEZAR (orden obligatorio)
1. `00_LEER_PRIMERO/01_BLOQUEO_VISUAL_Y_ESTADO.md` — ley de diseño; versiones y SHA-256.
2. `02_CMS_Y_WIRING/02_ARQUITECTURA_CMS_PROPUESTA.md` — colecciones y campos propuestos; aún NO creados.
3. `02_CMS_Y_WIRING/03_CONTRATOS_IFRAME_WIX.md` — todos los mensajes reales de los HTML.
4. `02_CMS_Y_WIRING/04_PLAN_WIRING_NP3_NP5.md` — orden de conexión Wix Members, Velo y CMS.
5. `03_QA_Y_ENTREGA/05_MATRIZ_QA.md` — pruebas antes de publicar.
6. `04_GIT_GITHUB/06_ESTADO_GIT_Y_PUBLICACION.md` — límite actual de GitHub y procedimiento seguro.

## Veredicto ejecutivo
**Frontend visual aprobado y congelado**: 4 pestañas del HTML principal, popup NP5 de perfil, header, scroll, tarjetas, controles, checks, tipografías, colores y medidas. El usuario acaba de aprobar de forma expresa la versión final del popup y prohíbe cambios visuales generales.

**NO equivale a backend terminado.** El HTML principal continúa con miembros demo/fallback y emite solicitudes; el Velo NP3 histórico disponible solo conecta videos. No afirmar perfiles reales, guardados reales, filtros CMS ni conexiones operativas hasta completar pruebas en Wix.

**Sitio de referencia identificado mediante Wix:** `Do not use ISC Group`, ID `c2be21cd-0fb0-4709-bf5c-b68ef3e7633a` (borrador; Velo y Wix Members habilitados). Confirmar antes de crear colecciones que es el editor del proyecto correcto y no el sitio del cliente en producción. **No publicar.**

**GitHub:** la cuenta conectada `byjaimegalindo` no lista `isc-group`. Existen referencias a commits de repositorio **local** (no verificadas contra GitHub). **No se realizó push ni commit remoto.** Se necesita la URL remota exacta o crear/autorizar el repositorio correspondiente y enlazar el proyecto local. No usar repositorios de CAPAX/testingsite para ISC.

## Qué hay dentro de este ZIP
- 2 HTML finales APROBADOS, sin alteraciones, listos para preservar.
- Plan y diccionario de CMS — nombres sugeridos, pendientes de validación en Wix.
- Contratos de mensajes, mapeo NP3/NP5 y payloads de referencia.
- Plan detallado de pruebas, seguridad y publicación.
- Referencias históricas: NP3 Velo actual solo videos, bloqueo visual previo y PDF diseñador.
- Manifest de integridad SHA-256.

## REGLA DE ORO
**No reconstruir ni modificar HTML/CSS/JS visual, no regenerar checks, no alterar tipografías Flexo, no cambiar layout ni scrollbar.** Conectar por mensajes y backend. Cualquier ajuste visual requiere autorización explícita y una versión separada después de screenshot diff y rollback.
