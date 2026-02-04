let servicoSelecionado = null

// Implementação local de listarServicos como backup
async function listarServicosLocal() {
  console.log('🔧 Usando implementação local de listarServicos');
  
  // Garantir que supabaseClient existe
  if (typeof supabaseClient === 'undefined') {
    if (typeof supabase === 'undefined') {
      console.error('❌ Supabase library não carregada');
      return [];
    }
    
    console.log('⚙️ Criando supabaseClient local...');
    const supabaseUrl = "https://uhhagvmmxtcavngjdaik.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGFndm1teHRjYXZuZ2pkYWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzQ5MTQsImV4cCI6MjA3MzgxMDkxNH0.myBAOKrgVRKi82SeGC9r_P1N1-Z9tLtvN2cpk_MCYdQ";
    window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
  }
  
  try {
    console.log('📊 Executando consulta de serviços...');
    const cliente = window.supabaseClient || supabaseClient;
    const { data, error } = await cliente
      .from("servico")
      .select("id, nome, descricao, preco, duracao");
    
    if (error) {
      console.error("❌ Erro ao listar serviços:", error.message);
      return [];
    }
    
    console.log(`✅ Consulta retornou ${data ? data.length : 0} registros`);
    return data || [];
  } catch (err) {
    console.error("❌ Erro geral na consulta:", err);
    return [];
  }
}

async function inicializarServicos() {
  console.log('🚀 Iniciando inicializarServicos...');
  
  // Aguardar um pouco para garantir que tudo está carregado
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Verificar se listarServicos existe, se não usar implementação local
  let funcaoListar;
  if (typeof window.listarServicos === 'function') {
    console.log('✅ Usando window.listarServicos');
    funcaoListar = window.listarServicos;
  } else if (typeof listarServicos === 'function') {
    console.log('✅ Usando listarServicos global');
    funcaoListar = listarServicos;
  } else {
    console.log('⚠️ listarServicos não encontrado, usando implementação local');
    funcaoListar = listarServicosLocal;
  }
  
  const cards = document.querySelectorAll(".card[data-servico]")
  const modal = document.getElementById("modalServico")
  const closeModal = document.querySelector(".close")
  const btnAgendar = document.getElementById("btnAgendar")
  
  console.log(`📋 Encontrados ${cards.length} cards de serviço`);
  console.log('🎯 Modal element:', modal ? 'encontrado' : 'NÃO ENCONTRADO');
  console.log('❌ Close button:', closeModal ? 'encontrado' : 'NÃO ENCONTRADO');
  console.log('📅 Btn Agendar:', btnAgendar ? 'encontrado' : 'NÃO ENCONTRADO');

  if (!cards || cards.length === 0) {
    console.error('❌ Nenhum card encontrado! Tentando novamente em 1 segundo...');
    setTimeout(() => {
      const novoCards = document.querySelectorAll(".card[data-servico]");
      if (novoCards.length > 0) {
        console.log('✅ Cards encontrados na segunda tentativa:', novoCards.length);
        configurarModal(servicos, novoCards, modal, closeModal, btnAgendar);
      }
    }, 1000);
    return;
  }

  try {
    console.log('📞 Chamando função de listagem...');
    const servicos = await funcaoListar();
    
    console.log('📊 Resultado da listagem:', servicos);
    
    if (!servicos || servicos.length === 0) {
      console.error('❌ Nenhum serviço encontrado!');
      
      // Tentar inserir dados diretamente se estiver vazio
      console.log('🔧 Tentando inserir dados automaticamente...');
      if (typeof supabaseClient !== 'undefined' || window.supabaseClient) {
        const cliente = window.supabaseClient || supabaseClient;
        const servicosDefault = [
          { nome: 'Banho', descricao: 'Banho completo com shampoo', preco: 50.00, duracao: 60 },
          { nome: 'Tosa', descricao: 'Tosa higiênica completa', preco: 80.00, duracao: 60 },
          { nome: 'Hidratação', descricao: 'Hidratação profunda do pelo', preco: 60.00, duracao: 60 },
          { nome: 'Unhas', descricao: 'Corte e lixamento de unhas', preco: 30.00, duracao: 60 },
          { nome: 'Escovação', descricao: 'Escovação e desembaraço', preco: 40.00, duracao: 60 },
          { nome: 'Consulta', descricao: 'Consulta veterinária', preco: 120.00, duracao: 60 }
        ];
        
        const { data: inserted, error: insertError } = await cliente
          .from('servico')
          .insert(servicosDefault)
          .select();
        
        if (!insertError && inserted && inserted.length > 0) {
          console.log(`✅ ${inserted.length} serviços inseridos automaticamente`);
          // Tentar listar novamente
          const novosServicos = await funcaoListar();
          if (novosServicos && novosServicos.length > 0) {
            console.log('✅ Serviços encontrados após inserção');
            configurarModal(novosServicos, cards, modal, closeModal, btnAgendar);
            return;
          }
        }
      }
      
      if (typeof showPopup === 'function') {
        await showPopup('Nenhum serviço disponível no momento.', 'Aviso');
      }
      return;
    }
    
    console.log(`✅ ${servicos.length} serviços encontrados`);
    configurarModal(servicos, cards, modal, closeModal, btnAgendar);
    
  } catch (error) {
    console.error('❌ Erro em inicializarServicos:', error);
    if (typeof showPopup === 'function') {
      await showPopup('Erro ao carregar serviços.', 'Erro');
    }
  }
}

