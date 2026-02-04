// Diagnóstico completo do problema
// Execute este código no console do navegador

(async function diagnosticoCompleto() {
  console.log('=== DIAGNÓSTICO COMPLETO ===');
  
  // 1. Verificar se todas as dependências estão carregadas
  console.log('1. Verificando dependências...');
  console.log('- typeof supabase:', typeof supabase);
  console.log('- typeof supabaseClient:', typeof supabaseClient);
  console.log('- typeof listarServicos:', typeof listarServicos);
  
  if (typeof supabaseClient === 'undefined') {
    console.error('❌ PROBLEMA: supabaseClient não definido');
    if (typeof supabase !== 'undefined') {
      console.log('⚠️ Supabase disponível, mas client não inicializado');
      console.log('Tentando criar client...');
      const supabaseUrl = "https://uhhagvmmxtcavngjdaik.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGFndm1teHRjYXZuZ2pkYWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzQ5MTQsImV4cCI6MjA3MzgxMDkxNH0.myBAOKrgVRKi82SeGC9r_P1N1-Z9tLtvN2cpk_MCYdQ";
      window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
      console.log('✅ Client criado manualmente');
    } else {
      console.error('❌ Supabase library não carregada');
      return;
    }
  }
  
  // 2. Testar consulta direta ao Supabase
  console.log('2. Testando consulta direta...');
  try {
    const { data, error, count } = await supabaseClient
      .from('servico')
      .select('*', { count: 'exact' });
    
    console.log('- Error:', error);
    console.log('- Data length:', data ? data.length : 'null');
    console.log('- Count:', count);
    console.log('- Data preview:', data);
    
    if (error) {
      console.error('❌ ERRO na consulta:', error.message);
      console.log('Detalhes do erro:', error);
    } else if (!data || data.length === 0) {
      console.warn('⚠️ Tabela vazia ou não encontrada');
      
      // Verificar se a tabela existe
      console.log('3. Verificando existência da tabela...');
      try {
        const { error: schemaError } = await supabaseClient
          .from('servico')
          .select('count(*)', { count: 'exact', head: true });
        
        if (schemaError) {
          console.error('❌ Tabela não existe ou sem permissão:', schemaError.message);
        } else {
          console.log('✅ Tabela existe, mas está vazia');
        }
      } catch (schemaErr) {
        console.error('❌ Erro ao verificar schema:', schemaErr);
      }
    } else {
      console.log('✅ Dados encontrados:', data.length, 'registros');
    }
    
  } catch (err) {
    console.error('❌ Erro geral na consulta:', err);
  }
  
  // 3. Testar função listarServicos()
  if (typeof listarServicos === 'function') {
    console.log('4. Testando listarServicos()...');
    try {
      const servicos = await listarServicos();
      console.log('- Resultado:', servicos);
      console.log('- Length:', servicos ? servicos.length : 'null');
    } catch (err) {
      console.error('❌ Erro em listarServicos():', err);
    }
  }
  
  console.log('=== FIM DO DIAGNÓSTICO ===');
})();