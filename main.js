/*Arquivo para inicializar o projeto
Define qual página será renderizada de acordo com a rota (url)*/

import renderHomePage from "./src/pages/home";
import renderLoginPage from "./src/pages/login";
import renderProfilePage from "./src/pages/profile";
import renderSchedulingPage from "./src/pages/agendamento";
import renderRegisterPage from "./src/pages/register";
import renderAdmPage from "./src/pages/adm";
import renderAboutPage from "./src/pages/about";

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
    const url = (location.pathname || "").replace("ProjetoIntegrador", "/").trim();
    return url && url.startsWith("/") ? url : "/home";
}

function renderRoutes() {
    const url = getPath();
    const render = routes[url] || routes["/home"];
    render();
}

document.addEventListener('DOMContentLoaded', renderRoutes);
