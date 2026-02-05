// Script para gerenciar modal de agendamento de serviços
console.log('🔧 Modal-fix carregado');

// Aguardar o DOM estar pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM carregado no modal-fix');
    
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(function() {
        const cards = document.querySelectorAll('.card[data-servico]');
        const modal = document.getElementById('modalServico');
        
        console.log(`📋 Modal-fix encontrou ${cards.length} cards`);
        console.log('🎯 Modal encontrado:', !!modal);
        
        if (!modal) {
            console.error('❌ Modal não encontrado no DOM!');
            return;
        }
        
        // Dados dos serviços com IDs corretos do banco
        const servicosMock = {
            'Banho': { id: 1, nome: 'Banho', descricao: 'Banho completo com shampoo e condicionador', preco: 50.00, duracao: 60 },
            'Tosa': { id: 2, nome: 'Tosa', descricao: 'Tosa higiênica ou completa', preco: 80.00, duracao: 60 },
            'Hidratação': { id: 3, nome: 'Hidratação', descricao: 'Hidratação profunda do pelo', preco: 60.00, duracao: 60 },
            'Unhas': { id: 4, nome: 'Unhas', descricao: 'Corte e lixamento de unhas', preco: 30.00, duracao: 60 },
            'Escovação': { id: 5, nome: 'Escovação', descricao: 'Escovação e desembaraço', preco: 40.00, duracao: 60 },
            'Consulta': { id: 6, nome: 'Consulta', descricao: 'Consulta veterinária', preco: 120.00, duracao: 60 }
        };
        
        cards.forEach(function(card, index) {
            const btnSobre = card.querySelector('.btn-sobre');
            console.log(`🔘 Card ${index + 1} - Botão encontrado:`, !!btnSobre);
            
            if (btnSobre) {
                btnSobre.addEventListener('click', function() {
                    console.log('👆 Botão clicado!');
                    const nomeServico = card.dataset.servico;
                    console.log('🔍 Serviço:', nomeServico);
                    
                    const servico = servicosMock[nomeServico];
                    if (servico) {
                        console.log('✅ Serviço selecionado:', servico);
                        
                        // Preencher informações do modal
                        document.getElementById('modalTitulo').textContent = servico.nome;
                        document.getElementById('modalDescricao').textContent = servico.descricao;
                        document.getElementById('modalPreco').textContent = `Preço Base: R$ ${servico.preco.toFixed(2)}`;
                        document.getElementById('modalDuracao').textContent = `Duração: ${servico.duracao} minutos`;
                        
                        // Resetar seleções
                        document.getElementById('modalPorte').value = '';
                        document.getElementById('modalDataHora').value = '';
                        
                        // Mostrar modal
                        modal.style.display = 'block';
                        console.log('🎯 Modal exibido!');
                        
                        // Configurar botão de confirmação (remover listeners antigos)
                        const confirmarBtn = document.getElementById('confirmarAgendamento');
                        if (confirmarBtn) {
                            // Clonar e substituir para remover todos os event listeners
                            const novoBtn = confirmarBtn.cloneNode(true);
                            confirmarBtn.parentNode.replaceChild(novoBtn, confirmarBtn);
                            
                            novoBtn.addEventListener('click', async function() {
                                console.log('🔄 Processando agendamento...');
                                
                                const porteSelect = document.getElementById('modalPorte');
                                const dataHoraInput = document.getElementById('modalDataHora');
                                const porteSelecionado = porteSelect.value;
                                const dataHoraSelecionada = dataHoraInput.value;
                                
                                // Validar porte
                                if (!porteSelecionado) {
                                    alert('⚠️ Por favor, selecione o porte do cachorro!');
                                    console.warn('⚠️ Porte não selecionado');
                                    return;
                                }
                                
                                // Validar data/hora
                                if (!dataHoraSelecionada) {
                                    alert('⚠️ Por favor, selecione a data e hora do agendamento!');
                                    console.warn('⚠️ Data/hora não selecionada');
                                    return;
                                }
                                
                                // Verificar se usuário está logado
                                const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
                                if (!usuarioLogado) {
                                    alert('⚠️ Você precisa fazer login primeiro!');
                                    window.location.href = 'login.html';
                                    return;
                                }
                                
                                // Calcular adicional do porte
                                let adicionalPorte = 0;
                                if (porteSelecionado === 'medio') {
                                    adicionalPorte = 20.00;
                                } else if (porteSelecionado === 'grande') {
                                    adicionalPorte = 40.00;
                                }
                                
                                const total = servico.preco + adicionalPorte;
                                
                                console.log('📊 Detalhes do agendamento:', {
                                    servico: servico.nome,
                                    idServico: servico.id,
                                    porte: porteSelecionado,
                                    dataHora: dataHoraSelecionada,
                                    precoBase: servico.preco,
                                    adicionalPorte: adicionalPorte,
                                    total: total
                                });
                                
                                alert('⏳ Processando seu agendamento...');
                                
                                // Buscar dados do cliente
                                try {
                                    const cliente = await buscarCliente(usuarioLogado.id);
                                    if (!cliente) {
                                        alert('❌ Erro ao carregar dados do cliente.');
                                        return;
                                    }
                                    
                                    console.log('✅ Cliente encontrado:', cliente);
                                    
                                    // Criar agendamento
                                    const servicosSelecionados = [{
                                        id: servico.id,
                                        preco: total,
                                        duracaoMinutos: servico.duracao
                                    }];
                                    
                                    console.log('📝 Tentando criar agendamento com:', {
                                        clienteId: cliente.id,
                                        dataHora: dataHoraSelecionada,
                                        servicosSelecionados
                                    });
                                    
                                    const resultado = await criarAgendamento(
                                        cliente.id,
                                        dataHoraSelecionada,
                                        servicosSelecionados
                                    );
                                    
                                    if (resultado) {
                                        console.log('✅ Agendamento criado:', resultado);
                                        alert(`✅ Agendamento realizado com sucesso!\n\nServiço: ${servico.nome}\nPorte: ${porteSelecionado}\nTotal: R$ ${total.toFixed(2)}\n\nVocê será redirecionado para o seu perfil.`);
                                        modal.style.display = 'none';
                                        window.location.href = 'perfil.html';
                                    } else {
                                        console.error('❌ Resultado do agendamento é nulo');
                                        alert('❌ Erro ao realizar agendamento. Verifique as configurações de segurança do banco de dados (RLS).');
                                    }
                                } catch (error) {
                                    console.error('❌ Erro no agendamento:', error);
                                    if (error.message && error.message.includes('row-level security')) {
                                        alert('❌ Erro de permissão: O banco de dados está bloqueando a criação do agendamento.\n\nVerifique as políticas de segurança (RLS) na tabela "agendamento" no Supabase.');
                                    } else {
                                        alert('❌ Erro ao processar agendamento: ' + (error.message || 'Erro desconhecido'));
                                    }
                                }
                            });
                        }
                    } else {
                        console.error('❌ Serviço não encontrado:', nomeServico);
                        alert('❌ Serviço não encontrado. Tente novamente.');
                    }
                });
            }
        });
        
        // Configurar botão de fechar
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
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
        
        console.log('✅ Modal-fix configurado com sucesso!');
    }, 500);
});

console.log('✅ Modal-fix.js carregado completamente');