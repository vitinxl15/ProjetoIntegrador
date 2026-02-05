// Script de login de usuários no Supabase
document.addEventListener('DOMContentLoaded', function() {
  const formLogin = document.getElementById('formLogin');
  
  if (formLogin) {
    formLogin.addEventListener('submit', fazerLogin);
  }
  
  // Verificar se já está logado
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (usuarioLogado) {
    window.location.href = 'perfil.html';
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
    
    // Buscar usuário no banco
    const { data: usuario, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', email)
      .eq('senha', senha) // Em produção, usar hash
      .single();
    
    if (error || !usuario) {
      console.error('Erro ao fazer login:', error);
      mostrarPopup('Email ou senha incorretos!', 'error');
      return;
    }
    
    console.log('Login realizado com sucesso:', usuario);
    
    // Salvar usuário no localStorage
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    
    mostrarPopup('Login realizado com sucesso!', 'success');
    
    // Redirecionar baseado no cargo
    setTimeout(() => {
      if (usuario.cargo === 'admin') {
        window.location.href = 'adm.html';
      } else {
        window.location.href = 'perfil.html';
      }
    }, 1500);
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    mostrarPopup('Erro ao fazer login. Tente novamente.', 'error');
  }
}
