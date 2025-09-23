$(document).ready(function () {
    const API_URL = "http://localhost:3000/usuarios";
    // função mensagem
    function mensagem(msg, isError = false){
        $("#mensagem").text(msg).toggleClass("erro", isError);
        setTimeout(() => $("#mensagem").text(""), 3000);
    }
     const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
     //se estiver na tela de adm, e não estiver logado, redireciona para login
     if(window.location.href.includes("adm.html") && !usuario){
        window.location.href = "login.html";
        return;
    }
    else if( usuario.cargo !== "admin"){
        window.location.href = "index.html";
        return;
    }
});