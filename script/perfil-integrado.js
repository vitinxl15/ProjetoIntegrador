// perfil-integrado.js - Integração do perfil com banco de dados

// Form de cadastro de animal no perfil
const formCachorro = document.getElementById("formCachorro")
if (formCachorro) {
  formCachorro.addEventListener("submit", async (e) => {
    e.preventDefault()

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
    if (!usuarioLogado) {
      await showPopup("Você precisa estar logado!", "Atenção")
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
      await showPopup("Erro ao buscar dados do cliente", "Erro")
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
      await showPopup("Animal cadastrado com sucesso!", "Sucesso")
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
    listaAgendamentos.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <h5>Você ainda não tem agendamentos</h5>
          <p>Faça seu primeiro agendamento na página inicial!</p>
          <a href="index.html" class="btn btn-primary">Agendar Serviço</a>
        </div>
      </div>
    `
  } else {
    listaAgendamentos.innerHTML = ""
    agendamentos.forEach(ag => {
      const data = new Date(ag.data_hora)
      const dataFormatada = data.toLocaleString("pt-BR")
      
      // Badge de status com cores
      let statusClass = 'secondary'
      if (ag.status === 'Confirmado') statusClass = 'success'
      else if (ag.status === 'Pendente') statusClass = 'warning'
      else if (ag.status === 'Concluído') statusClass = 'info'
      else if (ag.status === 'Cancelado') statusClass = 'danger'
      
      const cardHtml = `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">Agendamento #${ag.id}</h5>
            </div>
            <div class="card-body">
              <p class="card-text">
                <strong>📅 Data/Hora:</strong><br>${dataFormatada}<br><br>
                <strong>💰 Total:</strong> R$ ${parseFloat(ag.total || 0).toFixed(2)}
              </p>
              <span class="badge bg-${statusClass} w-100 fs-6">${ag.status}</span>
            </div>
          </div>
        </div>
      `
      listaAgendamentos.innerHTML += cardHtml
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
  
  if (!usuarioLogado) {
    console.warn('⚠️ Usuário não está logado');
    window.location.href = 'login.html';
    return;
  }
  
  console.log('👤 Usuário logado:', usuarioLogado);
  
  // Buscar cliente - priorizar cliente no localStorage
  let cliente = usuarioLogado.cliente;
  
  if (!cliente || !cliente.id) {
    console.log('🔍 Cliente não encontrado no localStorage, buscando no banco...');
    cliente = await buscarCliente(usuarioLogado.id);
  }
  
  if (!cliente) {
    console.error('❌ Não foi possível carregar dados do cliente');
    await showPopup('Erro ao carregar seus dados. Faça login novamente.', 'Erro');
    return;
  }
  
  console.log('✅ Cliente carregado:', cliente);
  
  // Carregar animais do cliente
  console.log('🐕 Carregando animais...');
  const animais = await buscarAnimaisCliente(cliente.id);
  console.log(`✅ ${animais.length} animais encontrados`);
  renderizarAnimais(animais);
  
  // Carregar APENAS agendamentos deste cliente
  console.log('📅 Carregando agendamentos do cliente ID:', cliente.id);
  const agendamentos = await buscarAgendamentos(cliente.id);
  console.log(`✅ ${agendamentos.length} agendamentos encontrados`);
  renderizarAgendamentos(agendamentos);
})
