// Script simples para testar o modal
console.log('🔧 Script de teste carregado');

// Aguardar o DOM estar pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM carregado para teste');
    
    // Configurar botões sobre após um delay
    setTimeout(function() {
        const cards = document.querySelectorAll('.card[data-servico]');
        const modal = document.getElementById('modalServico');
        
        console.log(`📋 Encontrados ${cards.length} cards`);
        console.log('🎯 Modal encontrado:', !!modal);
        
        cards.forEach(function(card, index) {
            const btnSobre = card.querySelector('.btn-sobre');
            console.log(`🔘 Card ${index + 1} - Botão encontrado:`, !!btnSobre);
            
            if (btnSobre) {
                btnSobre.addEventListener('click', function() {
                    console.log('👆 Botão clicado!');
                    const nomeServico = card.dataset.servico;
                    console.log('🔍 Serviço:', nomeServico);
                    
                    // Dados mock para teste
                    const servicosMock = {
                        'Banho': { nome: 'Banho', descricao: 'Banho completo com shampoo', preco: 50.00, duracao: 60 },
                        'Tosa': { nome: 'Tosa', descricao: 'Tosa higiênica completa', preco: 80.00, duracao: 60 },
                        'Hidratação': { nome: 'Hidratação', descricao: 'Hidratação profunda do pelo', preco: 60.00, duracao: 60 },
                        'Unhas': { nome: 'Unhas', descricao: 'Corte e lixamento de unhas', preco: 30.00, duracao: 30 },
                        'Escovação': { nome: 'Escovação', descricao: 'Escovação e desembaraço', preco: 40.00, duracao: 45 },
                        'Consulta': { nome: 'Consulta', descricao: 'Consulta veterinária', preco: 120.00, duracao: 60 }
                    };
                    
                    const servico = servicosMock[nomeServico];
                    if (servico && modal) {
                        console.log('✅ Abrindo modal para:', servico.nome);
                        
                        document.getElementById('modalTitulo').textContent = servico.nome;
                        document.getElementById('modalDescricao').textContent = servico.descricao;
                        document.getElementById('modalPreco').textContent = `Preço: R$ ${servico.preco.toFixed(2)}`;
                        document.getElementById('modalDuracao').textContent = `Duração: ${servico.duracao} minutos`;
                        
                        modal.style.display = 'block';
                        console.log('🎯 Modal exibido!');
                    } else {
                        console.error('❌ Erro ao abrir modal');
                    }
                });
            }
        });
        
        // Configurar botão de fechar
        const closeBtn = document.querySelector('.close');
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                console.log('❌ Modal fechado pelo X');
            });
        }
        
        // Fechar modal clicando fora
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                console.log('❌ Modal fechado clicando fora');
            }
        });
        
    }, 500);
});