function configurarModal(servicos, cards, modal, closeModal, btnAgendar) {
  console.log('🎨 Configurando modal com', servicos.length, 'serviços');
  console.log('🎯 Elements disponíveis:', {
    cards: cards.length,
    modal: !!modal,
    closeModal: !!closeModal,
    btnAgendar: !!btnAgendar
  });
  
  cards.forEach((card, index) => {
    console.log(`📋 Configurando card ${index + 1}:`, card.dataset.servico);
    const btnSobre = card.querySelector(".btn-sobre")
    console.log(`🔘 Botão sobre encontrado:`, !!btnSobre);
    
    if (btnSobre) {
      btnSobre.addEventListener("click", async () => {
        console.log('👆 Botão clicado!');
        const nomeServico = card.dataset.servico
        console.log('🔍 Procurando serviço:', nomeServico);
        
        const servico = servicos.find(s => s.nome === nomeServico)
        if (servico) {
          console.log('✅ Serviço encontrado:', servico);
          servicoSelecionado = servico
          document.getElementById("modalTitulo").textContent = servico.nome
          document.getElementById("modalDescricao").textContent = servico.descricao
          document.getElementById("modalPreco").textContent = `Preço: R$ ${parseFloat(servico.preco).toFixed(2)}`
          document.getElementById("modalDuracao").textContent = `Duração: ${servico.duracao} minutos`
          console.log('🎯 Tentando mostrar modal...');
          modal.style.display = "block"
          console.log('✅ Modal exibido!');
        } else {
          console.error('❌ Serviço não encontrado:', nomeServico)
          console.log('Serviços disponíveis:', servicos.map(s => s.nome));
          if (typeof showPopup === 'function') await showPopup(`Serviço não encontrado: ${nomeServico}`, 'Erro')
        }
      })
    } else {
      console.error(`❌ Botão sobre não encontrado no card ${index + 1}`);
    }
  })
        } else {
          console.error('❌ Serviço não encontrado:', nomeServico)
          console.log('Serviços disponíveis:', servicos.map(s => s.nome));
          if (typeof showPopup === 'function') await showPopup(`Serviço não encontrado: ${nomeServico}`, 'Erro')
        }
      })
    }
  })

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none"
    })
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })

  if (btnAgendar) {
    btnAgendar.addEventListener("click", async () => {
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
      if (!usuarioLogado) {
        await showPopup("Você precisa fazer login primeiro!", "Atenção")
        window.location.href = "login.html"
        return
      }
      let cliente
      if (usuarioLogado.clienteId) {
        const clienteSupabase = window.supabaseClient || supabaseClient;
        const { data } = await clienteSupabase
          .from("cliente")
          .select("id, nome, cpf")
          .eq("id", usuarioLogado.clienteId)
          .single()
        cliente = data
      } else {
        cliente = await buscarCliente(usuarioLogado.id)
      }
      if (!cliente) {
        await showPopup("Erro ao carregar dados do cliente", "Erro")
        return
      }
      const animais = await buscarAnimaisCliente(cliente.id)
      if (animais.length === 0) {
        await showPopup("Você precisa cadastrar um pet primeiro!", "Atenção")
        localStorage.setItem("servicoParaAgendar", JSON.stringify(servicoSelecionado))
        window.location.href = "perfil.html"
        return
      }
      localStorage.setItem("servicoParaAgendar", JSON.stringify(servicoSelecionado))
      localStorage.setItem("clienteParaAgendar", JSON.stringify(cliente))
      window.location.href = "agendamento.html"
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log('📄 DOM carregado, aguardando dependências...');
  
  // Aguardar dependências com retry
  let tentativas = 0;
  const maxTentativas = 15; // Aumentar um pouco o tempo limite
  
  const aguardarDependencias = () => {
    tentativas++;
    console.log(`🔄 Tentativa ${tentativas}/${maxTentativas} de inicialização`);
    
    // Verificar se o básico está disponível
    const supabaseDisponivel = typeof supabase !== 'undefined';
    const showPopupDisponivel = typeof showPopup !== 'undefined';
    const listarServicosDisponivel = typeof window.listarServicos === 'function';
    
    console.log('- supabase:', supabaseDisponivel);
    console.log('- showPopup:', showPopupDisponivel);
    console.log('- listarServicos:', listarServicosDisponivel);
    
    if (supabaseDisponivel) {
      console.log('✅ Dependências básicas carregadas, iniciando...');
      // Aguardar mais um pouquinho para garantir que tudo está estável
      setTimeout(() => {
        inicializarServicos();
      }, 100);
    } else if (tentativas < maxTentativas) {
      console.log('⏳ Aguardando mais 300ms...');
      setTimeout(aguardarDependencias, 300);
    } else {
      console.error('❌ Timeout ao aguardar dependências');
      inicializarServicos(); // Tentar mesmo assim
    }
  };
  
  aguardarDependencias();
});

