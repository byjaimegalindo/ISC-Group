# Contratos exactos entre HTML aprobado y Wix
Fuente: inspección del JS de los **dos HTML congelados**. Los nombres, capitalización y forma de los payloads NO deben cambiarse.

## A. HTML principal (NP3)
Iframe -> Wix: `source: 'ISC_MENTORING'`; Wix -> iframe: `source: 'ISC_MENTORING_WIX'`.

| Dirección | `type` | `payload` / efecto |
|---|---|---|
| HTML -> Wix | `READY` | `{version:'2.9'}`; handshake, no implica wiring terminado |
| HTML -> Wix | `HEIGHT` | `{height: number}`; altura calculada según contenido |
| HTML -> Wix | `OPEN_VIDEO` | `{title, videoUrl, sortOrder}`; NP4 nativo existente |
| HTML -> Wix | `PROFILE_SAVE_REQUEST` | perfil editable (ver objeto abajo) |
| HTML -> Wix | `FEEDBACK_SAVE_REQUEST` | `{overall, positive, improvements}` |
| HTML -> Wix | `OPEN_PROFILE` | objeto de perfil para NP5; incluye `id` |
| Wix -> HTML | `PING` | HTML responde `READY` |
| Wix -> HTML | `SET_VIDEOS` | Array de videos (`title`, `subtitle`, `description`, `videoUrl`, `thumbnail`, `sortOrder`, `isActive`) |
| Wix -> HTML | `SET_MEMBERS` | Array de miembros para renderizar tarjetas |
| Wix -> HTML | `PROFILE_OPEN_ACK` | `{id}` debe coincidir con el miembro solicitado |
| Wix -> HTML | `PROFILE_OPEN_FAILED` | Notifica error si no se abre NP5 |
| Wix -> HTML | `SAVE_RESULT` | `{success: boolean, message?: string}` |

### `PROFILE_SAVE_REQUEST` emitido por `profilePayload()`
```json
{
  "firstName": "", "lastName": "", "company": "", "jobTitle": "", "email": "",
  "visibility": "public",
  "roles": ["Mentor", "Mentee"],
  "types": ["Traditional", "Peer-to-Peer"],
  "photoPreview": "data:image/...;base64,... o cadena vacía",
  "mentor": {
    "CAREER LEVEL": ["Senior Leadership"],
    "FUNCTION": ["Distribution"],
    "AREA": ["Lloyd’s"],
    "bio": ""
  },
  "mentee": {
    "CAREER LEVEL": ["Middle Manage."],
    "FUNCTION": ["Underwriting"],
    "AREA": ["Regulated"],
    "bio": ""
  }
}
```
**Importante:** el HTML principal consume/produce claves de matriz EN MAYÚSCULA con espacio (`'CAREER LEVEL'`). No confundir con el popup, que usa `careerLevel`, `function`, `area`.

### Contrato esperado en `SET_MEMBERS`
Array de objetos `{id, firstName, lastName, initial, company, jobTitle, email, photo, roles, types, mentor, mentee}`. En el directorio principal la búsqueda local actual filtra por nombre, empresa, cargo y roles; el filtrado avanzado por preferencias deberá resolverse en backend con los datos existentes, sin alterar apariencia.

## B. Popup NP5
Wix -> NP5: `source: 'ISC_PROFILE_WIX'` y `type: 'SET_PROFILE'`, `payload`: el perfil.
NP5 -> Wix: `source: 'ISC_PROFILE_HTML'`.

| Dirección | `type` | `payload` / efecto |
|---|---|---|
| NP5 -> Wix | `READY` | Reintenta cada 350 ms hasta recibir `SET_PROFILE` |
| Wix -> NP5 | `SET_PROFILE` | Objeto miembro normalizado descrito abajo |
| NP5 -> Wix | `HEIGHT` | `{height}` |
| NP5 -> Wix | `CONTACT` | `{email}` |
| NP5 -> Wix | `CLOSE` | Sin payload exigido |

### `SET_PROFILE` esperado por el popup (normalizado)
```json
{
  "id": "member-record-id", "firstName": "Full", "lastName": "Name",
  "company": "Other", "jobTitle": "ISC Group", "email": "fullname@mail.com",
  "photo": "https://...", "roles": ["Mentor", "Mentee"],
  "types": ["Traditional", "Peer-to-Peer"],
  "mentor": {"careerLevel": ["Senior Leadership"], "function": ["Distribution"], "area": ["Lloyd’s"], "bio": ""},
  "mentee": {"careerLevel": ["Middle Manage."], "function": ["Broking"], "area": ["Regulated"], "bio": ""}
}
```
Los valores son solo ejemplo del contrato, no miembros reales. `photo` debe ser HTTPS; el popup rechaza otros protocolos para mostrar imagen.

## C. Puente obligatorio NP3 -> NP5
1. Usuario hace clic `PROFILE` en un miembro.
2. HTML NP3 envía `OPEN_PROFILE` con el objeto correspondiente.
3. Velo NP3 valida id y permiso, abre popup NP5 (nombre exacto de lightbox y componente HTML: **verificar en Wix mañana**), proporciona el id autorizado y envía `PROFILE_OPEN_ACK` o `PROFILE_OPEN_FAILED` al iframe principal.
4. Velo de NP5 espera `READY`, consulta perfil real/autorizado y envía `SET_PROFILE` al iframe del popup.
5. Procesa `HEIGHT`, `CONTACT` y `CLOSE` sin modificar HTML.
6. Probar apertura repetida, cancelación, privacidad y un perfil sin foto.

## D. No romper la integración existente
El archivo histórico `05_REFERENCIAS_HISTORICAS/ISC-Group-NP3-Mentoring.js` ya atiende `READY`/`PING`, `SET_VIDEOS` y `OPEN_VIDEO` hacia NP4. **No sustituirlo a ciegas:** ampliar sobre la versión Velo realmente presente en el editor, después de leerla y respaldarla. El NP3 histórico no maneja `SET_MEMBERS`, `OPEN_PROFILE`, `PROFILE_SAVE_REQUEST`, `FEEDBACK_SAVE_REQUEST`, `HEIGHT`.

## E. Seguridad de mensajes
Validar `message.source`, tipo, forma de payload y autorización en Velo. La comunicación cliente no acredita la identidad. El iframe principal ya registra `parentOrigin` cuando recibe mensajes, pero el backend debe controlar acceso a datos; no confiar en inputs del navegador.
