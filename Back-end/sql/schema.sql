INSERT INTO "Grupos" (id, nombre, "createdAt", "updatedAt") VALUES
(1, 'Administrador', NOW(), NOW()),
(2, 'Registrador_Iglesias', NOW(), NOW()),
(3, 'Consulta', NOW(), NOW());

INSERT INTO "Permisos" (id, nombre, "createdAt", "updatedAt") VALUES
(1, 'frm_iglesias', NOW(), NOW()),
(2, 'frm_usuarios', NOW(), NOW()),
(3, 'frm_grupos', NOW(), NOW()),
(4, 'frm_permisos', NOW(), NOW());

INSERT INTO "GrupoPermisos" (grupo, permiso, "createdAt", "updatedAt") VALUES
(1, 1, NOW(), NOW()), 
(1, 2, NOW(), NOW()), 
(1, 3, NOW(), NOW()), 
(1, 4, NOW(), NOW()), 
(2, 1, NOW(), NOW());