# Jerarquía de fuentes, bloqueos y seguridad

1. **Frontend cerrado** — Los 2 HTML de `src/locked` son inmutables en bytes. Diseño, colores, medidas, fuentes Flexo, botones, checks, scroll y encabezado fijos aprobados. Historial no lo sustituye.
2. **Código Velo vigente en editor Wix** — Debe recibirse y respaldarse antes de sustituir; el código de `integration/references` es sólo referencia.
3. **CMS y Members reales de Wix** — Fuente de verdad para las colecciones, esquema y datos. Nunca confundir con mock, fixtures o exportaciones.
4. **Handoffs fechados** — El del 16 octubre fija el diseño; el del 19 documenta CMS instalado, nuevos checkpoints y pendientes. Las referencias históricas se mantienen sin reemplazar versiones posteriores.

## Identidad

`memberId` es la clave primaria inmutable en `MentoringProfiles`, `_id = memberId` para perfiles propios, `contactId` se conserva sólo como enlace a contacto. Ambos GUID pueden diferir. Nunca autorizar una escritura con el `memberId` que envíe el iframe.

## Privacidad

CMS de perfiles y feedback: sólo ADMIN. Todo consumo público debe pasar por backend autenticado con allowlist y verificación `visibility = public`, `isActive = true`, `profileCompleted = true`. No exponer emails de registros privados, ni datos de CRM, a otros miembros. En repositorio PÚBLICO no versionar información personal ni secretos.

## Pendientes de interfaz, fuera de contrato

El HTML canónico actual no implementa un listener de entrada `SET_MY_PROFILE`; no modificarlo sin consentimiento expreso. No construir chat. Conexiones solo en fase con controles funcionales aprobados.
