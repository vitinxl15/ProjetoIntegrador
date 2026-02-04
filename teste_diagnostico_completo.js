// TESTE COMPLETO DE DIAGNÓSTICO
// Execute este código no console do navegador (F12)

(async function testeCompletoDiagnostico() {
  console.log('🔍 === DIAGNÓSTICO COMPLETO INICIADO ===');
  
  // PASSO 1: Verificar dependências
  console.log('\n📋 PASSO 1: Verificando dependências...');
  console.log('- window.supabase:', typeof window.supabase);
  console.log('- window.supabaseClient:', typeof window.supabaseClient);
  console.log('- window.listarServicos:', typeof window.listarServicos);
  
  // Criar cliente se não existir
  if (typeof window.supabaseClient === 'undefined') {
    if (typeof window.supabase === 'undefined') {
      console.error('❌ Supabase não está carregado!');
      console.log('Certifique-se de estar numa página que carrega o Supabase');
      return;
    }
    
    console.log('⚠️ Criando supabaseClient...');
    window.supabaseClient = window.supabase.createClient(
      "https://uhhagvmmxtcavngjdaik.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGFndm1teHRjYXZuZ2pkYWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzQ5MTQsImV4cCI6MjA3MzgxMDkxNH0.myBAOKrgVRKi82SeGC9r_P1N1-Z9tLtvN2cpk_MCYdQ"
    );
    console.log('✅ supabaseClient criado');
  }
  
  const client = window.supabaseClient;
  
  // PASSO 2: Testar conexão básica
  console.log('\n🔌 PASSO 2: Testando conexão...');
  try {
    const { data: tables, error: tablesError } = await client
      .from('servico')
      .select('count(*)', { count: 'exact', head: true });
    
    if (tablesError) {
      console.error('❌ Erro de conexão:', tablesError.message);
      return;
    }
    console.log('✅ Conexão OK');
  } catch (err) {
    console.error('❌ Erro de conexão geral:', err);
    return;
  }
  
  // PASSO 3: Verificar dados existentes
  console.log('\n📊 PASSO 3: Verificando dados existentes...');
  try {
    const { data: existing, error: selectError } = await client
      .from('servico')
      .select('*');
    
    if (selectError) {
      console.error('❌ Erro ao consultar:', selectError.message);
    } else {
      console.log(`📈 Registros existentes: ${existing.length}`);
      if (existing.length > 0) {
        console.log('Primeiros registros:');
        existing.slice(0, 3).forEach((reg, i) => {
          console.log(`  ${i+1}. ID: ${reg.id}, Nome: "${reg.nome}", Preço: ${reg.preco}`);
        });
      }
    }
  } catch (err) {
    console.error('❌ Erro na consulta:', err);
  }
  
  // PASSO 4: Limpar e inserir dados de teste
  console.log('\n🗑️ PASSO 4: Limpando dados antigos...');
  try {
    const { error: deleteError } = await client
      .from('servico')
      .delete()
      .neq('id', -999); // delete all
    
    if (deleteError) {
      console.warn('⚠️ Erro ao limpar (pode ser normal):', deleteError.message);
    } else {
      console.log('✅ Dados antigos removidos');
    }
  } catch (err) {
    console.warn('⚠️ Erro ao limpar:', err.message);
  }
  
  console.log('\n➕ PASSO 5: Inserindo dados de teste...');
  const servicosTeste = [
    { nome: 'Banho', descricao: 'Banho completo com shampoo', preco: 50.00, duracao: 60 },
    { nome: 'Tosa', descricao: 'Tosa higiênica completa', preco: 80.00, duracao: 60 },
    { nome: 'Consulta', descricao: 'Consulta veterinária', preco: 120.00, duracao: 60 }
  ];
  
  try {
    const { data: inserted, error: insertError } = await client
      .from('servico')
      .insert(servicosTeste)
      .select();
    
    if (insertError) {
      console.error('❌ Erro na inserção:', insertError.message);
      console.log('Detalhes:', insertError);
    } else {
      console.log(`✅ ${inserted.length} serviços inseridos com sucesso`);
      inserted.forEach((srv, i) => {
        console.log(`  ${i+1}. ${srv.nome} (ID: ${srv.id})`);
      });
    }
  } catch (err) {
    console.error('❌ Erro geral na inserção:', err);
  }
  
  // PASSO 6: Verificar inserção
  console.log('\n🔍 PASSO 6: Verificando inserção...');
  try {
    const { data: afterInsert, error: afterError } = await client
      .from('servico')
      .select('*');
    
    if (afterError) {
      console.error('❌ Erro após inserção:', afterError.message);
    } else {
      console.log(`📊 Total após inserção: ${afterInsert.length}`);
      if (afterInsert.length > 0) {
        console.log('Dados inseridos:');
        afterInsert.forEach((srv, i) => {
          console.log(`  ${i+1}. "${srv.nome}" - R$ ${srv.preco} - ${srv.duracao}min`);
        });
      }
    }
  } catch (err) {
    console.error('❌ Erro na verificação:', err);
  }
  
  // PASSO 7: Testar listarServicos()
  console.log('\n🎯 PASSO 7: Testando função listarServicos()...');
  if (typeof window.listarServicos === 'function') {
    try {
      const servicos = await window.listarServicos();
      if (servicos && servicos.length > 0) {
        console.log(`✅ listarServicos() retornou ${servicos.length} registros`);
        servicos.forEach((srv, i) => {
          console.log(`  ${i+1}. ${srv.nome} - R$ ${srv.preco}`);
        });
      } else {
        console.error('❌ listarServicos() retornou vazio ou null');
        console.log('Resultado:', servicos);
      }
    } catch (err) {
      console.error('❌ Erro em listarServicos():', err);
    }
  } else {
    console.error('❌ Função listarServicos() não encontrada');
    console.log('Certifique-se de estar numa página que carrega agendamento.js');
  }
  
  // PASSO 8: Testar inicializarServicos()
  console.log('\n🚀 PASSO 8: Testando inicializarServicos()...');
  if (typeof window.inicializarServicos === 'function') {
    try {
      await window.inicializarServicos();
      console.log('✅ inicializarServicos() executado');
    } catch (err) {
      console.error('❌ Erro em inicializarServicos():', err);
    }
  } else {
    console.log('⚠️ inicializarServicos() não encontrada (pode ser normal)');
  }
  
  console.log('\n🏁 === DIAGNÓSTICO COMPLETO FINALIZADO ===');
  console.log('\n📝 RESUMO:');
  console.log('1. Se viu "✅ listarServicos() retornou X registros", está funcionando');
  console.log('2. Se viu "❌ listarServicos() retornou vazio", há problema na função');
  console.log('3. Teste clicando nos botões "Sobre" agora');
  
})();