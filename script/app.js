function fazerLogout() {
  localStorage.removeItem("usuarioLogado")
  window.location.href = "index.html"
}

document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
  const saudacaoDiv = document.getElementById("saudacaoUsuario")
  
  const linkCadastro = document.getElementById("linkCadastro")
  const linkLogin = document.getElementById("linkLogin")
  const linkPerfil = document.getElementById("linkPerfil")
  const linkSair = document.getElementById("linkSair")

  if (usuarioLogado) {
    if (saudacaoDiv) {
      saudacaoDiv.textContent = `Olá, ${usuarioLogado.nome}!`
    }

    if (linkCadastro) linkCadastro.style.display = "none"
    if (linkLogin) linkLogin.style.display = "none"
    if (linkPerfil) linkPerfil.style.display = "block"
    if (linkSair) linkSair.style.display = "block"
  } else {
    if (linkCadastro) linkCadastro.style.display = "block"
    if (linkLogin) linkLogin.style.display = "block"
    if (linkPerfil) linkPerfil.style.display = "none"
    if (linkSair) linkSair.style.display = "none"
  }
});

<<<<<<< HEAD
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
   
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); 

    
    const cachorro = document.getElementById("cachorro").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const data = document.getElementById("data").value;
    const servico = document.getElementById("serviço").value;

   
    if (!cachorro || !endereco || !data || !servico) {
      alert("⚠️ Preencha todos os campos!");
      return;
    }

   
    alert(
      `🐶 Agendamento realizado com sucesso!\n\n` +
      `Cachorro: ${cachorro}\n` +
      `Endereço: ${endereco}\n` +
      `Data: ${data}\n` +
      `Serviço: ${servico}`
    );

    
    form.reset();
  });
});


  }


  // Saudação no topo
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const saudacaoDiv = document.getElementById("saudacaoUsuario");

  if (usuarioLogado && saudacaoDiv) {
    saudacaoDiv.textContent = `Olá, ${usuarioLogado.nome}! Seja bem-vindo(a)!`;
  }
});
=======
>>>>>>> cd521a5 (Correções: fluxo de serviços, SQL, frontend e integração Supabase.)
