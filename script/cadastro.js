// Script de cadastro de usuários no Supabase
document.addEventListener('DOMContentLoaded', function () {

  const formCadastro = document.getElementById('formCadastro');
  const cpfInput = document.getElementById('inputCpf');

  // ===============================
  // MÁSCARA DE CPF
  // ===============================
  if (cpfInput) {

    cpfInput.addEventListener("input", function () {
      let value = cpfInput.value.replace(/\D/g, "");

      // Limita a 11 números
      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      // Aplica máscara
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

      cpfInput.value = value;
    });

    // Bloqueia letras
    cpfInput.addEventListener("keypress", function (e) {
      if (!/\d/.test(e.key)) {
        e.preventDefault();
      }
    });
  }

  if (formCadastro) {
    formCadastro.addEventListener('submit', cadastrarUsuario);
  }

});

// ===============================
// FUNÇÃO PRINCIPAL
// ===============================
async function cadastrarUsuario(event) {
  event.preventDefault();

  const nome = document.getElementById('inputName').value.trim();
  const cpf = document.getElementById('inputCpf').value.trim();
  const email = document.getElementById('inputEmail').value.trim();
  const senha = document.getElementById('inputSenha').value;
  const confirmarSenha = document.getElementById('inputCSenha').value;

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

  // CPF LIMPO (só números)
  const cpfLimpo = cpf.replace(/\D/g, '');

  if (cpfLimpo.length !== 11) {
    mostrarPopup('CPF deve conter 11 dígitos!', 'error');
    return;
  }

  try {

    // Verificar se email já existe
    const { data: usuarioExistente } = await supabase
      .from('usuario')
      .select('email')
      .eq('email', email);

    if (usuarioExistente && usuarioExistente.length > 0) {
      mostrarPopup('Este email já está cadastrado!', 'error');
      return;
    }

    // Criar usuário
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
      mostrarPopup('Erro ao cadastrar usuário: ' + erroCadastro.message, 'error');
      return;
    }

    // Buscar usuário criado
    const { data: usuarioBuscado, error: erroBusca } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', email)
      .single();

    if (erroBusca || !usuarioBuscado) {
      mostrarPopup('Erro ao buscar usuário criado!', 'error');
      return;
    }

    // Criar cliente (agora salva CPF LIMPO)
    const { data: novoCliente, error: erroCliente } = await supabase
      .from('cliente')
      .insert([
        {
          id_usuario_fk: usuarioBuscado.id,
          nome: nome,
          cpf: cpfLimpo
        }
      ])
      .select()
      .single();

    if (erroCliente || !novoCliente) {

      // Deleta usuário se cliente falhar
      await supabase.from('usuario').delete().eq('id', usuarioBuscado.id);

      mostrarPopup('Erro ao criar cliente: ' + (erroCliente?.message || ''), 'error');
      return;
    }

    // Criar contato
    await supabase
      .from('contato')
      .insert([
        {
          id_cliente_fk: novoCliente.id,
          celular: '',
          telefone: ''
        }
      ]);

    // Login automático
    const dadosCompletos = {
      ...usuarioBuscado,
      cliente: novoCliente
    };

    localStorage.setItem('usuarioLogado', JSON.stringify(dadosCompletos));

    mostrarPopup('✅ Cadastro realizado com sucesso! Redirecionando...', 'success');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);

  } catch (error) {
    mostrarPopup('Erro ao cadastrar: ' + error.message, 'error');
  }
}

// ===============================
// VALIDAR EMAIL
// ===============================
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}