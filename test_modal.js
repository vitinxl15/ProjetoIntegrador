// Teste de integração completo
// Execute este código no console do navegador na página index.html

(async function testeCompleto() {
  console.log('=== TESTE DE INTEGRAÇÃO COMPLETO ===');
  
  // 1. Verificar se todas as dependências estão carregadas
  console.log('1. Verificando dependências...');
  
  if (typeof supabase === 'undefined') {
    console.error('❌ Supabase não carregado');
    return;
  }
  console.log('✅ Supabase carregado');
  
  if (typeof showPopup === 'undefined') {
    console.error('❌ showPopup não carregado');
    return;
  }
  console.log('✅ showPopup carregado');
  
  // 2. Verificar elementos do DOM
  console.log('2. Verificando elementos DOM...');
  
  const modal = document.getElementById("modalServico");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalDescricao = document.getElementById("modalDescricao");
  const modalPreco = document.getElementById("modalPreco");
  const modalDuracao = document.getElementById("modalDuracao");
  const btnAgendar = document.getElementById("btnAgendar");
  const closeModal = document.querySelector(".close");
  
  if (!modal || !modalTitulo || !modalDescricao || !modalPreco || !modalDuracao || !btnAgendar || !closeModal) {
    console.error('❌ Elementos do modal não encontrados');
    return;
  }
  console.log('✅ Todos os elementos do modal encontrados');
  
  // 3. Verificar cards de serviços
  const cards = document.querySelectorAll(".card[data-servico]");
  if (cards.length === 0) {
    console.error('❌ Cards de serviços não encontrados');
    return;
  }
  console.log(`✅ ${cards.length} cards de serviços encontrados`);
  
  // 4. Testar função listarServicos
  console.log('3. Testando listarServicos...');
  
  if (typeof listarServicos !== 'function') {
    console.error('❌ Função listarServicos não encontrada');
    return;
  }
  
  try {
    const servicos = await listarServicos();
    if (!servicos || servicos.length === 0) {
      console.warn('⚠️ Nenhum serviço encontrado no banco de dados');
      console.log('Execute o SQL em fix_servicos_completo.sql no Supabase');
      return;
    }
    console.log(`✅ ${servicos.length} serviços carregados:`, servicos.map(s => s.nome));
    
    // 5. Testar abertura do modal
    console.log('4. Testando modal...');
    
    // Simular dados de teste se não houver serviços
    const servicoTeste = servicos.length > 0 ? servicos[0] : {
      nome: 'Banho',
      descricao: 'Banho completo com shampoo e condicionador',
      preco: '50.00',
      duracao: 60
    };
    
    // Abrir modal programaticamente
    modalTitulo.textContent = servicoTeste.nome;
    modalDescricao.textContent = servicoTeste.descricao;
    modalPreco.textContent = `Preço: R$ ${parseFloat(servicoTeste.preco).toFixed(2)}`;
    modalDuracao.textContent = `Duração: ${servicoTeste.duracao} minutos`;
    modal.style.display = "block";
    
    console.log('✅ Modal aberto com sucesso');
    
    // Fechar modal após 2 segundos
    setTimeout(() => {
      modal.style.display = "none";
      console.log('✅ Modal fechado');
    }, 2000);
    
    console.log('=== TESTE CONCLUÍDO ===');
    console.log('Status: Modal funcional, aguardando dados do Supabase');
    
  } catch (error) {
    console.error('❌ Erro ao testar:', error);
  }
})();
