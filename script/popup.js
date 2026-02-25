function mostrarPopup(mensagem, tipo = "success") {

  // Remover popup anterior se existir
  const popupExistente = document.getElementById("popup-global");
  if (popupExistente) popupExistente.remove();

  // Tipos suportados
  const tipos = {
    success: "success",
    error: "danger",
    warning: "warning",
    info: "info"
  };

  const bootstrapTipo = tipos[tipo] || "success";

  const div = document.createElement("div");
  div.id = "popup-global";
  div.className = `alert alert-${bootstrapTipo} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow`;
  div.style.zIndex = "9999";
  div.style.minWidth = "320px";
  div.style.maxWidth = "90%";

  div.innerHTML = `
    <div class="d-flex align-items-center justify-content-between">
      <span>${mensagem}</span>
      <button type="button" class="btn-close" aria-label="Close"></button>
    </div>
  `;

  document.body.appendChild(div);

  // Botão fechar
  div.querySelector(".btn-close").addEventListener("click", () => {
    removerPopup(div);
  });

  // Auto remover
  setTimeout(() => {
    removerPopup(div);
  }, 3500);
}

function removerPopup(elemento) {
  elemento.classList.remove("show");
  elemento.classList.add("fade");

  setTimeout(() => {
    elemento.remove();
  }, 300);
}