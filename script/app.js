// Inicialização do Supabase
const SUPABASE_URL = 'https://uhhagvmmxtcavngjdaik.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGFndm1teHRjYXZuZ2pkYWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzQ5MTQsImV4cCI6MjA3MzgxMDkxNH0.myBAOKrgVRKi82SeGC9r_P1N1-Z9tLtvN2cpk_MCYdQ';

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
      const nomeExibir = usuarioLogado.cliente?.nome || usuarioLogado.email;
      saudacaoDiv.textContent = `Olá, ${nomeExibir}!`;
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


