// Variáveis globais
let todosAgendamentos = [];
let agendamentosFiltrados = [];

document.addEventListener('DOMContentLoaded', async function() {
  // Verificar se o usuário está logado
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  
  if (!usuarioLogado) {
    window.location.href = 'login.html';
    return;
  }

  // Verificar se o usuário é admin
  if (usuarioLogado.id_privilegio_fk !== 1) {
    mostrarPopup('Acesso negado! Apenas administradores podem acessar esta página.', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }

  // Exibir saudação ao usuário
  const saudacaoDiv = document.getElementById('saudacaoUsuario');
  if (saudacaoDiv) {
    const nomeUsuario = usuarioLogado.cliente?.nome || usuarioLogado.email;
    saudacaoDiv.innerHTML = `
      <p>Bem-vindo, ${nomeUsuario}!</p>
      <p>Perfil: Administrador</p>
    `;
  }

  console.log('Usuário admin logado:', usuarioLogado);
  
  // Carregar todos os agendamentos
  await carregarTodosAgendamentos();
});

// Função para carregar todos os agendamentos
async function carregarTodosAgendamentos() {
  try {
    console.log('🔍 Carregando todos os agendamentos...');
    
    const { data, error } = await supabase
      .from('agendamento')
      .select(`
        *,
        cliente:id_cliente_fk (
          id,
          nome,
          cpf
        ),
        agendamento_item (
          id,
          id_servico_fk,
          servico:id_servico_fk (
            id,
            nome,
            preco
          )
        )
      `)
      .order('data_hora', { ascending: false });

    if (error) {
      console.error('❌ Erro ao carregar agendamentos:', error);
      mostrarPopup('Erro ao carregar agendamentos: ' + error.message, 'error');
      return;
    }

    todosAgendamentos = data || [];
    agendamentosFiltrados = [...todosAgendamentos];
    
    console.log(`✅ ${todosAgendamentos.length} agendamentos carregados`);
    console.log('📊 Dados:', todosAgendamentos);
    renderizarAgendamentos(agendamentosFiltrados);
    
  } catch (error) {
    console.error('❌ Erro ao carregar agendamentos:', error);
    mostrarPopup('Erro ao carregar agendamentos', 'error');
  }
}

// Função para renderizar os agendamentos na tela
function renderizarAgendamentos(agendamentos) {
  const listaDiv = document.getElementById('listaAgendamentos');
  
  if (!agendamentos || agendamentos.length === 0) {
    listaDiv.innerHTML = `
      <div class="col-12 text-center p-5">
        <div class="alert alert-info">
          <h5>Nenhum agendamento encontrado</h5>
          <p>Não há agendamentos cadastrados no sistema.</p>
        </div>
      </div>
    `;
    return;
  }

  let html = '';
  
  agendamentos.forEach(agendamento => {
    const cliente = agendamento.cliente || {};
    const nomeCliente = cliente.nome || 'Cliente não identificado';
    const cpfCliente = cliente.cpf || 'N/A';
    
    const dataHora = new Date(agendamento.data_hora);
    const dataFormatada = dataHora.toLocaleDateString('pt-BR');
    const horaFormatada = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const statusClass = getStatusClass(agendamento.status);
    
    html += `
      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="card h-100 shadow-sm">
          <div class="card-header ${statusClass}">
            <strong>#${agendamento.id}</strong>
            <span class="badge bg-light text-dark float-end">${agendamento.status}</span>
          </div>
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-person-fill"></i> ${nomeCliente}
            </h6>
            <p class="card-text mb-1"><strong>📋 CPF:</strong> ${cpfCliente}</p>
            <hr>
            <p class="card-text mb-1"><strong>📅 Data:</strong> ${dataFormatada}</p>
            <p class="card-text mb-1"><strong>🕐 Hora:</strong> ${horaFormatada}</p>
            <p class="card-text mb-1"><strong>💰 Total:</strong> <span class="text-success fw-bold">R$ ${parseFloat(agendamento.total || 0).toFixed(2)}</span></p>
            ${agendamento.observacoes ? `<p class="card-text mb-1"><small class="text-muted"><strong>💬 Obs:</strong> ${agendamento.observacoes}</small></p>` : ''}
          </div>
          <div class="card-footer bg-white">
            ${renderizarBotoesAcao(agendamento)}
          </div>
        </div>
      </div>
    `;
  });
  
  listaDiv.innerHTML = html;
}

// Função para retornar a classe CSS do status
function getStatusClass(status) {
  switch(status) {
    case 'Pendente':
      return 'bg-warning text-dark';
    case 'Confirmado':
      return 'bg-info text-white';
    case 'Concluído':
      return 'bg-success text-white';
    case 'Cancelado':
      return 'bg-danger text-white';
    default:
      return 'bg-secondary text-white';
  }
}

// Função para renderizar botões de ação conforme o status
function renderizarBotoesAcao(agendamento) {
  let html = '';
  
  if (agendamento.status === 'Pendente') {
    html += `
      <div class="d-grid gap-2">
        <button class="btn btn-success btn-sm" onclick="alterarStatus(${agendamento.id}, 'Confirmado')">
          ✅ Confirmar
        </button>
        <button class="btn btn-danger btn-sm" onclick="alterarStatus(${agendamento.id}, 'Cancelado')">
          ❌ Cancelar
        </button>
      </div>
    `;
  } else if (agendamento.status === 'Confirmado') {
    html += `
      <div class="d-grid gap-2">
        <button class="btn btn-primary btn-sm" onclick="alterarStatus(${agendamento.id}, 'Concluído')">
          ✔️ Finalizar
        </button>
        <button class="btn btn-danger btn-sm" onclick="alterarStatus(${agendamento.id}, 'Cancelado')">
          ❌ Cancelar
        </button>
      </div>
    `;
  } else if (agendamento.status === 'Concluído') {
    html += `<div class="text-center"><small class="text-success fw-bold">✅ Concluído</small></div>`;
  } else if (agendamento.status === 'Cancelado') {
    html += `<div class="text-center"><small class="text-danger fw-bold">❌ Cancelado</small></div>`;
  }
  
  return html;
}

// Função para alterar o status de um agendamento
async function alterarStatus(agendamentoId, novoStatus) {
  try {
    // Confirmação do usuário
    const confirmar = confirm(`Tem certeza que deseja alterar o status para "${novoStatus}"?`);
    if (!confirmar) return;
    
    console.log(`🔄 Alterando status do agendamento #${agendamentoId} para ${novoStatus}...`);
    
    const { error } = await supabase
      .from('agendamento')
      .update({ status: novoStatus })
      .eq('id', agendamentoId);

    if (error) {
      console.error('❌ Erro ao alterar status:', error);
      mostrarPopup('Erro ao alterar status: ' + error.message, 'error');
      return;
    }

    console.log(`✅ Status alterado com sucesso!`);
    mostrarPopup(`✅ Agendamento #${agendamentoId} → ${novoStatus}`, 'success');
    await carregarTodosAgendamentos();
    
  } catch (error) {
    console.error('❌ Erro ao alterar status:', error);
    mostrarPopup('Erro ao alterar status: ' + error.message, 'error');
  }
}

// Função para aplicar filtros
function aplicarFiltros() {
  const filtroStatus = document.getElementById('filtroStatus').value;
  const filtroData = document.getElementById('filtroData').value;
  const filtroCliente = document.getElementById('filtroCliente').value.toLowerCase();
  
  agendamentosFiltrados = todosAgendamentos.filter(agendamento => {
    let passa = true;
    
    // Filtro de status
    if (filtroStatus && agendamento.status !== filtroStatus) {
      passa = false;
    }
    
    // Filtro de data
    if (filtroData) {
      const dataAgendamento = new Date(agendamento.data_hora).toISOString().split('T')[0];
      if (dataAgendamento !== filtroData) {
        passa = false;
      }
    }
    
    // Filtro de cliente
    if (filtroCliente) {
      const nomeCompleto = `${agendamento.cliente?.nome || ''} ${agendamento.cliente?.sobrenome || ''}`.toLowerCase();
      if (!nomeCompleto.includes(filtroCliente)) {
        passa = false;
      }
    }
    
    return passa;
  });
  
  renderizarAgendamentos(agendamentosFiltrados);
  mostrarPopup(`${agendamentosFiltrados.length} agendamento(s) encontrado(s)`, 'success');
}

// Função para logout
function fazerLogout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'login.html';
}