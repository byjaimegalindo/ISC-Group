# Integración Velo — Instalación controlada CP02

**No se han aplicado estos archivos al editor Wix.** Son código completo listo para copiar y pegar, con componentes reales confirmados en el mensaje del usuario del 2026-10-19.

| Página/archivo | Destino en Wix | Acción |
| --- | --- | --- |
| `backend/iscMentoring.web.js` | Backend > New Web Module > iscMentoring.web.js | Crear y pegar completo |
| `wix/pages/NP3-Mentoring.js` | Página NP3 que contiene `#html1` | Sustituir código de página, no el HTML |
| `wix/lightboxes/NP5-Profile-Details.js` | Popup `NP5 - Profile Details` con `#html-Profile` | Sustituir código Velo del popup, no el HTML |
| `wix/lightboxes/NP4-Video-Player-UNCHANGED.js` | Popup `NP4 - Video Player` con `#html-video` | Solo referencia, NO sustituir |

**Orden seguro:** backend → NP3 → NP5 → guardar borrador → inspección de errores → pruebas autenticadas. Si Wix marca error de import del web module, comprobar que está en Backend y no en Public; no cambiar import sin diagnosticar.

**Protocolo:** iframe principal `ISC_MENTORING` hacia Wix, Wix responde `ISC_MENTORING_WIX`; popup NP5 `ISC_PROFILE_HTML` hacia Wix y respuesta `ISC_PROFILE_WIX`; popup NP4 conserva protocolo independiente. Nunca confiar en `memberId` de un postMessage para escrituras. Solo backend `currentMember.getMember({fieldsets:['FULL']})` identifica autor.

**Privacidad:** colecciones `ADMIN`, consulta de miembros públicos por backend y estado de publicación; no crear permisos ANYONE para eludir fallos del editor.

**Bloqueador:** el HTML NP3 no contiene `SET_MY_PROFILE` ni lógica de relleno; el paso de precarga visual requiere un listener funcional invisible y consentimiento expreso del usuario. El backend ya conserva e hidrata datos del miembro.

**Nota en QA:** el directorio aprobado incluye miembros de muestra en HTML; el bridge los sustituye por el arreglo real en READY. Si no existe ningún perfil público guardado, el resultado real será “No members found.” (esperado).
