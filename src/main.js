/*Define qual página será renderizada de acordo com a rota (url)*/
import renderHomePage from "../src/pages/home.js";
import renderLoginPage from "../src/pages/login.js";
import renderProfilePage from "../src/pages/profile.js";
import renderSchedulingPage from "../src/pages/agendamento.js";
import renderRegisterPage from "../src/pages/register.js";
import renderAdmPage from "../src/pages/adm.js";
import renderAboutPage from "../src/pages/about.js";

const routes = {
    "/login": renderLoginPage,
    "/cadastro": renderRegisterPage,
    "/home": renderHomePage
    /*A cada nova página criada, você importa e determina uma rota para ela*/
}


/*Obtém o caminho atual a partir da url*/
/*Ex.: www.sp.senac.br/cursos-tecnicos
       www.sp.senac.br
       
*/
function getPath() {
    const url = (location.hash || "").replace("/^#/", "").trim();
    console.log(url);
    return url && url.startsWith("/") ? url : "/home";
}

function renderRoutes() {
    const url = getPath();
    const render = routes[url] || routes["/home"];
    render();
}

window.addEventListener("hashchange", renderRoutes);
document.addEventListener('DOMContentLoaded', renderRoutes);
