-- Script completo para corrigir a tabela servico e inserir dados
-- Execute este script no SQL Editor do Supabase

-- Primeiro: alterar a coluna duracao de timestamp para integer
BEGIN;

-- Remover a coluna duracao existente (timestamp)
ALTER TABLE servico DROP COLUMN IF EXISTS duracao;

-- Adicionar nova coluna duracao como integer (minutos)
ALTER TABLE servico ADD COLUMN duracao integer;

COMMIT;

-- Segundo: inserir os serviços com duração em minutos
INSERT INTO servico (nome, descricao, preco, duracao) VALUES
('Banho', 'Banho completo com shampoo e condicionador', 50.00, 60),
('Tosa', 'Tosa higiênica ou completa', 80.00, 60),
('Hidratação', 'Hidratação profunda do pelo', 60.00, 60),
('Unhas', 'Corte e lixamento de unhas', 30.00, 60),
('Escovação', 'Escovação e desembaraço', 40.00, 60),
('Consulta', 'Consulta veterinária', 120.00, 60);

-- Verificar se os dados foram inseridos corretamente
SELECT * FROM servico;