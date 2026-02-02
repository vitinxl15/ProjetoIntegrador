const dog = document.querySelector("#infoDog")
const dogList = document.querySelector("#cachorros")
const perfil = document.querySelector("#infoPerfil")
const agendamentos = document.querySelector("#agendamentos")
const info = document.querySelector("#informacoes")
const agenda = document.querySelector("#agenda")

if (dog) {
  dog.addEventListener("click", () => {
    info.style.display = "none"
    dogList.style.display = "flex"
    agenda.style.display = "none"
  })
}

if (agendamentos) {
  agendamentos.addEventListener("click", () => {
    info.style.display = "none"
    dogList.style.display = "none"
    agenda.style.display = "block"
  })
}

if (perfil) {
  perfil.addEventListener("click", () => {
    info.style.display = "flex"
    dogList.style.display = "none"
    agenda.style.display = "none"
  })
}
