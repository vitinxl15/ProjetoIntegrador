let servicoSelecionado = null


async function inicializarServicos() {
  if (typeof listarServicos !== 'function') {
    console.error('Função listarServicos não encontrada!')
    return;
  }
  const cards = document.querySelectorAll(".card[data-servico]")
  const modal = document.getElementById("modalServico")
  const closeModal = document.querySelector(".close")
  const btnAgendar = document.getElementById("btnAgendar")

  const servicos = await listarServicos()
  if (!servicos || servicos.length === 0) {
    console.error('Nenhum serviço encontrado!')
    return;
  }

  cards.forEach(card => {
    const btnSobre = card.querySelector(".btn-sobre")
    if (btnSobre) {
      btnSobre.addEventListener("click", () => {
        const nomeServico = card.dataset.servico
        const servico = servicos.find(s => s.nome === nomeServico)
        if (servico) {
          servicoSelecionado = servico
          document.getElementById("modalTitulo").textContent = servico.nome
          document.getElementById("modalDescricao").textContent = servico.descricao
          document.getElementById("modalPreco").textContent = `Preço: R$ ${parseFloat(servico.preco).toFixed(2)}`
          document.getElementById("modalDuracao").textContent = `Duração: ${servico.duracao}`
          modal.style.display = "block"
        } else {
          console.error('Serviço não encontrado:', nomeServico)
        }
      })
    }
  })

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none"
    })
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })

  if (btnAgendar) {
    btnAgendar.addEventListener("click", async () => {
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
      if (!usuarioLogado) {
        alert("Você precisa fazer login primeiro!")
        window.location.href = "login.html"
        return
      }
      let cliente
      if (usuarioLogado.clienteId) {
        const { data } = await supabaseClient
          .from("cliente")
          .select("id, nome, cpf")
          .eq("id", usuarioLogado.clienteId)
          .single()
        cliente = data
      } else {
        cliente = await buscarCliente(usuarioLogado.id)
      }
      if (!cliente) {
        alert("Erro ao carregar dados do cliente")
        return
      }
      const animais = await buscarAnimaisCliente(cliente.id)
      if (animais.length === 0) {
        alert("Você precisa cadastrar um pet primeiro!")
        localStorage.setItem("servicoParaAgendar", JSON.stringify(servicoSelecionado))
        window.location.href = "perfil.html"
        return
      }
      localStorage.setItem("servicoParaAgendar", JSON.stringify(servicoSelecionado))
      localStorage.setItem("clienteParaAgendar", JSON.stringify(cliente))
      window.location.href = "agendamento.html"
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Aguarda Supabase e listarServicos estarem disponíveis
  if (typeof listarServicos === 'function') {
    inicializarServicos();
  } else {
    setTimeout(inicializarServicos, 500);
  }
});

