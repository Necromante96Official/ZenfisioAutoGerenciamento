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

        // Expõe a UI globalmente para outros módulos
        window.evolucoesUI = this.ui;

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
            
            console.log(`📋 PARSEADOS ${agendamentos.length} agendamentos`);
            agendamentos.forEach((a, i) => {
                console.log(`[${i+1}] ${a.paciente} - Status: "${a.status}" - Horário: ${a.horario}`);
            });

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
                    agendamento.dia = parseInt(dia);
                    agendamento.mes = parseInt(mes);
                    agendamento.ano = ano;
                    agendamento.dataProcessamento = `${dia}/${mes}/${ano}`;
                });
            }

            // NOVO: Separa dados por status para processamento dual-mode
            // APENAS "Presença confirmada" vai para Evoluções
            // "Presença confirmada" + "Atendido" vão para Análise Financeira
            // "Não atendido" + "Faltou" vão para Agendamentos
            const comPresenca = agendamentos.filter(a => {
                if (!a.status) return false;
                const statusLower = a.status.toLowerCase().trim();
                // APENAS "Presença confirmada"
                const match = statusLower.includes('presença confirmada');
                console.log(`   [PRESENÇA] "${a.status}" → ${match}`);
                return match;
            });

            const comAtendido = agendamentos.filter(a => {
                if (!a.status) return false;
                const statusLower = a.status.toLowerCase().trim();
                // APENAS "Atendido" (mas não "não atendido")
                const match = statusLower.includes('atendido') && !statusLower.includes('não');
                console.log(`   [ATENDIDO] "${a.status}" → ${match}`);
                return match;
            });

            const naoAtendidoOuFaltou = agendamentos.filter(a => {
                if (!a.status) return false;
                const statusLower = a.status.toLowerCase().trim();
                // "Não atendido", "não atendio" (typo), ou "Faltou"
                const isNaoAtendido = statusLower.includes('não atendid');  // Captura "não atendido" e "não atendio"
                const isFaltou = statusLower.includes('faltou');
                const match = isNaoAtendido || isFaltou;
                console.log(`   [NÃO ATENDIDO/FALTOU] "${a.status}" → isNaoAtendido: ${isNaoAtendido}, isFaltou: ${isFaltou} → ${match}`);
                return match;
            });

            const outros = agendamentos.filter(a => {
                if (!a.status) return true;
                const statusLower = a.status.toLowerCase().trim();
                // Outros status (Cancelado, etc) - não está em nenhuma das categorias acima
                const isPresenca = statusLower.includes('presença confirmada');
                const isAtendido = statusLower.includes('atendido') && !statusLower.includes('não');
                const isNaoAtendido = statusLower.includes('não atendid');
                const isFaltou = statusLower.includes('faltou');
                const match = !isPresenca && !isAtendido && !isNaoAtendido && !isFaltou;
                console.log(`   [OUTROS] "${a.status}" → ${match}`);
                return match;
            });

            console.log(`📊 Separação por status:`);
            console.log(`  ✅ Com "Presença confirmada" (Evoluções): ${comPresenca.length}`);
            console.log(`  ✅ Com "Atendido" (Financeiro): ${comAtendido.length}`);
            console.log(`  ❌ Com "Não atendido" ou "Faltou" (Agendamentos): ${naoAtendidoOuFaltou.length}`);
            console.log(`  ⚪ Outros status: ${outros.length}`);

            let resultadoEvolucoes = { sucesso: 0, ignoradas: 0 };
            let resultadoFinanceiro = 0;
            let resultadoAgendamentos = 0;

            // ==========================================
            // PASSO 1: Processa registros com "Presença confirmada" em Evoluções
            // ==========================================
            if (comPresenca.length > 0) {
                resultadoEvolucoes = this.analyzer.processarMultiplas(comPresenca);
                
                // 🔑 CRUCIAL: Recupera evoluções antigas para ACUMULAR (como em Financeiro)
                const evolucoesAntigos = window.dataManager?.getEvolucoes?.() || [];
                console.log(`📊 Evoluções antigas carregadas: ${evolucoesAntigos.length}`);
                
                // Combina evoluções antigas com novas (ACUMULAÇÃO)
                // Importante: passa os dados já combinados para evitar dupla acumulação
                const evolucoesCombinadas = [...evolucoesAntigos, ...comPresenca];
                console.log(`📊 Total de evoluções após acumular: ${evolucoesCombinadas.length}`);
                
                // Salva em Evoluções COM ACÚMULO
                try {
                    if (window.dataManager) {
                        // ✅ Passa dados JÁ COMBINADOS (antigos + novos)
                        // O dataManager NÃO vai acumular novamente, apenas substituir com dados combinados
                        window.dataManager.addEvolucoes(evolucoesCombinadas);
                        console.log(`✅ ${evolucoesCombinadas.length} evoluções salvas no dataManager (acumuladas)`);
                    }
                } catch (saveError) {
                    console.warn('Aviso ao salvar evoluções:', saveError);
                }
            }

            // ==========================================
            // PASSO 2: Processa dados em Análise Financeira
            // APENAS "Presença confirmada" + "Atendido"
            // ==========================================
            // Cria lista combinada apenas de registros financeiros válidos
            const paraFinanceiro = [...comPresenca, ...comAtendido];
            
            if (paraFinanceiro.length > 0 && window.financialIntegration) {
                try {
                    // Cria um novo parser para processar apenas os registros novos
                    // sem acumular com dados anteriores
                    const newParser = new FinancialParser();
                    
                    // Adiciona registros com conversão correta de campos
                    // valorAtendimento é o campo do agendamento, valor é o do parser financeiro
                    paraFinanceiro.forEach(agendamento => {
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

                    console.log(`📊 ${paraFinanceiro.length} registros adicionados ao parser financeiro`);

                    // Processa análise com registros validados
                    const recordsValidados = newParser.getValidRecords();
                    console.log(`✅ ${recordsValidados.length} registros validados para análise financeira`);

                    if (recordsValidados.length > 0) {
                        // 🔑 CRUCIAL: Recupera registros antigos para ACUMULAR
                        const registrosAntigos = window.dataManager?.getFinanceiroRecords?.() || [];
                        console.log(`📊 Registros financeiros antigos carregados: ${registrosAntigos.length}`);
                        
                        // Combina registros antigos com novos (ACUMULAÇÃO)
                        const registrosCombinados = [...registrosAntigos, ...recordsValidados];
                        console.log(`📊 Total de registros financeiros após acumular: ${registrosCombinados.length}`);
                        
                        const analyzer = new FinancialAnalyzer(registrosCombinados);
                        const analysis = analyzer.analyze();

                        // Salva dados financeiros
                        try {
                            if (window.dataManager) {
                                window.dataManager.addFinanceiro(analysis, registrosCombinados);
                            }
                        } catch (saveError) {
                            console.warn('Aviso ao salvar dados financeiros:', saveError);
                        }

                        // Renderiza na UI com registros validados
                        // Verifica se FinancialIntegration e sua UI estão inicializadas
                        if (window.financialIntegration && window.financialIntegration.ui) {
                            window.financialIntegration.ui.render(analysis, registrosCombinados);
                            console.log(`✅ Análise Financeira renderizada com sucesso`);
                        } else {
                            // Se não estiver renderizado, tenta renderizar manualmente
                            const financialModule = document.getElementById('financeiro');
                            if (financialModule) {
                                // Cria UI se necessário
                                if (!window.financialIntegration) {
                                    window.financialIntegration = {};
                                }
                                if (!window.financialIntegration.ui) {
                                    window.financialIntegration.ui = new FinancialUI();
                                }
                                window.financialIntegration.ui.render(analysis, registrosCombinados);
                                console.log(`✅ Análise Financeira renderizada com sucesso (inicialização automática)`);
                            } else {
                                console.warn('⚠️ Container #financeiro não encontrado para renderização');
                            }
                        }
                        resultadoFinanceiro = registrosCombinados.length;
                    }
                } catch (errorFin) {
                    console.error('❌ Erro ao processar Análise Financeira:', errorFin);
                }
            }

            // ==========================================
            // PASSO 3: Processa dados de Agendamentos
            // Lado esquerdo: "não atendido" e "faltou" (FALTAS)
            // Lado direito: Todos os outros status (compareceram/processados)
            // ==========================================
            try {
                if (window.schedulesIntegration) {
                    // Prepara dados para agendamentos
                    // LADO ESQUERDO (Faltaram): "não atendido" + "faltou"
                    // LADO DIREITO (Compareceram): "presença confirmada" + "atendido" + outros
                    const compareceram = [...comPresenca, ...comAtendido, ...outros];
                    
                    if (naoAtendidoOuFaltou.length > 0 || compareceram.length > 0) {
                        console.log(`📅 Processando para Agendamentos:`);
                        console.log(`   - Faltaram (lado esquerdo): ${naoAtendidoOuFaltou.length}`);
                        console.log(`   - Compareceram (lado direito): ${compareceram.length}`);
                        window.schedulesIntegration.processDataWithArray(naoAtendidoOuFaltou, compareceram, true); // Silent mode
                        console.log(`✅ Agendamentos processados`);
                        resultadoAgendamentos = naoAtendidoOuFaltou.length;
                    }
                }
            } catch (errorSchedules) {
                console.error('❌ Erro ao processar Agendamentos:', errorSchedules);
            }

            // Monta mensagens granulares (cada notificação com uma informação)
            
            // Se apenas evoluções foram processadas
            if (resultadoEvolucoes.sucesso > 0 && resultadoFinanceiro === 0 && resultadoAgendamentos === 0) {
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
            // Se processou múltiplos módulos
            else if (resultadoEvolucoes.sucesso > 0 || resultadoFinanceiro > 0 || resultadoAgendamentos > 0) {
                // Notifica cada módulo que foi processado
                if (resultadoEvolucoes.sucesso > 0) {
                    const plural = resultadoEvolucoes.sucesso !== 1 ? 's' : '';
                    this.mostrarNotificacao(
                        `${resultadoEvolucoes.sucesso} evolução${plural} adicionada${plural} (Presença confirmada)`,
                        'success'
                    );
                }
                
                if (resultadoFinanceiro > 0) {
                    const plural = resultadoFinanceiro !== 1 ? 's' : '';
                    this.mostrarNotificacao(
                        `${resultadoFinanceiro} registro${plural} enviado${plural} para Análise Financeira (Atendido)`,
                        'success'
                    );
                }
                
                if (resultadoAgendamentos > 0) {
                    const plural = resultadoAgendamentos !== 1 ? 's' : '';
                    this.mostrarNotificacao(
                        `${resultadoAgendamentos} falta${plural} registrada${plural} em Agendamentos`,
                        'success'
                    );
                }
                
                if (resultadoEvolucoes.sucesso > 0 || resultadoFinanceiro > 0 || resultadoAgendamentos > 0) {
                    this.mostrarNotificacao(
                        `Processamento concluído com sucesso`,
                        'info'
                    );
                }
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

    /**
     * Recarrega dados de evoluções do localStorage
     * Usado para refresh automático garantir que dados sempre estejam atualizados
     */
    reloadData() {
        try {
            console.log('🔄 EvolucoesIntegration: Recarregando dados...');
            this.loadSavedData();
            console.log('✅ EvolucoesIntegration: Dados recarregados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao recarregar dados de evoluções:', error);
        }
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
