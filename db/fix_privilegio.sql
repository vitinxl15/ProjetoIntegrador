-- Script para corrigir a tabela privilegio
-- Execute este script no SQL Editor do Supabase

-- Verificar dados atuais
SELECT * FROM privilegio;

-- Limpar dados existentes
DELETE FROM privilegio;

-- Inserir privilégios corretos
INSERT INTO privilegio (id, funcao, admin) VALUES
(1, 'admin', 'admin'),
(2, 'cliente', 'cliente');

-- Verificar se foi inserido corretamente
SELECT * FROM privilegio;

-- Para criar um usuário admin, você precisa:
-- 1. Cadastrar o usuário normalmente pelo site (ele será criado com id_privilegio_fk = NULL ou padrão)
-- 2. Depois executar:
-- UPDATE usuario SET id_privilegio_fk = 1 WHERE email = 'seu-email-admin@exemplo.com';

-- Para verificar usuários e seus privilégios:
SELECT 
  u.id,
  u.email,
  u.id_privilegio_fk,
  p.funcao as tipo_privilegio
FROM usuario u
LEFT JOIN privilegio p ON u.id_privilegio_fk = p.id;
