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
    console.log('Iniciando cadastro de usuário...');
    
    // Verificar se email já existe
    const { data: usuarioExistente, error: erroConsulta } = await supabase
      .from('usuario')
      .select('email')
      .eq('email', email)
      .single();
    
    if (usuarioExistente) {
      mostrarPopup('Este email já está cadastrado!', 'error');
      return;
    }
    
    // Inserir novo usuário com privilégio de cliente (id 2)
    const { data: novoUsuario, error: erroCadastro } = await supabase
      .from('usuario')
      .insert([
        {
          email: email,
          senha: senha, // Em produção, usar hash
          id_privilegio_fk: 2 // 2 = cliente
        }
      ])
      .select()
      .single();
    
    if (erroCadastro) {
      console.error('Erro ao cadastrar usuário:', erroCadastro);
      mostrarPopup('Erro ao cadastrar: ' + erroCadastro.message, 'error');
      return;
    }
    
    console.log('Usuário cadastrado com sucesso:', novoUsuario);
    
    // Criar registro de cliente automaticamente
    const { data: novoCliente, error: erroCliente } = await supabase
      .from('cliente')
      .insert([
        {
          id_usuario_fk: novoUsuario.id,
          nome: nome,
          cpf: cpf,
          email: email,
          telefone: '' // Pode ser preenchido depois no perfil
        }
      ])
      .select()
      .single();
    
    if (erroCliente) {
      console.error('Erro ao criar cliente:', erroCliente);
      // Continua mesmo com erro, pois usuário já foi criado
    } else {
      console.log('Cliente criado com sucesso:', novoCliente);
    }
    
    mostrarPopup('Cadastro realizado com sucesso! Redirecionando...', 'success');
    
    // Fazer login automático - salvar dados completos do cliente
    const dadosCompletos = {
      ...novoUsuario,
      cliente: novoCliente
    };
    localStorage.setItem('usuarioLogado', JSON.stringify(dadosCompletos));
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    mostrarPopup('Erro ao cadastrar usuário. Tente novamente.', 'error');
  }
}

// Função para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
