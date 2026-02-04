// Script para inserir serviços diretamente via JavaScript
// Execute este código no console do navegador na página index.html ou agendamento.html

(async function inserirServicos() {
  console.log('=== INSERINDO SERVIÇOS NO SUPABASE ===');
  
  // Verificar se supabaseClient está disponível
  if (typeof supabaseClient === 'undefined') {
    console.error('❌ supabaseClient não está disponível. Certifique-se de estar numa página que carrega agendamento.js');
    return;
  }
  
  // Lista completa de serviços para inserir
  const servicos = [
    {
      nome: 'Banho',
      descricao: 'Banho completo com shampoo e condicionador',
      preco: 50.00,
      duracao: 60
    },
    {
      nome: 'Tosa',
      descricao: 'Tosa higiênica ou completa',
      preco: 80.00,
      duracao: 60
    },
    {
      nome: 'Hidratação',
      descricao: 'Hidratação profunda do pelo',
      preco: 60.00,
      duracao: 60
    },
    {
      nome: 'Unhas',
      descricao: 'Corte e lixamento de unhas',
      preco: 30.00,
      duracao: 60
    },
    {
      nome: 'Escovação',
      descricao: 'Escovação e desembaraço',
      preco: 40.00,
      duracao: 60
    },
    {
      nome: 'Consulta',
      descricao: 'Consulta veterinária',
      preco: 120.00,
      duracao: 60
    }
  ];
  
  try {
    // 1. Verificar se já existem serviços
    console.log('1. Verificando serviços existentes...');
    const { data: existingServices, error: selectError } = await supabaseClient
      .from('servico')
      .select('*');
    
    if (selectError) {
      console.error('❌ Erro ao consultar serviços:', selectError.message);
      return;
    }
    
    console.log(`Serviços existentes: ${existingServices.length}`);
    
    if (existingServices.length > 0) {
      console.log('✅ Serviços já existem:', existingServices.map(s => s.nome));
      return;
    }
    
    // 2. Inserir todos os serviços
    console.log('2. Inserindo serviços...');
    const { data: insertedServices, error: insertError } = await supabaseClient
      .from('servico')
      .insert(servicos)
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir serviços:', insertError.message);
      
      // Tentar inserir um por vez se o insert em lote falhar
      console.log('3. Tentando inserção individual...');
      let sucessos = 0;
      
      for (const servico of servicos) {
        const { data, error } = await supabaseClient
          .from('servico')
          .insert([servico])
          .select();
        
        if (error) {
          console.error(`❌ Erro ao inserir ${servico.nome}:`, error.message);
        } else {
          sucessos++;
          console.log(`✅ ${servico.nome} inserido com sucesso`);
        }
      }
      
      console.log(`Total inserido: ${sucessos}/${servicos.length}`);
    } else {
      console.log(`✅ ${insertedServices.length} serviços inseridos com sucesso!`);
      insertedServices.forEach(s => console.log(`  - ${s.nome} (R$ ${s.preco})`));
    }
    
    // 3. Verificar resultado final
    console.log('4. Verificação final...');
    const { data: finalServices, error: finalError } = await supabaseClient
      .from('servico')
      .select('*');
    
    if (finalError) {
      console.error('❌ Erro na verificação final:', finalError.message);
    } else {
      console.log(`✅ Total de serviços na tabela: ${finalServices.length}`);
      console.log('=== INSERÇÃO CONCLUÍDA ===');
      
      // Testar listarServicos() se disponível
      if (typeof listarServicos === 'function') {
        console.log('5. Testando listarServicos()...');
        const servicosListados = await listarServicos();
        console.log(`✅ listarServicos() retornou ${servicosListados.length} serviços`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
})();