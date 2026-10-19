# Estado Git / GitHub y procedimiento de sincronización segura
Fecha: 16 octubre 2026. Esta sección evita declaraciones falsas de push.

## Hecho verificable ahora
- GitHub conectado a `byjaimegalindo`: **no aparece un repositorio `isc-group`** en lista accesible.
- La búsqueda exacta del remoto tampoco estaba disponible (GitHub devolvió 422 al buscar repo inexistente).
- Referencias históricas del proyecto hablan de Git local con rama `feature/mentoring-profile-popup`, commit `11130c3`, otro commit `3dc09cc` y tag `mentoring-tabs1-4-ui-approved-2026-10-16`; son **antecedentes NO verificados en esta sesión**.
- No hay ruta de checkout local confirmada. No reutilizar `C:\Dev\hxd-capax-dev` ni `testingsite` para ISC.
- No se creó commit, no se hizo push, no se sincronizó Wix/GitHub desde este handoff.

## Acciones seguras al retomar (terminal de Windows, desde EL REPO ISC CORRECTO)
```powershell
# Primero ubica el checkout local real de ISC Group; no adivinar carpeta.
pwd
git status -sb
git remote -v
git branch --show-current
git log -3 --oneline
git tag --list 'mentoring-*'
```
Si no tiene `origin`, identificar/crear el remoto adecuado de ISC en GitHub (privado si contiene entregables de cliente), confirmar permisos y asociar el checkout sin sobrescribir commits. La URL exacta requiere verificación.

## Sincronización propuesta al tener remoto
1. Verificar respaldo de HEAD, remotos, worktree y tags.
2. Crear rama exclusiva de implementación `feature/isc-mentoring-cms-wiring-20261017` **desde una base comprobada**. No forzar checkout si hay trabajo sin guardar.
3. Agregar los dos HTML congelados en carpeta `src/mentoring/` **como artefactos independientes**, conservando sus nombres y hashes; no reemplazar sus equivalentes previos sin revisar árbol de repo.
4. Agregar docs nuevos de este paquete en `docs/handoff-2026-10-16/`.
5. Antes de commit: calcular SHA-256 de ambos archivos, revisar `git diff --check`, `git diff --stat`, `git status -sb`; confirmar que HTML congelados tienen contenido byte a byte idéntico.
6. Hacer commit de documentación/corte, push de rama y obtener commit SHA remoto; solo entonces documentar URL y estado “sincronizado”.
7. Cambios de backend se hacen en commits posteriores pequeños y reversibles; NUNCA reescribir historia aprobada.

## No hacer
- No `git push --force`.
- No sobrescribir `main` de CAPAX, testingsite ni de ningún cliente distinto.
- No usar nombre de repo como prueba de existencia.
- No declarar Wix desplegado/publicado porque GitHub haya recibido archivos.
- No ejecutar `wix publish` ni modificar el sitio al preparar handoff.

## Bloqueo único pendiente del usuario/entorno
**Identificar URL real del repositorio GitHub de ISC Group, o crear/autorizar `byjaimegalindo/isc-group` y vincularlo al checkout local.** Si mañana se muestra la salida `git remote -v` del checkout ISC, ese dato permite continuar sin dudas.
