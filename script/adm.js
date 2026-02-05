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
    console.log('Carregando todos os agendamentos...');
    
    const { data, error } = await supabase
      .from('agendamento')
      .select(`
        *,
        cliente:cliente_id (
          nome,
          sobrenome,
          telefone,
          email
        ),
        agendamento_item (
          servico_id,
          servico:servico_id (
            nome,
            descricao,
            preco_base
          )
        )
      `)
      .order('data_hora', { ascending: false });

    if (error) {
      console.error('Erro ao carregar agendamentos:', error);
      mostrarPopup('Erro ao carregar agendamentos: ' + error.message, 'error');
      return;
    }

    todosAgendamentos = data || [];
    agendamentosFiltrados = [...todosAgendamentos];
    
    console.log('Agendamentos carregados:', todosAgendamentos);
    renderizarAgendamentos(agendamentosFiltrados);
    
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error);
    mostrarPopup('Erro ao carregar agendamentos', 'error');
  }
}

// Função para renderizar os agendamentos na tela
function renderizarAgendamentos(agendamentos) {
  const listaDiv = document.getElementById('listaAgendamentos');
  
  if (!agendamentos || agendamentos.length === 0) {
    listaDiv.innerHTML = `
      <div class="col-12 text-center p-5">
        <p class="text-muted">Nenhum agendamento encontrado.</p>
      </div>
    `;
    return;
  }

  let html = '';
  
  agendamentos.forEach(agendamento => {
    const cliente = agendamento.cliente || {};
    const nomeCliente = `${cliente.nome || 'N/A'} ${cliente.sobrenome || ''}`.trim();
    const telefoneCliente = cliente.telefone || 'N/A';
    const emailCliente = cliente.email || 'N/A';
    
    const dataHora = new Date(agendamento.data_hora);
    const dataFormatada = dataHora.toLocaleDateString('pt-BR');
    const horaFormatada = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const servicos = agendamento.agendamento_item || [];
    const servicosNomes = servicos.map(item => item.servico?.nome || 'Serviço desconhecido').join(', ');
    
    const statusClass = getStatusClass(agendamento.status);
    
    html += `
      <div class="col-md-6 col-lg-4 mb-3">
        <div class="card h-100">
          <div class="card-header ${statusClass}">
            <strong>Agendamento #${agendamento.id}</strong>
            <span class="badge bg-light text-dark float-end">${agendamento.status}</span>
          </div>
          <div class="card-body">
            <h6 class="card-title"><strong>Cliente:</strong> ${nomeCliente}</h6>
            <p class="card-text mb-1"><strong>Telefone:</strong> ${telefoneCliente}</p>
            <p class="card-text mb-1"><strong>Email:</strong> ${emailCliente}</p>
            <hr>
            <p class="card-text mb-1"><strong>Data:</strong> ${dataFormatada}</p>
            <p class="card-text mb-1"><strong>Hora:</strong> ${horaFormatada}</p>
            <p class="card-text mb-1"><strong>Porte:</strong> ${agendamento.porte || 'N/A'}</p>
            <p class="card-text mb-1"><strong>Serviços:</strong> ${servicosNomes || 'N/A'}</p>
            <p class="card-text mb-1"><strong>Valor:</strong> R$ ${parseFloat(agendamento.valor_total || 0).toFixed(2)}</p>
            ${agendamento.observacoes ? `<p class="card-text mb-1"><small><strong>Obs:</strong> ${agendamento.observacoes}</small></p>` : ''}
          </div>
          <div class="card-footer">
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
      <button class="btn btn-sm btn-success me-2" onclick="alterarStatus(${agendamento.id}, 'Confirmado')">
        Confirmar
      </button>
      <button class="btn btn-sm btn-danger" onclick="alterarStatus(${agendamento.id}, 'Cancelado')">
        Cancelar
      </button>
    `;
  } else if (agendamento.status === 'Confirmado') {
    html += `
      <button class="btn btn-sm btn-success me-2" onclick="alterarStatus(${agendamento.id}, 'Concluído')">
        Marcar como Concluído
      </button>
      <button class="btn btn-sm btn-danger" onclick="alterarStatus(${agendamento.id}, 'Cancelado')">
        Cancelar
      </button>
    `;
  } else {
    html += `<small class="text-muted">Agendamento ${agendamento.status.toLowerCase()}</small>`;
  }
  
  return html;
}

// Função para alterar o status de um agendamento
async function alterarStatus(agendamentoId, novoStatus) {
  try {
    console.log(`Alterando status do agendamento ${agendamentoId} para ${novoStatus}`);
    
    const { data, error } = await supabase
      .from('agendamento')
      .update({ status: novoStatus })
      .eq('id', agendamentoId);

    if (error) {
      console.error('Erro ao alterar status:', error);
      mostrarPopup('Erro ao alterar status: ' + error.message, 'error');
      return;
    }

    mostrarPopup(`Status alterado para ${novoStatus} com sucesso!`, 'success');
    await carregarTodosAgendamentos();
    
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    mostrarPopup('Erro ao alterar status', 'error');
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