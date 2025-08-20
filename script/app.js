document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const saudacaoDiv = document.getElementById("saudacaoUsuario");
  const btnCadastro = document.getElementById("btnCadastro");
  const btnLogin = document.getElementById("btnLogin");
  const btnSair = document.getElementById("btnSair");

  if (usuarioLogado) {
      // Mostra saudação
      saudacaoDiv.textContent = `Olá, ${usuarioLogado.nome}! Seja bem-vindo(a) ao Focinho Gelado!`;

      // Esconde botões de cadastro e login
      btnCadastro.style.display = "none";
      btnLogin.style.display = "none";

      // Mostra botão sair
      btnSair.style.display = "inline-block";

      // Logout
      btnSair.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("usuarioLogado");
          window.location.reload();
      });
  } else {
      // Não está logado → mostra cadastro e login, esconde sair
      btnCadastro.style.display = "inline-block";
      btnLogin.style.display = "inline-block";
      btnSair.style.display = "none";
  }
});
// === CONTINUAÇÃO (carrossel ou outros scripts existentes) ===

// === LÓGICA DE LOGIN E CADASTRO ===
document.addEventListener("DOMContentLoaded", () => {
  const cadastroForm = document.getElementById("formCadastro");
  const loginForm = document.getElementById("formLogin");

  // Cadastro
  if (cadastroForm) {
    cadastroForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      if (!nome || !email || !senha) {
        alert("Preencha todos os campos.");
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

      if (usuarios.some(u => u.email === email)) {
        alert("Este email já está cadastrado.");
        return;
      }

      usuarios.push({ nome, email, senha });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const senha = document.getElementById("loginSenha").value;

      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      const usuario = usuarios.find(u => u.email === email && u.senha === senha);

      if (usuario) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        if(usuario.nome === "admin"){
          window.location.href = "adm.html";
        }
        else{
          alert(`Bem-vindo(a), ${usuario.nome}!`);
        window.location.href = "index.html";
        }
        
      } 
      else {
        alert("Email ou senha inválidos.");
      }
    });
  }


  // Saudação no topo
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const saudacaoDiv = document.getElementById("saudacaoUsuario");

  if (usuarioLogado && saudacaoDiv) {
    saudacaoDiv.textContent = `Olá, ${usuarioLogado.nome}! Seja bem-vindo(a)!`;
  }
});
