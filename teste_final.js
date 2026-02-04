// TESTE FINAL - Execute no console do navegador em index.html
// Este script força a inserção e testa tudo

(async function testeDefinitivo() {
  console.log('=== TESTE DEFINITIVO ===');
  
  // 1. Garantir que supabaseClient existe
  if (typeof supabaseClient === 'undefined') {
    if (typeof supabase === 'undefined') {
      console.error('❌ Supabase library não carregada');
      return;
    }
    console.log('Criando supabaseClient...');
    const supabaseUrl = "https://uhhagvmmxtcavngjdaik.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGFndm1teHRjYXZuZ2pkYWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzQ5MTQsImV4cCI6MjA3MzgxMDkxNH0.myBAOKrgVRKi82SeGC9r_P1N1-Z9tLtvN2cpk_MCYdQ";
    window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
  }
  
  try {
    // 2. Limpar tabela e inserir dados limpos
    console.log('1. Limpando dados antigos...');
    await supabaseClient.from('servico').delete().neq('id', 0); // delete all
    
    console.log('2. Inserindo dados frescos...');
    const servicosLimpos = [
      { nome: 'Banho', descricao: 'Banho completo com shampoo e condicionador', preco: 50.00, duracao: 60 },
      { nome: 'Tosa', descricao: 'Tosa higiênica ou completa', preco: 80.00, duracao: 60 },
      { nome: 'Hidratação', descricao: 'Hidratação profunda do pelo', preco: 60.00, duracao: 60 },
      { nome: 'Unhas', descricao: 'Corte e lixamento de unhas', preco: 30.00, duracao: 60 },
      { nome: 'Escovação', descricao: 'Escovação e desembaraço', preco: 40.00, duracao: 60 },
      { nome: 'Consulta', descricao: 'Consulta veterinária', preco: 120.00, duracao: 60 }
    ];
    
    const { data: inserted, error: insertError } = await supabaseClient
      .from('servico')
      .insert(servicosLimpos)
      .select();
    
    if (insertError) {
      console.error('❌ Erro na inserção:', insertError);
      return;
    }
    
    console.log(`✅ ${inserted.length} serviços inseridos`);
    
    // 3. Testar listarServicos()
    console.log('3. Testando listarServicos()...');
    if (typeof listarServicos !== 'function') {
      console.error('❌ listarServicos não encontrado');
      return;
    }
    
    const servicos = await listarServicos();
    console.log(`✅ listarServicos retornou ${servicos ? servicos.length : 0} registros`);
    
    if (servicos && servicos.length > 0) {
      console.log('Serviços encontrados:');
      servicos.forEach((s, i) => console.log(`  ${i+1}. ${s.nome} - R$ ${s.preco}`));
      
      // 4. Testar modal (simular clique no primeiro serviço)
      console.log('4. Testando modal...');
      const modal = document.getElementById("modalServico");
      if (modal) {
        const servico = servicos[0];
        document.getElementById("modalTitulo").textContent = servico.nome;
        document.getElementById("modalDescricao").textContent = servico.descricao;
        document.getElementById("modalPreco").textContent = `Preço: R$ ${parseFloat(servico.preco).toFixed(2)}`;
        document.getElementById("modalDuracao").textContent = `Duração: ${servico.duracao} minutos`;
        modal.style.display = "block";
        
        console.log('✅ Modal aberto com sucesso!');
        console.log('Fechando em 3 segundos...');
        
        setTimeout(() => {
          modal.style.display = "none";
          console.log('✅ Modal fechado');
          console.log('=== TESTE CONCLUÍDO COM SUCESSO ===');
          console.log('Agora teste clicando nos botões "Sobre" dos cards!');
        }, 3000);
        
      } else {
        console.error('❌ Modal não encontrado');
      }
    } else {
      console.error('❌ listarServicos ainda retornou vazio');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
})();