-- Script para corrigir as políticas de RLS (Row-Level Security) no Supabase
-- Execute este script no SQL Editor do Supabase

-- ==========================================
-- POLÍTICAS PARA TABELA AGENDAMENTO
-- ==========================================

-- Remover políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Allow authenticated users to insert agendamentos" ON agendamento;
DROP POLICY IF EXISTS "Users can insert their own agendamentos" ON agendamento;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON agendamento;

-- Criar política de INSERT para agendamento (permite qualquer usuário autenticado)
CREATE POLICY "Enable insert for authenticated users"
ON agendamento
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Criar política de SELECT para agendamento (cada usuário vê apenas seus agendamentos)
CREATE POLICY "Users can view their own agendamentos"
ON agendamento
FOR SELECT
TO authenticated
USING (
  id_cliente_fk IN (
    SELECT id FROM cliente WHERE id_usuario_fk = auth.uid()
  )
);

-- Criar política de UPDATE para agendamento
CREATE POLICY "Users can update their own agendamentos"
ON agendamento
FOR UPDATE
TO authenticated
USING (
  id_cliente_fk IN (
    SELECT id FROM cliente WHERE id_usuario_fk = auth.uid()
  )
);

-- ==========================================
-- POLÍTICAS PARA TABELA AGENDAMENTO_ITEM
-- ==========================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Allow authenticated users to insert agendamento_item" ON agendamento_item;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON agendamento_item;

-- Criar política de INSERT para agendamento_item
CREATE POLICY "Enable insert for authenticated users"
ON agendamento_item
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Criar política de SELECT para agendamento_item
CREATE POLICY "Users can view their own agendamento items"
ON agendamento_item
FOR SELECT
TO authenticated
USING (
  id_agendamento_fk IN (
    SELECT id FROM agendamento WHERE id_cliente_fk IN (
      SELECT id FROM cliente WHERE id_usuario_fk = auth.uid()
    )
  )
);

-- ==========================================
-- VERIFICAR SE RLS ESTÁ ATIVADO
-- ==========================================

-- Se RLS não estiver ativado, ative-o (isso é importante para segurança)
ALTER TABLE agendamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamento_item ENABLE ROW LEVEL SECURITY;

-- Mensagem de sucesso
SELECT 'Políticas RLS aplicadas com sucesso!' as status;
