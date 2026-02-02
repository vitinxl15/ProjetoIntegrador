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

