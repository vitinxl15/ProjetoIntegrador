// perfil-integrado.js - Integração do perfil com banco de dados

// Form de cadastro de animal no perfil
const formCachorro = document.getElementById("formCachorro")
if (formCachorro) {
  formCachorro.addEventListener("submit", async (e) => {
    e.preventDefault()

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
    if (!usuarioLogado) {
      alert("Você precisa estar logado!")
      return
    }

    let cliente
    if (usuarioLogado.clienteId) {
      const { data } = await supabaseClient
        .from("cliente")
        .select("id, nome, cpf")
        .eq("id", usuarioLogado.clienteId)
        .single()
      cliente = data
    } else {
      cliente = await buscarCliente(usuarioLogado.id)
    }
    
    if (!cliente) {
      alert("Erro ao buscar dados do cliente")
      return
    }

    const nome = document.getElementById("nomeCachorro").value
    const especie = document.getElementById("especie").value
    const raca = document.getElementById("raca").value
    const idade = parseInt(document.getElementById("idade").value)
    const sexo = document.getElementById("sexo").value
    const temperamento = document.getElementById("temperamento").value

    const resultado = await cadastrarAnimal(
      nome,
      especie,
      raca,
      sexo,
      idade,
      temperamento,
      cliente.id
    )

    if (resultado) {
      alert("Animal cadastrado com sucesso!")
      formCachorro.reset()
      
      // Recarregar lista de animais
      const animais = await buscarAnimaisCliente(cliente.id)
      renderizarAnimais(animais)
    }
  })
}

// Função auxiliar para renderizar lista de animais
function renderizarAnimais(animais) {
  const listaAnimais = document.getElementById("listaAnimais")
  if (!listaAnimais) return

  if (animais.length === 0) {
    listaAnimais.innerHTML = "<p>Você ainda não tem pets cadastrados.</p>"
  } else {
    listaAnimais.innerHTML = ""
    animais.forEach(item => {
      const animal = item.animal
      const div = document.createElement("div")
      div.className = "animal-item"
      div.style.border = "1px solid #ccc"
      div.style.padding = "10px"
      div.style.margin = "5px 0"
      div.style.borderRadius = "5px"
      div.innerHTML = `
        <p><strong>${animal.nome}</strong></p>
        <p>${animal.especie} - ${animal.raca}</p>
        <p>Sexo: ${animal.sexo} | Idade: ${animal.idade} anos</p>
        <p>Temperamento: ${animal.temperamento}</p>
      `
      listaAnimais.appendChild(div)
    })
  }
}

// Função auxiliar para renderizar agendamentos
function renderizarAgendamentos(agendamentos) {
  const listaAgendamentos = document.getElementById("listaAgendamentos")
  if (!listaAgendamentos) return

  if (agendamentos.length === 0) {
    listaAgendamentos.innerHTML = "<p>Você ainda não tem agendamentos.</p>"
  } else {
    listaAgendamentos.innerHTML = ""
    agendamentos.forEach(ag => {
      const div = document.createElement("div")
      div.className = "agendamento-item"
      div.style.border = "1px solid #ccc"
      div.style.padding = "10px"
      div.style.margin = "5px 0"
      div.style.borderRadius = "5px"
      
      const data = new Date(ag.data_hora)
      const dataFormatada = data.toLocaleString("pt-BR")
      
      const servicos = ag.agendamento_item.map(item => item.servico.nome).join(", ")
      
      div.innerHTML = `
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Status:</strong> ${ag.status}</p>
        <p><strong>Serviços:</strong> ${servicos}</p>
        <p><strong>Total:</strong> R$ ${parseFloat(ag.total).toFixed(2)}</p>
      `
      listaAgendamentos.appendChild(div)
    })
  }
}

// Carregar dados ao abrir perfil
document.addEventListener("DOMContentLoaded", async () => {
  const paginaAtual = window.location.href
  const estaEmPerfil = paginaAtual.includes("perfil.html")
  
  if (!estaEmPerfil) {
    return
  }

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
  
  if (usuarioLogado) {
    let cliente
    if (usuarioLogado.clienteId) {
      const { data } = await supabaseClient
        .from("cliente")
        .select("id, nome, cpf")
        .eq("id", usuarioLogado.clienteId)
        .single()
      cliente = data
    } else {
      cliente = await buscarCliente(usuarioLogado.id)
    }
    if (cliente) {
      // Carregar animais
      const animais = await buscarAnimaisCliente(cliente.id)
      renderizarAnimais(animais)
      
      // Carregar agendamentos
      const agendamentos = await buscarAgendamentos(cliente.id)
      renderizarAgendamentos(agendamentos)
    }
  }
})
