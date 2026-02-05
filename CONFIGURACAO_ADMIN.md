# Configuração de Usuário Administrador

## Como funciona o sistema de Admin

O sistema agora possui uma página de administração (`adm.html`) onde usuários com cargo **"admin"** podem visualizar e gerenciar todos os agendamentos do estabelecimento.

## Funcionalidades da Página Admin

1. **Visualização de Todos os Agendamentos**
   - Lista completa de todos os agendamentos cadastrados
   - Informações do cliente (nome, telefone, email)
   - Data, hora, porte do animal
   - Serviços solicitados e valor total
   - Status atual do agendamento

2. **Gerenciamento de Status**
   - **Pendente** → Confirmar ou Cancelar
   - **Confirmado** → Marcar como Concluído ou Cancelar
   - **Concluído/Cancelado** → Somente visualização

3. **Filtros Disponíveis**
   - Por status (Pendente, Confirmado, Concluído, Cancelado)
   - Por data específica
   - Por nome do cliente

## Como Criar um Usuário Admin

### 1. No Banco de Dados Supabase

Acesse o **Supabase Dashboard** → **SQL Editor** e execute:

```sql
-- Atualizar um usuário existente para admin
UPDATE usuario
SET cargo = 'admin'
WHERE email = 'seu-email@exemplo.com';

-- OU criar um novo usuário admin diretamente
INSERT INTO usuario (nome, sobrenome, email, senha, telefone, cargo)
VALUES ('Admin', 'Sistema', 'admin@focinhogelado.com', 'senha-hash', '11999999999', 'admin');
```

### 2. Aplicar Políticas RLS para Admin

Execute o script `db/fix_rls_admin.sql` no **SQL Editor** do Supabase:

```sql
-- Este script cria políticas RLS que permitem ao admin:
-- - Ler todos os agendamentos (SELECT)
-- - Atualizar status dos agendamentos (UPDATE)
-- - Deletar agendamentos (DELETE)
```

**Importante**: As políticas RLS verificam se o usuário autenticado possui `cargo = 'admin'` na tabela `usuario`.

## Como Acessar a Página Admin

1. Faça login com uma conta que possui `cargo = 'admin'`
2. Acesse diretamente: `http://localhost:8080/adm.html`
3. Ou adicione um link no menu de navegação para usuários admin

### Validação de Acesso

O sistema verifica:
- ✅ Se o usuário está logado (localStorage)
- ✅ Se o cargo é "admin"
- ❌ Usuários não-admin são redirecionados para `index.html`

## Estrutura do Código

### Arquivos Modificados/Criados

- **adm.html**: Página de administração com interface completa
- **script/adm.js**: Lógica de carregamento e gerenciamento de agendamentos
- **css/adm.css**: Estilos específicos para a página admin
- **db/fix_rls_admin.sql**: Políticas RLS para acesso admin

### Funções Principais (adm.js)

```javascript
carregarTodosAgendamentos()    // Busca todos os agendamentos do banco
renderizarAgendamentos()       // Exibe os agendamentos na tela
alterarStatus()                // Atualiza o status de um agendamento
aplicarFiltros()               // Filtra agendamentos por status, data ou cliente
```

## Fluxo de Status dos Agendamentos

```
Pendente → Confirmado → Concluído
         ↓
      Cancelado
```

## Troubleshooting

### "Erro ao carregar agendamentos"
- Verifique se as políticas RLS foram aplicadas corretamente
- Confirme que o usuário tem `cargo = 'admin'` no banco

### "Acesso negado"
- Verifique se o usuário está logado
- Confirme que `localStorage.usuarioLogado.cargo === 'admin'`

### Agendamentos não aparecem
- Verifique se existem agendamentos no banco de dados
- Abra o console do navegador (F12) para ver logs detalhados

## Próximos Passos Sugeridos

- [ ] Adicionar link "Admin" no menu para usuários admin
- [ ] Implementar paginação para muitos agendamentos
- [ ] Adicionar gráficos/estatísticas de agendamentos
- [ ] Permitir edição de observações pelo admin
- [ ] Adicionar filtro por serviço específico
- [ ] Exportar relatório de agendamentos em PDF/Excel

## Exemplo de Uso

```javascript
// Verificar se usuário é admin no frontend
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
if (usuarioLogado && usuarioLogado.cargo === 'admin') {
  // Mostrar link para página admin
  document.getElementById('linkAdmin').style.display = 'block';
}
```
