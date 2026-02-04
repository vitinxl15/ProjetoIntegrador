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
    if (typeof showPopup === 'function') await showPopup('Erro ao carregar seus dados. Tente novamente.', 'Erro')
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
    if (typeof showPopup === 'function') await showPopup('Erro ao carregar seus pets. Tente novamente.', 'Erro')
    return []
  }
  return data
}


// Listar todos os serviços disponiveis
async function listarServicos() {
  if (typeof supabaseClient === 'undefined') {
    console.error("Supabase não carregado!")
    if (typeof showPopup === 'function') await showPopup('Erro interno: serviço indisponível.', 'Erro')
    return []
  }
  const { data, error } = await supabaseClient
    .from("servico")
    .select("id, nome, descricao, preco, duracao")

  if (error) {
     console.error("Erro ao listar serviços:", error.message)
     if (typeof showPopup === 'function') await showPopup('Erro ao listar serviços. Tente novamente mais tarde.', 'Erro')
     return []
  }
  return data
}

window.listarServicos = listarServicos;

// Criar um novo agendamento
async function criarAgendamento(idCliente, dataHora, servicosSelecionados) {
  // Verificar conflitos globais antes de criar
  // calcular duração total em minutos dos serviços selecionados
  const duracaoTotalMin = servicosSelecionados.reduce((soma, s) => {
    return soma + (s.duracaoMinutos || 60)
  }, 0)
  const conflito = await verificarConflitoGlobal(dataHora, duracaoTotalMin)
  if (conflito) {
    if (typeof showPopup === 'function') await showPopup('Já existe um agendamento próximo a este horário. Escolha outro horário.', 'Atenção')
    return null
  }
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
    await showPopup("Erro ao criar agendamento.", "Erro")
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
    await showPopup("Erro ao adicionar serviços ao agendamento.", "Erro")
    return null
  }

  console.log("Agendamento criado com sucesso:", agendamento)
  return agendamento
}
// Converte formatos comuns de duração para minutos
function parseDurationToMinutes(d) {
  if (!d) return 60
  if (typeof d === 'number') return d
  if (typeof d === 'string') {
    const trimmed = d.trim()
    const hMatch = trimmed.match(/(\d+)\s*h/i)
    if (hMatch) return parseInt(hMatch[1], 10) * 60
    const parts = trimmed.split(':')
    if (parts.length === 3) {
      const hh = parseInt(parts[0], 10) || 0
      const mm = parseInt(parts[1], 10) || 0
      return hh * 60 + mm
    }
    if (parts.length === 2) {
      const hh = parseInt(parts[0], 10) || 0
      const mm = parseInt(parts[1], 10) || 0
      return hh * 60 + mm
    }
    const num = parseFloat(trimmed)
    if (!isNaN(num)) return Math.round(num)
  }
  return 60
}

// Verifica se existe algum agendamento (de qualquer cliente) que se sobreponha
// ao intervalo [dataHoraInput, dataHoraInput + duracaoMinutos]
async function verificarConflitoGlobal(dataHoraInput, duracaoMinutos = 60) {
  try {
    const inicioNovo = new Date(dataHoraInput)
    const fimNovo = new Date(inicioNovo.getTime() + duracaoMinutos * 60 * 1000)

    const { data, error } = await supabaseClient
      .from('agendamento')
      .select(`id, data_hora, agendamento_item ( servico:id_servico_fk ( duracao ) )`)

    if (error) {
      console.error('Erro ao verificar conflitos globais:', error.message)
      return false
    }

    if (!data || data.length === 0) return false

    for (let ag of data) {
      const inicioExistente = new Date(ag.data_hora)
      // somar durações dos serviços do agendamento existente
      let durExistMin = 0
      if (ag.agendamento_item && Array.isArray(ag.agendamento_item)) {
        for (let item of ag.agendamento_item) {
          const serv = item.servico
          if (serv) {
            durExistMin += parseDurationToMinutes(serv.duracao)
          } else {
            durExistMin += 60
          }
        }
      } else {
        durExistMin = 60
      }
      const fimExistente = new Date(inicioExistente.getTime() + durExistMin * 60 * 1000)

      // verificar sobreposição de intervalos
      if (inicioNovo < fimExistente && fimNovo > inicioExistente) {
        return true
      }
    }

    return false
  } catch (err) {
    console.error('Erro ao verificar conflito global:', err.message)
    return false
  }
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
    await showPopup("Erro ao cadastrar animal.", "Erro")
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
    await showPopup("Erro ao vincular animal ao cliente.", "Erro")
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
    await showPopup("Erro ao atualizar status do agendamento.", "Erro")
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
    await showPopup("Você precisa fazer login primeiro!", "Atenção")
    window.location.href = "login.html"
    return
  }

  const servicoParaAgendar = JSON.parse(localStorage.getItem("servicoParaAgendar"))
  const clienteParaAgendar = JSON.parse(localStorage.getItem("clienteParaAgendar"))

  if (!servicoParaAgendar || !clienteParaAgendar) {
    await showPopup("Selecione um serviço primeiro!", "Atenção")
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

      // duração do serviço em minutos (fallback 60)
      const duracaoMin = parseDurationToMinutos(servicoParaAgendar.duracao)

      const fimAgendamento = new Date(dataHora.getTime() + duracaoMin * 60 * 1000)
      const inicioDia = new Date(dataHora)
      inicioDia.setHours(8, 0, 0, 0)
      const fimDia = new Date(dataHora)
      fimDia.setHours(18, 0, 0, 0)

      if (dataHora < inicioDia || fimAgendamento > fimDia) {
        await showPopup("Agendamento deve começar e terminar entre 08:00 e 18:00.", "Atenção")
        return
      }

      // verificar conflito global (sobreposição com qualquer agendamento existente)
      const conflito = await verificarConflitoGlobal(dataHoraInput, duracaoMin)
      if (conflito) {
        await showPopup("Já existe um agendamento próximo a este horário. Escolha outro horário.", "Atenção")
        return
      }

      const servicosSelecionados = [{
        id: servicoParaAgendar.id,
        preco: servicoParaAgendar.preco,
        duracaoMinutos: duracaoMin
      }]

      const resultado = await criarAgendamento(
        clienteParaAgendar.id,
        dataHoraInput,
        servicosSelecionados
      )
      
      if (resultado) {
        localStorage.removeItem("servicoParaAgendar")
        localStorage.removeItem("clienteParaAgendar")
        await showPopup("Agendamento realizado com sucesso!", "Sucesso")
        window.location.href = "perfil.html"
      }
    })
  }
})
