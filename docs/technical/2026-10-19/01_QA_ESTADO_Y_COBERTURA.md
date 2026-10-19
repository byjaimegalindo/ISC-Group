# Matriz QA · estado verificado 19 octubre 2026

| Prueba | Estado | Evidencia / limitación |
|---|---|---|
| C01 Colecciones privadas | ✅ EN WIX | MentoringProfiles y MentoringFeedback creadas, permisos ADMIN. |
| Unicidad y filtros | ✅ EN WIX | Índices is_member_unique y visibility ACTIVE. Nombres exactos en documento principal. |
| Backfill 3 miembros | ✅ EN WIX | `_id` = `memberId`; contacto separado; 2 fotos nativas; privado. |
| C02 Vídeos | PARCIAL | Contador de Wix = 3; no se probó NP4 desde navegador. |
| A01/A02 Auth y rechazo anónimo | LOCAL | Tests mock; backend no instalado en Velo ni probado con sesión real. |
| P01 Guardar perfil real | PENDIENTE | Colección existe; bridge Velo sin instalar. |
| P02 Editar, recargar y precargar formulario | BLOQUEADO | No existe mensaje inbound para hidratar `Your Profile` en HTML congelado. |
| P03/P04 Validaciones matrices | LOCAL | Simulado y comparado con categorías exactas de HTML. |
| P05/P06 Privacidad / identidad | LOCAL | Mock probado, necesita cuentas A/B reales. |
| M01/M02 Directorio sin samples | PENDIENTE | Wix Velo NP3 debe mandar `SET_MEMBERS` incluso vacío. |
| M03 Popup NP5 | PENDIENTE | Confirmar lightbox name e iframe id + código actual. |
| M05 Contact | PENDIENTE | Email debe salir de backend, no payload del iframe. |
| FB01 Feedback | LOCAL | Función implementada y probada en mocks, no instalada. |
| Subida de foto | LOCAL | Firma MIME comprobada y Media Manager llamado con mock; prueba real pendiente. |
| F01/F02 visual | BLOQUEADO PERO INTACTO | Los HTML canónicos no se tocaron. Wix parity no ejecutada. |
| G01 GitHub | BLOQUEADO | Repositorio ISC no accesible. |

**Regla de salida:** no confundir creación CMS + código de referencia con operación end-to-end. No publicar hasta pruebas reales y aprobación expresa.
