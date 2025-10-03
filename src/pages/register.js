import Footer from "../components/Footer.js";
import Header from "../components/Header.js";

export default function renderRegisterPage() {
    const nav = document.getElementById("nav");
    /*Limpa a parte superior da página onde está o menu*/
    nav.innerHTML = '';

    const header = Header();
    /*appendChild incorpora como elemento "child" (filho) de um elemento "parent" (pai)*/
    nav.appendChild(header);

    const root = document.getElementById("root");
    root.innerHTML = '';

    /*Footer*/
    const footer = document.getElementById("footer");
    footer.innerHTML = '';
    
    const rodape = Footer();
    footer.appendChild(rodape);

}