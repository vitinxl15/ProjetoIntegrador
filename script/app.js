// Inicialização do Supabase
const SUPABASE_URL = 'https://xqjlmwxikmvgfltaoyhs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxamxtd3hpa212Z2ZsdGFveWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MjA1NjEsImV4cCI6MjA0ODQ5NjU2MX0.z4YmVl2ubvSbQgfXMSQzkKgQ4nWAp-oDnPbjuAYDCk8';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Supabase inicializado:', supabase);
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
      saudacaoDiv.textContent = `Olá, ${usuarioLogado.email}!`;
    }
    if (linkCadastro) linkCadastro.style.display = "none"
    if (linkLogin) linkLogin.style.display = "none"
    if (linkPerfil) linkPerfil.style.display = "none"
    if (linkSair) linkSair.style.display = "block"
  } else {
    if (linkCadastro) linkCadastro.style.display = "block"
    if (linkLogin) linkLogin.style.display = "block"
    if (linkPerfil) linkPerfil.style.display = "none"
    if (linkSair) linkSair.style.display = "none"
  }
});


