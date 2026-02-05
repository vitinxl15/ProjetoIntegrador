// Script de login de usuários no Supabase
document.addEventListener('DOMContentLoaded', function() {
  const formLogin = document.getElementById('formLogin');
  
  if (formLogin) {
    formLogin.addEventListener('submit', fazerLogin);
  }
  
  // Verificar se já está logado
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (usuarioLogado) {
    if (usuarioLogado.id_privilegio_fk === 1) {
      window.location.href = 'adm.html';
    } else {
      window.location.href = 'index.html';
    }
  }
});

async function fazerLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  
  if (!email || !senha) {
    mostrarPopup('Por favor, preencha todos os campos!', 'error');
    return;
  }
  
  try {
    console.log('Tentando fazer login...');
    
    // Buscar usuário no banco (sem JOIN complexo)
    const { data: usuario, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', email)
      .eq('senha', senha);
    
    if (error) {
      console.error('Erro ao fazer login:', error);
      mostrarPopup('Erro ao fazer login. Tente novamente.', 'error');
      return;
    }
    
    if (!usuario || usuario.length === 0) {
      mostrarPopup('Email ou senha incorretos!', 'error');
      return;
    }
    
    const usuarioLogado = usuario[0];
    console.log('✅ Usuário encontrado:', usuarioLogado);
    
    // Buscar dados do cliente se existir
    console.log('🔍 Buscando dados do cliente para id_usuario_fk:', usuarioLogado.id);
    const { data: cliente, error: erroCliente } = await supabase
      .from('cliente')
      .select('*')
      .eq('id_usuario_fk', usuarioLogado.id);
    
    if (erroCliente) {
      console.error('❌ Erro ao buscar cliente:', erroCliente);
    }
    
    console.log('👤 Dados do cliente retornados:', cliente);
    
    if (cliente && cliente.length > 0) {
      usuarioLogado.cliente = cliente[0];
      console.log('✅ Cliente adicionado ao usuarioLogado:', usuarioLogado.cliente);
    } else {
      console.warn('⚠️ Nenhum cliente encontrado para este usuário');
    }
    
    // Salvar usuário no localStorage
    console.log('💾 Salvando no localStorage:', usuarioLogado);
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    
    mostrarPopup('Login realizado com sucesso!', 'success');
    
    // Redirecionar baseado no id_privilegio_fk
    setTimeout(() => {
      if (usuarioLogado.id_privilegio_fk === 1) {
        window.location.href = 'adm.html';
      } else {
        window.location.href = 'index.html';
      }
    }, 1500);
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    mostrarPopup('Erro ao fazer login. Tente novamente.', 'error');
  }
}
