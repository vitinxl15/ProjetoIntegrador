# Documentação da Arquitetura Backend-Frontend
## Projeto: Focinho Gelado

**Data:** 31 de Janeiro de 2026

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura Atual](#arquitetura-atual)
3. [Fluxo de Comunicação](#fluxo-de-comunicação)
4. [Detalhamento por Módulo](#detalhamento-por-módulo)
5. [Problemas Identificados](#problemas-identificados)
6. [Recomendações](#recomendações)

---

## 🎯 Visão Geral

O projeto possui **duas abordagens distintas** para gerenciamento de dados que coexistem no código:

1. **Supabase (Backend em Nuvem)** - Banco de dados PostgreSQL remoto
2. **LocalStorage (Client-Side)** - Armazenamento local no navegador

### Estrutura de Arquivos

```
ProjetoIntegrador/
├── index.html              # Página principal
├── cadastro.html           # Página de cadastro
├── login.html              # Página de login
├── perfil.html             # Página de perfil do usuário
├── adm.html                # Página administrativa
├── agendamento.html        # Agendamentos
├── sobre.html              # Sobre o projeto
│
├── css/
│   ├── style.css           # Estilos globais
│   ├── perfil.css          # Estilos do perfil
│   └── adm.css             # Estilos administrativos
│
├── script/
│   ├── server.js           # ⚠️ Integração Supabase
│   ├── app.js              # ⚠️ Lógica LocalStorage
│   ├── perfil.js           # UI do perfil
│   ├── supabase.js         # Config Supabase (ES6)
│   ├── adm.js              # Lógica administrativa
│   └── usuários.js         # (vazio)
│
└── db/
    ├── serviços.json
    └── usuarios.json
```

---

## 🏗️ Arquitetura Atual

### **Abordagem 1: Supabase (Backend em Nuvem)**

**Arquivo:** `script/server.js`

#### Configuração
```javascript
const supabaseUrl = "https://uhhagvmmxtcavngjdaik.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)
```

#### Estrutura do Banco de Dados

**Tabela: `usuario`**
| Campo              | Tipo    | Descrição                          |
|--------------------|---------|------------------------------------|
| id                 | INTEGER | Primary Key (auto-increment)       |
| email              | TEXT    | Email do usuário                   |
| senha              | TEXT    | Senha (⚠️ texto plano)            |
| id_privilegio_fk   | INTEGER | Foreign Key para privilégios       |

**Tabela: `cliente`**
| Campo           | Tipo    | Descrição                          |
|-----------------|---------|------------------------------------|
| id              | INTEGER | Primary Key                        |
| nome            | TEXT    | Nome completo                      |
| cpf             | TEXT    | CPF do cliente                     |
| id_usuario_fk   | INTEGER | Foreign Key para tabela usuario (UNIQUE) |

**Tabela: `privilegio`**
| Campo    | Tipo    | Descrição                          |
|----------|---------|------------------------------------|
| id       | INTEGER | Primary Key                        |
| funcao   | ENUM    | Função do usuário (cliente/admin)  |

**Tabela: `animal`**
| Campo         | Tipo    | Descrição                          |
|---------------|---------|------------------------------------|
| id            | INTEGER | Primary Key                        |
| nome          | TEXT    | Nome do animal                     |
| especie       | TEXT    | Espécie (cão, gato, etc)          |
| raca          | TEXT    | Raça do animal                     |
| sexo          | TEXT    | Sexo (M/F)                        |
| idade         | INTEGER | Idade em anos                      |
| temperamento  | TEXT    | Temperamento do animal             |

**Tabela: `bando`** (Relacionamento Cliente-Animal)
| Campo           | Tipo    | Descrição                          |
|-----------------|---------|------------------------------------|
| id              | INTEGER | Primary Key                        |
| id_cliente_fk   | INTEGER | Foreign Key para cliente           |
| id_animal_fk    | INTEGER | Foreign Key para animal            |

**Tabela: `servico`**
| Campo     | Tipo      | Descrição                          |
|-----------|-----------|------------------------------------|
| id        | INTEGER   | Primary Key                        |
| nome      | TEXT      | Nome do serviço                    |
| descricao | TEXT      | Descrição detalhada                |
| duracao   | TIMESTAMP | Duração do serviço                 |
| preco     | NUMERIC   | Preço do serviço                   |

**Tabela: `agendamento`**
| Campo           | Tipo      | Descrição                          |
|-----------------|-----------|------------------------------------|
| id              | INTEGER   | Primary Key                        |
| id_cliente_fk   | INTEGER   | Foreign Key para cliente           |
| data_hora       | TIMESTAMP | Data e hora do agendamento         |
| status          | TEXT      | Status (Pendente/Confirmado/etc)  |
| total           | TEXT      | Valor total do agendamento         |

**Tabela: `agendamento_item`** (Serviços do Agendamento)
| Campo               | Tipo    | Descrição                          |
|---------------------|---------|------------------------------------|
| id                  | INTEGER | Primary Key                        |
| id_agendamento_fk   | INTEGER | Foreign Key para agendamento       |
| id_servico_fk       | INTEGER | Foreign Key para servico           |

**Tabela: `contato`**
| Campo           | Tipo    | Descrição                          |
|-----------------|---------|------------------------------------|
| id              | INTEGER | Primary Key                        |
| id_cliente_fk   | INTEGER | Foreign Key para cliente           |
| celular         | TEXT    | Número de celular                  |
| telefone        | TEXT    | Número de telefone fixo            |

**Tabela: `endereco`**
| Campo           | Tipo    | Descrição                          |
|-----------------|---------|------------------------------------|
| id              | INTEGER | Primary Key                        |
| id_cliente_fk   | INTEGER | Foreign Key para cliente           |
| rua             | TEXT    | Nome da rua                        |
| numero          | TEXT    | Número                             |
| complemento     | TEXT    | Complemento                        |
| bairro          | TEXT    | Bairro                             |
| cidade          | TEXT    | Cidade                             |
| estado          | TEXT    | Estado (UF)                        |
| cep             | TEXT    | CEP                                |

**Tabela: `quadro-clinico`**
| Campo         | Tipo    | Descrição                          |
|---------------|---------|------------------------------------|
| id            | INTEGER | Primary Key                        |
| id_animal_fk  | INTEGER | Foreign Key para animal            |
| alergia       | TEXT    | Alergias do animal                 |
| transtorno    | TEXT    | Transtornos comportamentais        |
| diagnostico   | TEXT    | Diagnósticos médicos               |
| observacao    | TEXT    | Observações gerais                 |

**Tabela: `taxi_dog`**
| Campo               | Tipo    | Descrição                          |
|---------------------|---------|------------------------------------|
| id                  | INTEGER | Primary Key                        |
| id_agendamento_fk   | INTEGER | Foreign Key para agendamento       |
| id_endereco_fk      | INTEGER | Foreign Key para endereco          |
| preco               | NUMERIC | Preço do transporte                |

#### Funcionalidades Implementadas

##### 1. **Cadastro de Usuário**
```javascript
async function cadastrarUsuario(nome, cpf, email, senha, idPrivilegio)
```

**Fluxo:**
1. Intercepta submit do formulário `#formCadastro`
2. Valida se as senhas coincidem
3. Insere dados na tabela `usuario`
4. Insere dados vinculados na tabela `cliente`
5. Redireciona para `login.html`

**Chamadas ao Backend:**
```javascript
// INSERT na tabela usuario
supabaseClient.from("usuario").insert([{...}])

// INSERT na tabela cliente
supabaseClient.from("cliente").insert([{...}])
```

##### 2. **Login de Usuário**
```javascript
async function loginUsuario(email, senha)
```

**Fluxo:**
1. Intercepta submit do formulário `#formLogin`
2. Consulta Supabase com filtros de email e senha
3. Armazena dados do usuário no `localStorage`
4. Redireciona para `index.html`

**Consulta ao Backend:**
```javascript
// SELECT na tabela usuario
supabaseClient
  .from("usuario")
  .select("id, email, id_privilegio_fk")
  .eq("email", email)
  .eq("senha", senha)
  .single()
```

---

### **Abordagem 2: LocalStorage (Client-Side)**

**Arquivo:** `script/app.js`

#### Armazenamento de Dados

```javascript
// Estrutura no localStorage
{
  "usuarios": [
    { "nome": "João Silva", "email": "joao@email.com", "senha": "123456" },
    { "nome": "Maria Santos", "email": "maria@email.com", "senha": "abcdef" }
  ],
  "usuarioLogado": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456"
  }
}
```

#### Funcionalidades Implementadas

##### 1. **Cadastro**
```javascript
// Intercepta #formCadastro
const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
usuarios.push({ nome, email, senha })
localStorage.setItem("usuarios", JSON.stringify(usuarios))
```

##### 2. **Login**
```javascript
// Busca usuário no array
const usuario = usuarios.find(u => u.email === email && u.senha === senha)

// Lógica especial para admin
if(usuario.nome === "admin") {
  window.location.href = "adm.html"
}
```

##### 3. **Gerenciamento de Sessão**
```javascript
// Verifica usuário logado ao carregar página
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))

if (usuarioLogado) {
  // Mostra saudação
  saudacaoDiv.textContent = `Olá, ${usuarioLogado.nome}!`
  
  // Ajusta visibilidade dos botões
  btnCadastro.style.display = "none"
  btnLogin.style.display = "none"
  btnSair.style.display = "inline-block"
}
```

##### 4. **Logout**
```javascript
btnSair.addEventListener("click", (e) => {
  localStorage.removeItem("usuarioLogado")
  window.location.reload()
})
```

---

### **Módulo de Interface: Perfil**

**Arquivo:** `script/perfil.js`

#### Funcionalidade
- Gerencia apenas a **interface do usuário**
- Alterna entre seções: Informações, Cachorros, Agendamentos
- **Não faz** requisições ao backend

```javascript
// Navegação entre abas
perfil.addEventListener("click", () => {
  info.style.display = "flex"
  dogList.style.display = "none"
  agenda.style.display = "none"
})
```

---

## 🔄 Fluxo de Comunicação

### **Diagrama: Cadastro com Supabase**

```
┌─────────────────┐
│  cadastro.html  │
│                 │
│  Formulário     │
│  #formCadastro  │
└────────┬────────┘
         │ submit
         ↓
┌─────────────────┐
│   server.js     │
│                 │
│ addEventListener │
│ ("submit")      │
└────────┬────────┘
         │ async call
         ↓
┌─────────────────────────────────┐
│  async cadastrarUsuario()       │
│                                 │
│  1. INSERT INTO usuario         │
│  2. INSERT INTO cliente         │
│                                 │
│  ↓ API Fetch                    │
│  https://uhhagvmmxtcavngjdaik   │
│  .supabase.co/rest/v1/usuario   │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────┐
│  Supabase       │
│  PostgreSQL     │
│                 │
│  Tabelas:       │
│  - usuario      │
│  - cliente      │
└────────┬────────┘
         │ response
         ↓
┌─────────────────┐
│  Sucesso?       │
│  ├─ Sim         │
│  │  └─ alert() │
│  │  └─ redirect│
│  └─ Não        │
│     └─ error   │
└─────────────────┘
---

## 🔄 Fluxo Completo: Login → Agendamento

### **Passo a Passo do Usuário**

```
1. CADASTRO (cadastro.html)
   ↓
2. LOGIN (login.html)
   ↓
3. HOME (index.html)
   ↓
4. PERFIL (perfil.html) - Ver animais e agendamentos
   ↓
5. AGENDAR SERVIÇO (agendamento.html)
   ↓
6. CONFIRMAR AGENDAMENTO
   ↓
7. VOLTAR AO PERFIL - Ver agendamento criado
```

### **Arquitetura do Fluxo**

**Arquivo criado:** `script/agendamento.js`

#### **Funções Implementadas:**

1. **buscarCliente(idUsuario)**
   - Busca dados do cliente pelo ID do usuário logado
   - Retorna: `{ id, nome, cpf }`

2. **buscarAnimaisCliente(idCliente)**
   - Lista todos os animais (pets) do cliente
   - JOIN com tabela `bando` e `animal`
   - Retorna: array de animais com dados completos

3. **listarServicos()**
   - Lista todos os serviços disponíveis no petshop
   - Retorna: `[{ id, nome, descricao, preco, duracao }]`

4. **criarAgendamento(idCliente, dataHora, servicosSelecionados)**
   - Cria novo agendamento
   - Calcula total automaticamente
   - Insere itens na tabela `agendamento_item`
   - Status inicial: "Pendente"

5. **buscarAgendamentos(idCliente)**
   - Lista todos os agendamentos do cliente
   - JOIN com serviços para mostrar detalhes
   - Ordena por data (mais recentes primeiro)

6. **cadastrarAnimal(nome, especie, raca, sexo, idade, temperamento, idCliente)**
   - Cadastra novo animal
   - Vincula ao cliente na tabela `bando`

7. **atualizarStatusAgendamento(idAgendamento, novoStatus)**
   - Atualiza status do agendamento
   - Ex: "Pendente" → "Confirmado" → "Concluído"

### **Integração com Frontend**

#### **agendamento.html**
```html
<!-- Lista de serviços -->
<div id="listaServicos"></div>

<!-- Seletor de data/hora -->
<input type="datetime-local" id="dataHora" required>

<!-- Botão confirmar -->
<button type="submit">Agendar</button>
```

#### **perfil.html**
```html
<!-- Lista de animais -->
<div id="listaAnimais"></div>

<!-- Lista de agendamentos -->
<div id="listaAgendamentos"></div>
```

### **Fluxo de Dados Detalhado**

#### **1. Após Login (login.html)**
```javascript
// server.js salva no localStorage
localStorage.setItem("usuarioLogado", JSON.stringify({
  id: 123,
  email: "joao@email.com",
  id_privilegio_fk: 1
}))
```

#### **2. Carregamento da Página de Agendamento**
```javascript
// agendamento.js
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
const cliente = await buscarCliente(usuarioLogado.id)
// cliente = { id: 45, nome: "João Silva", cpf: "123.456.789-00" }

const servicos = await listarServicos()
// servicos = [
//   { id: 1, nome: "Banho", preco: 50.00 },
//   { id: 2, nome: "Tosa", preco: 80.00 }
// ]
```

#### **3. Usuário Seleciona Serviços**
```javascript
// Frontend renderiza checkboxes
// Usuário marca: "Banho" e "Tosa"
// Seleciona data: "2026-02-15T10:00"
```

#### **4. Criação do Agendamento**
```javascript
const servicosSelecionados = [
  { id: 1, preco: 50.00 },
  { id: 2, preco: 80.00 }
]

const resultado = await criarAgendamento(
  cliente.id,           // 45
  "2026-02-15T10:00",
  servicosSelecionados
)

// Backend executa:
// 1. INSERT agendamento (total: 130.00, status: "Pendente")
// 2. INSERT agendamento_item para cada serviço
```

#### **5. Visualização no Perfil**
```javascript
// perfil.html carrega
const agendamentos = await buscarAgendamentos(cliente.id)

// Mostra:
// Data: 15/02/2026 10:00
// Status: Pendente
// Serviços: Banho, Tosa
// Total: R$ 130,00
```

### **Diagrama de Sequência**

```
Usuario          Frontend           agendamento.js       Supabase
  |                  |                     |                 |
  |--[Abre página]-->|                     |                 |
  |                  |--buscarCliente()-->|                 |
  |                  |                     |--SELECT cliente->|
  |                  |                     |<----cliente-----|
  |                  |<----dados-----------|                 |
  |                  |                     |                 |
  |                  |--listarServicos()-->|                 |
  |                  |                     |--SELECT servico->|
  |                  |<----array servicos--|                 |
  |                  |                     |                 |
  |--[Seleciona]--->|                     |                 |
  |--[Confirma]----->|                     |                 |
  |                  |--criarAgendamento()->|                |
  |                  |                     |--INSERT agend.->|
  |                  |                     |--INSERT itens-->|
  |                  |<----sucesso---------|                 |
  |<--[Redirect perfil]|                   |                 |
  |                  |                     |                 |
  |--[Abre perfil]-->|                     |                 |
  |                  |--buscarAgendamentos()>|               |
  |                  |                     |--SELECT c/ JOIN>|
  |                  |<----agendamentos----|                 |
  |<--[Mostra lista]-|                     |                 |
```

### **Relacionamentos Entre Tabelas**

```
usuario (1) ←---→ (1) cliente
                      ↓ (1)
                      |
                      ↓ (N)
                  agendamento
                      ↓ (1)
                      |
                      ↓ (N)
              agendamento_item
                      ↓ (N)
                      |
                      ↓ (1)
                   servico

cliente (1) ←---→ (N) bando ←---→ (N) animal
```

```

### **Diagrama: Login com LocalStorage**

```
┌─────────────────┐
│   login.html    │
│                 │
│  Formulário     │
│  #formLogin     │
└────────┬────────┘
         │ submit
         ↓
┌─────────────────────────────────┐
│        app.js                   │
│                                 │
│  addEventListener("submit")     │
│                                 │
│  1. Captura email/senha         │
│  2. localStorage.getItem()      │
│  3. Array.find()                │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────┐
│   localStorage (Browser)    │
│                             │
│  Key: "usuarios"            │
│  Value: JSON Array          │
└────────┬────────────────────┘
         │
         ↓
┌─────────────────────────────┐
│  Usuário encontrado?        │
│  ├─ Sim                     │
│  │  └─ setItem()            │
│  │      "usuarioLogado"     │
│  │  └─ Redirect index.html  │
│  └─ Não                     │
│     └─ alert("Inválido")    │
└─────────────────────────────┘
```

### **Diagrama: Verificação de Sessão**

```
┌─────────────────┐
│   index.html    │
│                 │
│  DOMContentLoaded│
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────┐
│        app.js                   │
│                                 │
│  localStorage.getItem()         │
│  "usuarioLogado"                │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────┐
│  Usuário logado?            │
│  ├─ Sim                     │
│  │  └─ Mostra saudação      │
│  │  └─ Oculta Cadastro/Login│
│  │  └─ Mostra botão Sair    │
│  └─ Não                     │
│     └─ Mostra Cadastro/Login│
│     └─ Oculta Sair          │
└─────────────────────────────┘
```

---

## ⚠️ Problemas Identificados

### **1. Duplicação de Lógica**

**Problema:** Existem duas implementações diferentes para cadastro e login:
- `server.js` → Supabase (cloud)
- `app.js` → LocalStorage (local)

**Impacto:**
- Dados não sincronizados entre as duas abordagens
- Confusão sobre qual sistema está ativo
- Possíveis bugs de inconsistência

**Exemplo:**
```javascript
// Em server.js - dados vão para Supabase
await supabaseClient.from("usuario").insert([{...}])

// Em app.js - dados vão para localStorage
localStorage.setItem("usuarios", JSON.stringify(usuarios))

// ❌ Esses dados NÃO se comunicam!
```

---

### **2. Scripts Não Carregados nos HTMLs**

**Problema:** Os arquivos HTML não incluem tags `<script>` para carregar `server.js` ou `app.js`

**Arquivos afetados:**
- `cadastro.html` - falta carregar scripts
- `login.html` - falta carregar scripts
- `index.html` - falta carregar scripts

**Impacto:**
- Funções de cadastro/login não executam
- Event listeners não são registrados
- Aplicação não funciona

**Solução esperada:**
```html
<!-- Antes do fechamento </body> -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="script/server.js"></script>
<!-- OU -->
<script src="script/app.js"></script>
```

---

### **3. Senhas em Texto Plano**

**Problema:** Senhas armazenadas sem criptografia

**Localização:**
```javascript
// server.js - linha 74
.eq("senha", senha)   // ⚠️ em produção use hash de senha

// app.js - linha 60
{ nome, email, senha }  // ⚠️ senha sem hash
```

**Risco:**
- Violação de segurança grave
- Não conforme com LGPD
- Senhas expostas em caso de vazamento

**Recomendação:**
```javascript
// Usar biblioteca como bcrypt
const senhaHash = await bcrypt.hash(senha, 10)
// Armazenar senhaHash ao invés de senha
```

---

### **4. Conflito de Módulos ES6**

**Problema:** `supabase.js` usa `import/export` (ES6 modules), mas outros scripts usam CDN

**Arquivo:** `script/supabase.js`
```javascript
import { createClient } from '@supabase/supabase-js'  // ❌ Não funciona sem bundler
export default supabase
```

**Conflito:**
- Browsers não suportam `import` direto sem type="module"
- `server.js` usa CDN: `supabase.createClient()` diretamente
- `supabase.js` nunca é usado de fato

**Solução:**
- Usar CDN em todos os arquivos, OU
- Configurar bundler (Webpack/Vite) para módulos ES6

---

### **5. Variável `supabase` Não Definida**

**Problema:** Em `server.js`, linha 74:
```javascript
const { data, error } = await supabase.from("usuario")
//                            ^^^^^^^^ 
//                            Deveria ser: supabaseClient
```

**Correção:**
```javascript
const { data, error } = await supabaseClient.from("usuario")
```

---

### **6. Falta de Validação de Dados**

**Problemas:**
- Não valida formato de email
- Não valida força da senha
- Não valida formato do CPF
- Aceita campos vazios após `.trim()`

**Exemplo atual:**
```javascript
if (!nome || !email || !senha) {  // ✅ Valida vazio
  alert("Preencha todos os campos.")
}
// ❌ Mas não valida: email@invalido, senha "123", CPF errado
```

---

### **7. Estrutura de Dados Inconsistente**

**LocalStorage:**
```javascript
{ nome, email, senha }  // 3 campos
```

**Supabase:**
```javascript
// usuario: { email, senha, id_privilegio_fk }
// cliente: { nome, cpf, id_usuario_fk }
// 5 campos divididos em 2 tabelas
```

**Impacto:** Dados não são intercambiáveis entre os sistemas

---

## 💡 Recomendações

### **Prioridade ALTA**

#### 1. **Escolher UMA Abordagem**

**Opção A: Usar Supabase (Recomendado)**
- ✅ Dados persistem entre dispositivos
- ✅ Backup automático
- ✅ Escalável
- ✅ Suporta relacionamentos complexos
- ❌ Requer conexão com internet

**Ações:**
1. Remover código de LocalStorage de `app.js`
2. Manter apenas lógica Supabase em `server.js`
3. Adicionar `<script>` nos HTMLs

**Opção B: Usar LocalStorage**
- ✅ Funciona offline
- ✅ Sem custos de servidor
- ✅ Mais simples
- ❌ Dados perdidos ao limpar navegador
- ❌ Não compartilha entre dispositivos

**Ações:**
1. Remover `server.js` e `supabase.js`
2. Manter apenas `app.js`
3. Adicionar `<script>` nos HTMLs

---

#### 2. **Adicionar Scripts nos HTMLs**

**cadastro.html:**
```html
<!-- Antes de </body> -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="script/server.js"></script>
```

**login.html:**
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="script/server.js"></script>
```

**index.html:**
```html
<script src="script/app.js"></script>
```

---

#### 3. **Implementar Hash de Senhas**

**Biblioteca:** bcrypt.js (para navegador)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js"></script>
```

**Cadastro:**
```javascript
const senhaHash = await bcrypt.hash(senha, 10)
// Armazenar senhaHash ao invés de senha
```

**Login:**
```javascript
const match = await bcrypt.compare(senhaDigitada, senhaArmazenada)
if (match) { /* login bem-sucedido */ }
```

---

### **Prioridade MÉDIA**

#### 4. **Adicionar Validações**

```javascript
// Validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '')
  if (cpf.length !== 11) return false
  // Implementar algoritmo de validação de CPF
}

// Validar senha forte
function validarSenha(senha) {
  return senha.length >= 8 && 
         /[A-Z]/.test(senha) &&  // Maiúscula
         /[a-z]/.test(senha) &&  // Minúscula
         /[0-9]/.test(senha)     // Número
}
```

---

#### 5. **Corrigir Bug no server.js (linha 74)**

```javascript
// ❌ Errado
const { data, error } = await supabase.from("usuario")

// ✅ Correto
const { data, error } = await supabaseClient.from("usuario")
```

---

#### 6. **Implementar Tratamento de Erros**

```javascript
async function cadastrarUsuario(nome, cpf, email, senha, idPrivilegio) {
  try {
    // Validações
    if (!validarEmail(email)) {
      throw new Error("Email inválido")
    }
    
    // Operações no banco
    const { data, error } = await supabaseClient.from("usuario").insert([...])
    
    if (error) {
      // Log detalhado
      console.error("Erro Supabase:", error)
      
      // Mensagem amigável ao usuário
      if (error.code === '23505') {  // Duplicate key
        throw new Error("Email já cadastrado")
      }
      throw new Error("Erro ao cadastrar. Tente novamente.")
    }
    
    return data
    
  } catch (erro) {
    alert(erro.message)
    return null
  }
}
```

---

#### 7. **Unificar Estrutura de Dados**

Se optar por LocalStorage, espelhe a estrutura do Supabase:

```javascript
// localStorage: "usuarios"
[
  {
    id: 1,
    email: "joao@email.com",
    senha: "hash...",
    id_privilegio: 1,
    cliente: {
      nome: "João Silva",
      cpf: "123.456.789-00"
    }
  }
]
```

---

### **Prioridade BAIXA**

#### 8. **Documentar Código**

```javascript
/**
 * Cadastra um novo usuário no sistema
 * @param {string} nome - Nome completo do usuário
 * @param {string} cpf - CPF no formato XXX.XXX.XXX-XX
 * @param {string} email - Email válido
 * @param {string} senha - Senha com mínimo 8 caracteres
 * @param {number} idPrivilegio - 1 para cliente, 2 para admin
 * @returns {Promise<Object|null>} Dados do usuário ou null em caso de erro
 */
async function cadastrarUsuario(nome, cpf, email, senha, idPrivilegio) {
  // ...
}
```

---

#### 9. **Separar Configuração**

**Criar:** `script/config.js`
```javascript
const CONFIG = {
  supabase: {
    url: "https://uhhagvmmxtcavngjdaik.supabase.co",
    key: "sua-chave-aqui"
  },
  privilegios: {
    CLIENTE: 1,
    ADMIN: 2
  }
}
```

---

#### 10. **Adicionar Loading States**

```javascript
async function cadastrarUsuario(...) {
  const botao = document.querySelector("button[type='submit']")
  
  // Desabilita botão durante requisição
  botao.disabled = true
  botao.textContent = "Cadastrando..."
  
  try {
    const resultado = await supabaseClient.from("usuario").insert([...])
    // ...
  } finally {
    // Reabilita botão
    botao.disabled = false
    botao.textContent = "Cadastrar"
  }
}
```

---

## 📊 Comparação: Supabase vs LocalStorage

| Critério                  | Supabase              | LocalStorage          |
|---------------------------|-----------------------|-----------------------|
| **Persistência**          | ✅ Permanente         | ⚠️ Pode ser apagado  |
| **Multi-dispositivo**     | ✅ Sim                | ❌ Não               |
| **Offline**               | ❌ Requer internet    | ✅ Funciona offline  |
| **Segurança**             | ✅ Backend seguro     | ⚠️ Dados expostos    |
| **Capacidade**            | ✅ Ilimitado*         | ⚠️ ~5-10MB           |
| **Complexidade**          | ⚠️ Média              | ✅ Baixa             |
| **Custo**                 | ⚠️ Free tier limitado | ✅ Grátis            |
| **Backup**                | ✅ Automático         | ❌ Manual            |
| **Relacionamentos**       | ✅ SQL completo       | ⚠️ JSON manual       |

*Supabase free tier: 500MB de banco de dados

---

## 🚀 Plano de Ação Sugerido

### **Fase 1: Corrigir Imediato (1-2 horas)**
- [ ] Decidir: Supabase OU LocalStorage
- [ ] Remover código da abordagem não escolhida
- [ ] Adicionar tags `<script>` nos HTMLs
- [ ] Corrigir bug `supabase` → `supabaseClient`
- [ ] Testar cadastro e login

### **Fase 2: Segurança (2-3 horas)**
- [ ] Implementar hash de senhas (bcrypt.js)
- [ ] Adicionar validações (email, CPF, senha)
- [ ] Tratamento de erros adequado
- [ ] Feedback visual (loading states)

### **Fase 3: Melhorias (3-4 horas)**
- [ ] Documentar funções principais
- [ ] Unificar estrutura de dados
- [ ] Separar configurações
- [ ] Adicionar testes básicos

### **Fase 4: Funcionalidades (variável)**
- [ ] Conectar perfil.js ao backend
- [ ] Implementar CRUD de agendamentos
- [ ] Painel administrativo funcional
- [ ] Recuperação de senha

---

## 📝 Notas Finais

### **Segurança da API Key**
⚠️ **CRÍTICO:** A chave do Supabase está exposta no código!

```javascript
// ❌ NUNCA fazer em produção:
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Soluções:**
1. Usar variáveis de ambiente (`.env`)
2. Usar apenas `anon key` (nunca `service_role`)
3. Configurar Row Level Security (RLS) no Supabase
4. Limitar domínios permitidos no painel do Supabase

### **Próximos Passos**
1. Revisar esta documentação com a equipe
2. Decidir arquitetura definitiva
3. Implementar plano de ação
4. Configurar ambiente de desenvolvimento
5. Realizar testes de integração

---

**Documentação criada em:** 31/01/2026  
**Versão:** 1.0  
**Autor:** Análise de Arquitetura do Projeto Focinho Gelado
