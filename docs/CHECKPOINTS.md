# Política de checkpoints ISC Group

**Regla:** cada corte registra fecha, versión y número de checkpoint, sin confundir código versionado con funciones instaladas en Wix.

Formato: `YYYY-MM-DD_CPnn_vMAJOR.MINOR.PATCH.md`. Ejemplo: `2026-10-19_CP01_v0.1.0.md`.

## Secuencia y criterios

| Checkpoint | Versión | Objetivo | Estado |
|---|---|---|---|
| 2026-10-16 — UI LOCK | v3.5 NP3 / v2.0 NP5 | Dos HTML finales inmutables | APROBADO por usuario |
| 2026-10-19 — CP01 | v0.1.0 | CMS inicial, precarga real, índices, GitHub y paquete de integración | PARCIAL (Wix CMS cerrado; wiring pendiente) |
| CP02 | v0.2.0 | Revisión NP3 Velo ACTUAL y wiring de perfil, miembros, videos, feedback | PENDIENTE |
| CP03 | v0.3.0 | Popup NP5 real, fotos, privacidad y mensajería iframe | PENDIENTE |
| CP04 | v1.0.0 | QA multiusuario, validación Wix, versión candidata a producción | PENDIENTE |

## Plantilla obligatoria por checkpoint

1. **Fuente de verdad:** sitio Wix, commit, archivos aprobados y hash SHA256.
2. **HECHO Y VERIFICADO:** operaciones realizadas, resultados Wix/API, tests.
3. **PREPARADO PERO NO INSTALADO:** no confundir código local/GitHub con ejecución real.
4. **PENDIENTE:** tareas con responsables y condiciones.
5. **TU TURNO:** instrucciones manuales específicas y mínimas.
6. **QA:** casos ejecutados/no ejecutados, usuarios de prueba sin PII.
7. **ROLLBACK:** identificador de commit anterior y qué revertir.
8. **BLOQUEOS:** decisiones humanas estrictamente necesarias.

Usar una rama de checkpoint `checkpoint/YYYY-MM-DD_CPnn_vX.Y.Z` una vez cerrado el corte. No reescribir ramas de checkpoint. Nunca `push --force`. No incluir PII, emails, secretos ni exportaciones CMS en este repositorio público.
