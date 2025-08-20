const pernilCategory = document.querySelectorAll(".pernilCategory");
document.querySelector(".pernilCategory").addEventListener("click", () => {
    /* adiciona um Li com o texto: "irineu" ao ul */
    const li = document.createElement("li");
    li.textContent = "irineu";
    const ul = document.querySelector(".pernilLista");
    ul.appendChild(li);



});