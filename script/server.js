// server.js

const supabaseUrl = "https://uhhagvmmxtcavngjdaik.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGFndm1teHRjYXZuZ2pkYWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzQ5MTQsImV4cCI6MjA3MzgxMDkxNH0.myBAOKrgVRKi82SeGC9r_P1N1-Z9tLtvN2cpk_MCYdQ"  // ⚠️ substitua pela sua anon key
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

// intercepta o form de cadastro
const formCadastro = document.querySelector("#formCadastro")
if (formCadastro) {
  formCadastro.addEventListener("submit", async (e) => {
  e.preventDefault()

  const nome = document.getElementById("inputName").value
  const email = document.getElementById("inputEmail").value
  const senha = document.getElementById("inputSenha").value
  const csenha = document.getElementById("inputCSenha").value
  const cpf = document.getElementById("inputCpf").value
  const idPrivilegio = 1 

  if (senha !== csenha) {
    alert("As senhas devem ser iguais.")
    return
  }

    const result = await cadastrarUsuario(nome, cpf, email, senha, idPrivilegio)
    if (result) {
      alert("Cadastro realizado com sucesso!")
      window.location.href = "login.html"
    }
  })
}

// Função de cadastro
async function cadastrarUsuario(nome, cpf, email, senha, idPrivilegio) {
  // 1. Cadastrar usuario
  const { data: usuario, error: erroUsuario } = await supabaseClient
    .from("usuario")
    .insert([{ email, senha, id_privilegio_fk: idPrivilegio }])
    .select("id")
    .single()

  if (erroUsuario) {
    console.error("Erro ao cadastrar usuário:", erroUsuario.message)
    alert("Erro ao cadastrar usuário.")
    return null
  }

  // 2. Cadastrar cliente vinculado ao usuário
  const { data: cliente, error: erroCliente } = await supabaseClient
    .from("cliente")
    .insert([{ nome, cpf, id_usuario_fk: usuario.id }])
    .select()
    .single()

  if (erroCliente) {
    console.error("Erro ao cadastrar cliente:", erroCliente.message)
    alert("Erro ao cadastrar cliente.")
    return null
  }

  console.log("Cadastro concluído:", { usuario, cliente })
  return { usuario, cliente }
}
/*-----------------------------------------------------------------------------  
----------------------------------------------------------------------------- 
----------------------------------------------------------------------------- 
----------------------------------------------------------------------------- 
----------------------------------------------------------------------------- */
// Fazer login
async function loginUsuario(email, senha) {
  const { data, error } = await supabaseClient
    .from("usuario")
    .select(`
      id,
      email,
      id_privilegio_fk,
      cliente:cliente(id, nome, cpf)
    `)
    .eq("email", email)
    .eq("senha", senha)
    .single()

  if (error) {
    console.error("Erro no login:", error.message)
    return null
  }

  if (!data) {
    console.log("Usuário não encontrado ou senha inválida")
    return null
  }

  console.log("Login realizado:", data)
  return data
}

// intercepta o form de login
const formLogin = document.querySelector("#formLogin")
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("loginEmail").value
    const senha = document.getElementById("loginSenha").value

    const result = await loginUsuario(email, senha)
    if (result) {
      const dadosUsuario = {
        id: result.id,
        email: result.email,
        id_privilegio_fk: result.id_privilegio_fk
      }
      
      if (result.cliente && result.cliente.length > 0) {
        dadosUsuario.clienteId = result.cliente[0].id
        dadosUsuario.nome = result.cliente[0].nome
        dadosUsuario.cpf = result.cliente[0].cpf
      }
      
      localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario))
      alert("Login realizado com sucesso!")
      window.location.href = "index.html"
    } else {
      alert("Email ou senha inválidos!")
    }
  })
}
