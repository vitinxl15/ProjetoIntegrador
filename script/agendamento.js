// agendamento.js

const supabaseUrl = "https://uhhagvmmxtcavngjdaik.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGFndm1teHRjYXZuZ2pkYWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzQ5MTQsImV4cCI6MjA3MzgxMDkxNH0.myBAOKrgVRKi82SeGC9r_P1N1-Z9tLtvN2cpk_MCYdQ"
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

// Buscar cliente logado pelo ID do usuario
async function buscarCliente(idUsuario) {
  const { data, error } = await supabaseClient
    .from("cliente")
    .select("id, nome, cpf")
    .eq("id_usuario_fk", idUsuario)
    .single()

  if (error) {
    console.error("Erro ao buscar cliente:", error.message)
    return null
  }
  return data
}

// Buscar animais do cliente
async function buscarAnimaisCliente(idCliente) {
  const { data, error } = await supabaseClient
    .from("bando")
    .select(`
      id,
      animal:id_animal_fk (
        id,
        nome,
        especie,
        raca,
        sexo,
        idade
      )
    `)
    .eq("id_cliente_fk", idCliente)

  if (error) {
    console.error("Erro ao buscar animais:", error.message)
    return []
  }
  return data
}


// Listar todos os serviços disponiveis
async function listarServicos() {
  if (typeof supabaseClient === 'undefined') {
    console.error("Supabase não carregado!")
    return []
  }
  const { data, error } = await supabaseClient
    .from("servico")
    .select("id, nome, descricao, preco, duracao")

  if (error) {
    console.error("Erro ao listar serviços:", error.message)
    return []
  }
  return data
}

window.listarServicos = listarServicos;

// Criar um novo agendamento
async function criarAgendamento(idCliente, dataHora, servicosSelecionados) {
  // Calcular total
  const total = servicosSelecionados.reduce((soma, servico) => {
    return soma + parseFloat(servico.preco)
  }, 0)

  // Inserir agendamento
  const { data: agendamento, error: erroAgendamento } = await supabaseClient
    .from("agendamento")
    .insert([{
      id_cliente_fk: idCliente,
      data_hora: dataHora,
      status: "Pendente",
      total: total.toFixed(2)
    }])
    .select()
    .single()

  if (erroAgendamento) {
    console.error("Erro ao criar agendamento:", erroAgendamento.message)
    alert("Erro ao criar agendamento.")
    return null
  }

  // Inserir itens do agendamento
  const itens = servicosSelecionados.map(servico => ({
    id_agendamento_fk: agendamento.id,
    id_servico_fk: servico.id
  }))

  const { error: erroItens } = await supabaseClient
    .from("agendamento_item")
    .insert(itens)

  if (erroItens) {
    console.error("Erro ao adicionar itens:", erroItens.message)
    alert("Erro ao adicionar serviços ao agendamento.")
    return null
  }

  console.log("Agendamento criado com sucesso:", agendamento)
  return agendamento
}

// Buscar agendamentos do cliente
async function buscarAgendamentos(idCliente) {
  const { data, error } = await supabaseClient
    .from("agendamento")
    .select(`
      id,
      data_hora,
      status,
      total,
      agendamento_item (
        servico:id_servico_fk (
          nome,
          preco
        )
      )
    `)
    .eq("id_cliente_fk", idCliente)
    .order("data_hora", { ascending: false })

  if (error) {
    console.error("Erro ao buscar agendamentos:", error.message)
    return []
  }
  return data
}

// Cadastrar novo animal
async function cadastrarAnimal(nome, especie, raca, sexo, idade, temperamento, idCliente) {
  // Inserir animal
  const { data: animal, error: erroAnimal } = await supabaseClient
    .from("animal")
    .insert([{
      nome: nome,
      especie: especie,
      raca: raca,
      sexo: sexo,
      idade: idade,
      temperamento: temperamento
    }])
    .select()
    .single()

  if (erroAnimal) {
    console.error("Erro ao cadastrar animal:", erroAnimal.message)
    alert("Erro ao cadastrar animal.")
    return null
  }

  // Vincular animal ao cliente na tabela bando
  const { data: bando, error: erroBando } = await supabaseClient
    .from("bando")
    .insert([{
      id_cliente_fk: idCliente,
      id_animal_fk: animal.id
    }])
    .select()
    .single()

  if (erroBando) {
    console.error("Erro ao vincular animal:", erroBando.message)
    alert("Erro ao vincular animal ao cliente.")
    return null
  }

  console.log("Animal cadastrado com sucesso:", animal)
  return animal
}

// Atualizar status do agendamento
async function atualizarStatusAgendamento(idAgendamento, novoStatus) {
  const { data, error } = await supabaseClient
    .from("agendamento")
    .update({ status: novoStatus })
    .eq("id", idAgendamento)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar status:", error.message)
    alert("Erro ao atualizar status do agendamento.")
    return null
  }

  console.log("Status atualizado:", data)
  return data
}

document.addEventListener("DOMContentLoaded", async () => {
  const paginaAtual = window.location.pathname
  const estaEmAgendamento = paginaAtual.includes("agendamento.html")
  
  if (!estaEmAgendamento) {
    return
  }

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
  
  if (!usuarioLogado) {
    alert("Você precisa fazer login primeiro!")
    window.location.href = "login.html"
    return
  }

  const servicoParaAgendar = JSON.parse(localStorage.getItem("servicoParaAgendar"))
  const clienteParaAgendar = JSON.parse(localStorage.getItem("clienteParaAgendar"))

  if (!servicoParaAgendar || !clienteParaAgendar) {
    alert("Selecione um serviço primeiro!")
    window.location.href = "index.html"
    return
  }

  document.getElementById("nomeServico").textContent = servicoParaAgendar.nome
  document.getElementById("precoServico").textContent = `Valor: R$ ${parseFloat(servicoParaAgendar.preco).toFixed(2)}`

  const formAgendamento = document.getElementById("formAgendamento")
  if (formAgendamento) {
    formAgendamento.addEventListener("submit", async (e) => {
      e.preventDefault()

      const dataHoraInput = document.getElementById("dataHora").value
      const dataHora = new Date(dataHoraInput)
      
      const hora = dataHora.getHours()
      if (hora < 8 || hora >= 18) {
        alert("Horário deve estar entre 8h e 18h!")
        return
      }

      const agendamentosExistentes = await supabaseClient
        .from("agendamento")
        .select("data_hora")
        .eq("id_cliente_fk", clienteParaAgendar.id)

      if (agendamentosExistentes.data) {
        for (let ag of agendamentosExistentes.data) {
          const dataExistente = new Date(ag.data_hora)
          const diferencaHoras = Math.abs(dataHora - dataExistente) / 36e5
          
          if (diferencaHoras < 1) {
            alert("Já existe um agendamento próximo a este horário. Escolha um horário com pelo menos 1 hora de diferença.")
            return
          }
        }
      }

      const servicosSelecionados = [{
        id: servicoParaAgendar.id,
        preco: servicoParaAgendar.preco
      }]

      const resultado = await criarAgendamento(
        clienteParaAgendar.id,
        dataHoraInput,
        servicosSelecionados
      )
      
      if (resultado) {
        localStorage.removeItem("servicoParaAgendar")
        localStorage.removeItem("clienteParaAgendar")
        alert("Agendamento realizado com sucesso!")
        window.location.href = "perfil.html"
      }
    })
  }
})
