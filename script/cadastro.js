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
  
  if (!validarCPF(cpf)) {
    mostrarPopup('CPF inválido!', 'error');
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
    
    // Inserir novo usuário
    const { data: novoUsuario, error: erroCadastro } = await supabase
      .from('usuario')
      .insert([
        {
          nome: nome,
          cpf: cpf,
          email: email,
          senha: senha, // Em produção, usar hash
          cargo: 'cliente'
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
          usuario_id: novoUsuario.id,
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
    
    // Fazer login automático
    localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
    
    setTimeout(() => {
      window.location.href = 'perfil.html';
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

// Função para validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digitoVerificador1 = resto >= 10 ? 0 : resto;
  
  if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digitoVerificador2 = resto >= 10 ? 0 : resto;
  
  if (digitoVerificador2 !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}
