/**
 * EVOLUCOES-INTEGRATION.JS
 * Integra o sistema de evoluções com a interface existente
 */

class EvolucoesIntegration {
    constructor() {
        this.analyzer = new EvolucoesAnalyzer();
        this.ui = null;
        this.parser = new AgendamentoParser();
        this.init();
    }

    init() {
        // Aguarda DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Cria a UI
        this.ui = new EvolucoesUI(this.analyzer);

        // Carrega dados salvos
        this.loadSavedData();

        // Conecta os botões
        const processBtn = document.getElementById('processBtn');
        const clearBtn = document.getElementById('clearBtn');
        const textarea = document.getElementById('evolucaoTextarea');

        if (processBtn) {
            processBtn.addEventListener('click', () => this.processar());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.limpar());
        }

        // Enter em Ctrl+Enter para processar (opcional)
        if (textarea) {
            textarea.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    this.processar();
                }
            });
        }

        console.log('✅ Sistema de Evoluções integrado');
    }

    /**
     * Carrega dados de evoluções salvos ao iniciar
     */
    loadSavedData() {
        try {
            if (window.dataManager) {
                const savedEvolucoes = window.dataManager.getEvolucoes();
                
                if (Array.isArray(savedEvolucoes) && savedEvolucoes.length > 0) {
                    console.log(`✅ ${savedEvolucoes.length} evoluções encontradas. Carregando...`);
                    this.analyzer.evolucoes = savedEvolucoes;
                    this.analyzer._atualizarIndices();
                    this.ui.refresh();
                    console.log(`✅ Evoluções carregadas com sucesso`);
                }
            }
        } catch (error) {
            console.warn('Não foi possível carregar evoluções salvas:', error);
        }
    }

    processar() {
        const textarea = document.getElementById('evolucaoTextarea');

        if (!textarea) return;

        let content = textarea.value.trim();

        if (!content) {
            this.mostrarNotificacao('Campo de entrada vazio', 'warning');
            this.mostrarNotificacao('Cole os dados dos atendimentos', 'info');
            return;
        }

        // Limpa conteúdo (remove caracteres especiais)
        content = this.parser.limparConteudo(content);

        // Valida a entrada
        const validacao = this.parser.validar(content);
        if (!validacao.valido) {
            this.mostrarNotificacao('Validação falhou', 'error');
            this.mostrarNotificacao(validacao.erro, 'warning');
            return;
        }

        try {
            // Parse dos dados - AGORA SUPORTA MÚLTIPLAS MENSAGENS!
            const agendamentos = this.parser.parseMultiple(content);

            if (agendamentos.length === 0) {
                this.mostrarNotificacao('Nenhum agendamento válido encontrado', 'warning');
                this.mostrarNotificacao('Verifique se os campos obrigatórios estão preenchidos', 'info');
                return;
            }

            // Obtém a data do date manager
            if (window.dateManager) {
                const currentDate = window.dateManager.getDate();
                const dia = String(currentDate.getDate()).padStart(2, '0');
                const mes = String(currentDate.getMonth() + 1).padStart(2, '0');
                const ano = currentDate.getFullYear();

                // Adiciona a data do date picker a cada agendamento
                agendamentos.forEach(agendamento => {
                    agendamento.mes = parseInt(mes);
                    agendamento.ano = ano;
                    agendamento.dataProcessamento = `${dia}/${mes}/${ano}`;
                });
            }

            // NOVO: Separa dados por status para processamento dual-mode
            const comPresenca = agendamentos.filter(a => 
                a.status && a.status.toLowerCase().includes('presença confirmada')
            );
            const semPresenca = agendamentos.filter(a =>
                !a.status || !a.status.toLowerCase().includes('presença confirmada')
            );

            console.log(`📊 Separação por status:`);
            console.log(`  ✅ Com "Presença confirmada": ${comPresenca.length}`);
            console.log(`  💾 Com outros status: ${semPresenca.length}`);

            let resultadoEvolucoes = { sucesso: 0, ignoradas: 0 };
            let resultadoFinanceiro = 0;

            // ==========================================
            // PASSO 1: Processa registros com "Presença confirmada" em Evoluções
            // ==========================================
            if (comPresenca.length > 0) {
                resultadoEvolucoes = this.analyzer.processarMultiplas(comPresenca);
                
                // Salva em Evoluções
                try {
                    if (window.dataManager) {
                        window.dataManager.addEvolucoes(this.analyzer.getEvolucoes());
                    }
                } catch (saveError) {
                    console.warn('Aviso ao salvar evoluções:', saveError);
                }
            }

            // ==========================================
            // PASSO 2: Processa TODOS os dados em Análise Financeira
            // Inclui tanto "Presença confirmada" quanto outros status
            // ==========================================
            // Cria lista combinada de TODOS os registros para análise financeira
            const todosParaFinanceiro = [...comPresenca, ...semPresenca];
            
            if (todosParaFinanceiro.length > 0 && window.FinancialIntegration) {
                try {
                    // Cria um novo parser para processar apenas os registros novos
                    // sem acumular com dados anteriores
                    const newParser = new FinancialParser();
                    
                    // Adiciona registros com conversão correta de campos
                    // valorAtendimento é o campo do agendamento, valor é o do parser financeiro
                    todosParaFinanceiro.forEach(agendamento => {
                        // Cria registro com campos corretos do parser financeiro
                        const record = {
                            horario: agendamento.horario || '',
                            fisioterapeuta: agendamento.fisioterapeuta || '',
                            paciente: agendamento.paciente || '',
                            celular: agendamento.celular || '',
                            convenio: agendamento.convenio || '',
                            status: agendamento.status || '',
                            procedimentos: agendamento.procedimentos || '',
                            repetido: agendamento.repetido || '',
                            dataAtendimento: agendamento.periodo || '', // Campo correto
                            valor: agendamento.valorAtendimento || 0, // ✅ Converte campo de agendamento
                            dataProcessamento: agendamento.dataProcessamento || `${String(new Date().getDate()).padStart(2,'0')}/${String(new Date().getMonth()+1).padStart(2,'0')}/${new Date().getFullYear()}`,
                            mes: agendamento.mes || new Date().getMonth() + 1,
                            ano: agendamento.ano || new Date().getFullYear()
                        };
                        newParser.records.push(record);
                    });

                    console.log(`📊 ${todosParaFinanceiro.length} registros adicionados ao parser financeiro`);

                    // Processa análise com registros validados
                    const recordsValidados = newParser.getValidRecords();
                    console.log(`✅ ${recordsValidados.length} registros validados para análise financeira`);

                    if (recordsValidados.length > 0) {
                        const analyzer = new FinancialAnalyzer(recordsValidados);
                        const analysis = analyzer.analyze();

                        // Salva dados financeiros
                        try {
                            if (window.dataManager) {
                                window.dataManager.addFinanceiro(analysis, recordsValidados);
                            }
                        } catch (saveError) {
                            console.warn('Aviso ao salvar dados financeiros:', saveError);
                        }

                        // Renderiza na UI com registros validados
                        // Verifica se FinancialIntegration e sua UI estão inicializadas
                        if (window.FinancialIntegration && window.FinancialIntegration.ui) {
                            window.FinancialIntegration.ui.render(analysis, recordsValidados);
                            console.log(`✅ Análise Financeira renderizada com sucesso`);
                        } else {
                            // Se não estiver renderizado, tenta renderizar manualmente
                            const financialModule = document.getElementById('financeiro');
                            if (financialModule) {
                                // Cria UI se necessário
                                if (!window.FinancialIntegration) {
                                    window.FinancialIntegration = {};
                                }
                                if (!window.FinancialIntegration.ui) {
                                    window.FinancialIntegration.ui = new FinancialUI();
                                }
                                window.FinancialIntegration.ui.render(analysis, recordsValidados);
                                console.log(`✅ Análise Financeira renderizada com sucesso (inicialização automática)`);
                            } else {
                                console.warn('⚠️ Container #financeiro não encontrado para renderização');
                            }
                        }
                        resultadoFinanceiro = recordsValidados.length;
                    }
                } catch (errorFin) {
                    console.error('❌ Erro ao processar Análise Financeira:', errorFin);
                }
            }

            // Monta mensagens granulares (cada notificação com uma informação)
            
            // Se apenas evoluções foram processadas (sem dados de financeiro)
            if (resultadoEvolucoes.sucesso > 0 && resultadoFinanceiro === 0) {
                const plural = resultadoEvolucoes.sucesso !== 1 ? 's' : '';
                this.mostrarNotificacao(
                    `${resultadoEvolucoes.sucesso} atendimento${plural} com "Presença confirmada" adicionado${plural}`,
                    'success'
                );
                this.mostrarNotificacao(
                    `Dados salvos em Evoluções Pendentes`,
                    'info'
                );
            }
            // Se apenas financeiro foi processado (sem evoluções)
            else if (resultadoEvolucoes.sucesso === 0 && resultadoFinanceiro > 0) {
                const plural = resultadoFinanceiro !== 1 ? 's' : '';
                this.mostrarNotificacao(
                    `${resultadoFinanceiro} atendimento${plural} processado${plural} para Análise Financeira`,
                    'success'
                );
                this.mostrarNotificacao(
                    `Status diferente de "Presença confirmada"`,
                    'info'
                );
            }
            // Se ambos foram processados (evoluções + financeiro)
            else if (resultadoEvolucoes.sucesso > 0 && resultadoFinanceiro > 0) {
                const pluralEv = resultadoEvolucoes.sucesso !== 1 ? 's' : '';
                const pluralFin = resultadoFinanceiro !== 1 ? 's' : '';
                
                this.mostrarNotificacao(
                    `${resultadoEvolucoes.sucesso} evolução${pluralEv} adicionada${pluralEv} (com "Presença confirmada")`,
                    'success'
                );
                this.mostrarNotificacao(
                    `${resultadoFinanceiro} registro${pluralFin} enviado${pluralFin} para Análise Financeira`,
                    'success'
                );
                this.mostrarNotificacao(
                    `Processamento dual concluído: Evoluções + Financeiro`,
                    'info'
                );
            }
            // Se nada foi processado
            else {
                this.mostrarNotificacao('Nenhum registro foi processado', 'warning');
            }

            // Atualiza a UI
            this.ui.switchTab('visao-geral');
            this.ui.refresh();

            // Auto-limpa textarea após processar com sucesso
            textarea.value = '';

            // Log das estatísticas
            const stats = this.analyzer.getEstatisticas();
            console.log('📊 Estatísticas:', stats);

        } catch (erro) {
            console.error('Erro ao processar:', erro);
            this.mostrarNotificacao('Erro ao processar dados', 'error');
            this.mostrarNotificacao(erro.message, 'warning');
        }
    }

    limpar() {
        const textarea = document.getElementById('evolucaoTextarea');

        if (textarea) {
            textarea.value = '';
            textarea.focus();
        }

        this.analyzer.limpar();
        this.ui.refresh();

        this.mostrarNotificacao('Dados limpos com sucesso', 'info');
    }

    mostrarNotificacao(texto, tipo = 'info') {
        // Usa o sistema de notificações flutuante
        if (window.notify) {
            // Calcula duração baseada na tamanho do texto
            // Base: 3 segundos + 0.5s por 10 caracteres
            const duration = Math.max(3000, (texto.length / 10) * 500 + 3000);
            window.notify[tipo](texto, duration);
        } else {
            // Fallback apenas se o sistema não estiver disponível
            console.warn('Sistema de notificações não inicializado:', texto);
        }
    }

    /**
     * Exporta dados para análise financeira (futura integração)
     */
    exportarParaFinanceiro() {
        const dados = this.analyzer.exportarJSON();
        console.log('📊 Dados exportados para análise financeira');
        return dados;
    }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.evolucoesIntegration = new EvolucoesIntegration();
    });
} else {
    window.evolucoesIntegration = new EvolucoesIntegration();
}
