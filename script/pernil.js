const pernilCategory = document.querySelectorAll(".pernilCategory");
const lista=document.querySelector("#pernilList");
const dog = document.querySelector("#infoDog");
const dogList = document.querySelector("#cachorros");
const perfil = document.querySelector("#infoPerfil");
const agendamentos = document.querySelector("#agendamentos");
const info = document.querySelector("#informacoes");
const agenda = document.querySelector("#agenda");

/* adiciona um Li com o texto: "irineu" na lista ao clicar no botão(pernilCategory) */

pernilCategory.forEach((category) => {
    category.addEventListener("click", () => {
        const li = document.createElement("li");
        li.textContent = "irineu";
        lista.appendChild(li);
    });
});
/*ao clicar na variável dog, ou agendamentos, oculta o campo informacoes */

dog.addEventListener("click", () => {
    info.style.display = "none";
    dogList.style.display = "block";
    agenda.style.display = "none";
});
agendamentos.addEventListener("click", () => {
    info.style.display = "none";
    dogList.style.display = "none";
    agenda.style.display = "block";
});
perfil.addEventListener("click", () => {
    info.style.display = "block";
    dogList.style.display = "none";
    agenda.style.display = "none";
});

