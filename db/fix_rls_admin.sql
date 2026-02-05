-- Script para configurar políticas RLS (Row Level Security) para admin
-- Execute este script no SQL Editor do Supabase

-- 1. Política para permitir que admin leia todos os agendamentos
CREATE POLICY "Admin pode ler todos os agendamentos"
ON agendamento
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM usuario
    WHERE usuario.id = auth.uid()::text
    AND usuario.cargo = 'admin'
  )
);

-- 2. Política para permitir que admin atualize todos os agendamentos
CREATE POLICY "Admin pode atualizar todos os agendamentos"
ON agendamento
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM usuario
    WHERE usuario.id = auth.uid()::text
    AND usuario.cargo = 'admin'
  )
);

-- 3. Política para permitir que admin delete agendamentos
CREATE POLICY "Admin pode deletar agendamentos"
ON agendamento
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM usuario
    WHERE usuario.id = auth.uid()::text
    AND usuario.cargo = 'admin'
  )
);

-- 4. Verificar políticas existentes na tabela agendamento
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'agendamento';
