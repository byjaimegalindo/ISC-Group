# Guion operativo de la próxima sesión (leer antes de tocar Wix)

## Entrada de la sesión
“ISC Group Mentor/Mentee: frontend totalmente aprobado y BLOQUEADO. Lee `/ISC_GROUP_HANDOFF_2026-10-16/00_LEER_PRIMERO/00_COMENZAR_AQUI.md` y los demás docs del ZIP. HTML canónicos: Mentoring v3.5 y popup NP5 v2.0; no alterar absolutamente nada de su UI. A continuación inspecciona el CMS de la web de desarrollo y el Velo NP3/NP4/NP5 existentes, crea las colecciones propuestas tras validar las claves/tipos, conecta login Wix Members, persistencia de perfiles, directorio y popup, feedback y permisos. Prueba con 2 usuarios antes de afirmar que está operativo. GitHub remoto isc-group aún pendiente: no atribuir push si no se hizo.”

## Primeros diez minutos
1. Confirmar sitio y copia/preview; no publicar.
2. Leer estado real actual de CMS; verificar videos existentes.
3. Comparar el Velo actual con `05_REFERENCIAS_HISTORICAS/ISC-Group-NP3-Mentoring.js`, sin sobrescribirlo.
4. Confirmar nombre/id de `#html1`, NP4 y NP5 y sus mensajes.
5. Revisar hashes de frontend; si no coinciden, detenerse y localizar la causa.

## Orden de prioridad
P0: no regresión visual / seguridad de perfiles / acceso miembros.
P1: perfiles CMS + SAVE_RESULT + directorio real SET_MEMBERS + popup SET_PROFILE.
P2: feedback + foto real + altura y tests 2 usuarios.
P3: conexiones mentor/mentee sin chat, solo cuando el flujo y los controles estén aprobados; GitHub push después de identificar remoto.

## Detenerse y pedir intervención manual SOLO para
- Elegir editor/sitio correcto si la cuenta tiene más de uno o cambió el site ID.
- Confirmar identidad de lightbox/iframe cuando Wix no la expone en las herramientas.
- Confirmar creación/enlace del repositorio GitHub si no existe.
- Dar acceso/permisos en el editor o probar login de dos miembros.
- Aprobar cualquier cambio que altere UI/estilos/botones que hoy están bloqueados.

## Definición de trabajo terminado
No basta con existir una colección: guardar/leer debe funcionar con cuenta real, ocultación privada, popup conectado, sin datos de muestra, sin modificar frontend, y con evidencias del QA. El flujo completo se publica solo después de aceptación.
