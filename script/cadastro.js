// Script de cadastro de usuários no Supabase
document.addEventListener('DOMContentLoaded', function() {
  const formCadastro = document.getElementById('formCadastro');
  
  if (formCadastro) {
    formCadastro.addEventListener('submit', cadastrarUsuario);
  }
});

async function cadastrarUsuario(event) {
  event.preventDefault();
  
  // Capturar dados do formulário
  const nome = document.getElementById('inputName').value.trim();
  const cpf = document.getElementById('inputCpf').value.trim();
  const email = document.getElementById('inputEmail').value.trim();
  const senha = document.getElementById('inputSenha').value;
  const confirmarSenha = document.getElementById('inputCSenha').value;
  
  // Validações
  if (!nome || !cpf || !email || !senha || !confirmarSenha) {
    mostrarPopup('Por favor, preencha todos os campos!', 'error');
    return;
  }
  
  if (senha !== confirmarSenha) {
    mostrarPopup('As senhas não coincidem!', 'error');
    return;
  }
  
  if (senha.length < 6) {
    mostrarPopup('A senha deve ter no mínimo 6 caracteres!', 'error');
    return;
  }
  
  if (!validarEmail(email)) {
    mostrarPopup('Email inválido!', 'error');
    return;
  }
  
  // Validar apenas o tamanho do CPF (11 dígitos)
  const cpfLimpo = cpf.replace(/[^\d]/g, '');
  if (cpfLimpo.length !== 11) {
    mostrarPopup('CPF deve conter 11 dígitos!', 'error');
    return;
  }
  
  try {
    console.log('🚀 INICIANDO CADASTRO...');
    
    // PASSO 1: Verificar se email já existe
    console.log('🔍 Verificando se email já existe...');
    const { data: usuarioExistente, error: erroConsulta } = await supabase
      .from('usuario')
      .select('email')
      .eq('email', email);
    
    if (usuarioExistente && usuarioExistente.length > 0) {
      console.log('❌ Email já cadastrado');
      mostrarPopup('Este email já está cadastrado!', 'error');
      return;
    }
    console.log('✅ Email disponível');
    
    // PASSO 2: Criar USUÁRIO primeiro
    console.log('📝 CRIANDO USUÁRIO...');
    const { error: erroCadastro } = await supabase
      .from('usuario')
      .insert([
        {
          email: email,
          senha: senha,
          id_privilegio_fk: 2
        }
      ]);
    
    if (erroCadastro) {
      console.error('❌ ERRO ao criar usuário:', erroCadastro);
      mostrarPopup('Erro ao cadastrar usuário: ' + erroCadastro.message, 'error');
      return;
    }
    
    console.log('✅ USUÁRIO CRIADO! Buscando dados no banco...');
    
    // PASSO 3: Buscar o usuário recém-criado no banco
    const { data: usuarioBuscado, error: erroBusca } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', email)
      .single();
    
    if (erroBusca || !usuarioBuscado) {
      console.error('❌ ERRO ao buscar usuário:', erroBusca);
      mostrarPopup('Erro ao buscar usuário criado: ' + (erroBusca?.message || 'Usuário não encontrado'), 'error');
      return;
    }
    
    console.log('✅ USUÁRIO ENCONTRADO no banco!');
    console.log('   ID:', usuarioBuscado.id);
    console.log('   Email:', usuarioBuscado.email);
    console.log('   Privilégio:', usuarioBuscado.id_privilegio_fk);
    
    // PASSO 4: Criar CLIENTE vinculado ao usuário
    console.log('📝 CRIANDO CLIENTE para usuário ID:', usuarioBuscado.id);
    const { data: novoCliente, error: erroCliente } = await supabase
      .from('cliente')
      .insert([
        {
          id_usuario_fk: usuarioBuscado.id,
          nome: nome,
          cpf: cpf
        }
      ])
      .select()
      .single();
    
    if (erroCliente || !novoCliente) {
      console.error('❌ ERRO ao criar cliente:', erroCliente);
      console.error('❌ Código do erro:', erroCliente?.code);
      console.error('❌ Mensagem:', erroCliente?.message);
      
      // RLS bloqueando?
      if (erroCliente?.code === 'PGRST301' || erroCliente?.message?.includes('policy')) {
        alert('⚠️ ERRO DE PERMISSÃO (RLS)\n\nExecute no Supabase:\n\nALTER TABLE cliente DISABLE ROW LEVEL SECURITY;');
      }
      
      // Deletar usuário para não deixar órfão
      console.log('🗑️ Deletando usuário órfão...');
      await supabase.from('usuario').delete().eq('id', usuarioBuscado.id);
      
      mostrarPopup('Erro ao criar cliente: ' + (erroCliente?.message || 'Verifique permissões RLS'), 'error');
      return;
    }
    
    console.log('✅ CLIENTE CRIADO com sucesso!');
    console.log('   ID:', novoCliente.id);
    console.log('   Nome:', novoCliente.nome);
    console.log('   CPF:', novoCliente.cpf);
    
    // PASSO 4: Criar contato (opcional)
    console.log('📝 Criando registro de contato...');
    const { error: erroContato } = await supabase
      .from('contato')
      .insert([
        {
          id_cliente_fk: novoCliente.id,
          celular: '',
          telefone: ''
        }
      ]);
    
    if (erroContato) {
      console.warn('⚠️ Não foi possível criar contato (não crítico):', erroContato.message);
    } else {
      console.log('✅ Contato criado');
    }
    
    // PASSO 5: Login automático
    console.log('💾 Fazendo login automático...');
    const dadosCompletos = {
      ...usuarioBuscado,
      cliente: novoCliente
    };
    localStorage.setItem('usuarioLogado', JSON.stringify(dadosCompletos));
    console.log('✅ Dados salvos no localStorage:', dadosCompletos);
    
    mostrarPopup('✅ Cadastro realizado com sucesso! Redirecionando...', 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    
  } catch (error) {
    console.error('❌ ERRO GERAL:', error);
    mostrarPopup('Erro ao cadastrar: ' + error.message, 'error');
  }
}

// Função para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
