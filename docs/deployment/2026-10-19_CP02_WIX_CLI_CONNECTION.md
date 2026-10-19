# CP02 — Instalación de Velo sin copiar código (Wix Git Integration & CLI for Sites)

Fecha: 2026-10-19
Estado: DEPENDENCIA DE CONEXIÓN WIX ↔ GITHUB. El código NO está instalado en Wix.

## Hechos verificados

- Sitio: `Do not use ISC Group`, Editor clásico, Velo habilitado, **Draft**. Site ID: `c2be21cd-0fb0-4709-bf5c-b68ef3e7633a`.
- `byjaimegalindo/ISC-Group` es el repositorio maestro del proyecto, pero **no es un repositorio Wix Git Integration**, pues carece de `wix.config.json` generado por Wix y de los archivos de `src/pages` con IDs internos.
- El MCP disponible modifica colecciones CMS y miembros, pero no expone un método para instalar código Velo del editor; **NO** intentar crear endpoints REST de edición de código no documentados.
- [Documentación oficial del enlace Git/Wix](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/setting-up-git-integration-wix-cli-for-sites): Wix solicita conexión vía Code > GitHub Integration > Connect to GitHub y crea un **repositorio nuevo**; no describe vincular un repo existente.
- [Estructura oficial del repositorio](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/git-hub-repository-file-structure): `src/backend/*.web.js`, `src/pages/<name>.<internal-id>.js`; NO inventar, crear ni renombrar los archivos de página.
- Al conectar Wix a GitHub, el código del editor normal pasa a **solo lectura**: flujo posterior vía Git/IDE. NO ejecutar `wix publish` hasta QA y autorización explícita.
- Wix **no** ejecuta el contenido de `backend/iscMentoring.web.js` de este repo raíz ni de `wix/pages/NP3-Mentoring.js` sin copiarlos a la estructura generada real.

## ÚNICA ACCIÓN MANUAL NECESARIA POR AHORA

En el **Editor** del sitio indicado:
1. Code / Dev Mode → **GitHub Integration** → **Connect to GitHub**.
2. Autorizar Wix Velo GitHub e instalar la app para el repositorio que Wix creará.
3. Escoger dueño `byjaimegalindo`. Como `ISC-Group` ya está ocupado, nombrar el nuevo repositorio `ISC-Group-Wix` o el nombre que permita Wix.
4. No publicar. Comunicar solo la URL del repositorio creado. Si el repositorio no es visible en la conexión GitHub de ChatGPT, autorizar el acceso específico a ese repositorio en la conexión.

NO instalar CLI en la máquina del usuario ni copiar módulos completos al editor para cumplir este paso. La autorización OAuth de Wix/GitHub requiere interacción humana y no debe simularse.

## Trabajo del agente después del enlace

1. Leer el repo **generado por Wix**; verificar `wix.config.json`, sitio y los nombres originales de las páginas/popup NP3, NP4, NP5.
2. Comparar el Velo existente contra los snapshots; localizar inequívocamente las páginas por su nombre/ID y código actual.
3. Crear rama feature desde la rama Wix original y checkpoint fechado.
4. Agregar/actualizar `src/backend/iscMentoring.web.js` desde [archivo preparado](../../src/backend/iscMentoring.web.js); preservar cualquier archivo previo.
5. Fusionar los fuentes reales de NP3 y NP5 desde [rama CP02](../../wix/README_WIRING.md) con las páginas ID-correctas; NP4 inalterado.
6. Verificar imports, sintaxis, tests y puentes. No tocar `HTML` congelado.
7. Subir el código al repo Wix vía GitHub MCP si es accesible; documentar hash y estado REAL.
8. Mantener espejo/copia canónica y handoffs en `ISC-Group` (documentación, source aprobado, checkpoint y enlaces exactos al repo Wix). No exponer datos privados ni tokens.
9. Probar con 2 miembros reales en entorno adecuado. Publicar únicamente cuando el usuario lo indique.

## Estado actual: Wix no conectado / código Velo pendiente de instalar

- Preparación: `src/backend/iscMentoring.web.js` subida en rama `feature/isc-cp02-velo-wiring-20261019`.
- CMS real: dos colecciones creadas, perfiles iniciales privados, índices ACTIVE (CP01).
- Archivo de páginas: pendientes de traslado a filenames originales Wix.
- No confundir preparación Git con instalación en sitio.
