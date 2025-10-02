import Navbar from "../components/Navbar";

export default function renderProfilePage() {
    const nav = document.getElementById("nav");
    /*Limpa a parte superior da página onde está o menu*/
    nav.innerHTML = '';

    const menu = Navbar();
    /*appendChild incorpora como elemento "child" (filho) de um elemento "parent" (pai)*/
    nav.appendChild(menu);

}