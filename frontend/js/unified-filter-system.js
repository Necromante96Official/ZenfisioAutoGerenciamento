/**
 * UNIFIED-FILTER-SYSTEM.JS
 * Sistema unificado de aplicação de filtros
 * Processa filtros para Evoluções, Financeiro e Agendamentos
 */

class UnifiedFilterSystem {
    constructor() {
        this.activeFilters = {
            evolucoes: null,
            financeiro: null,
            agendamentos: null
        };
    }

    /**
     * Aplica filtros em Agendamentos
     * @param {Object} filters - Objeto com filtros
     */
    applyAgendamentosFilters(filters) {
        console.log('🔍 Aplicando filtros em Agendamentos:', filters);

        if (!window.schedulesIntegration || !window.schedulesIntegration.analyzer) {
            console.warn('⚠️ SchedulesIntegration não disponível');
            return;
        }

        const analyzer = window.schedulesIntegration.analyzer;
        
        // Obtém dados brutos salvos no dataManager (fonte da verdade)
        const savedData = window.dataManager?.getSchedules() || {};
        const todosAgendamentos = [...(savedData.faltaram || []), ...(savedData.compareceram || [])];

        console.log(`📊 Total de agendamentos antes do filtro: ${todosAgendamentos.length}`);

        // Aplica filtros
        let filtered = this._filterAgendamentos(todosAgendamentos, filters);

        console.log(`📊 Total após filtros: ${filtered.length}`);

        // Separa novamente em faltaram/compareceram
        const filteredFaltaram = filtered.filter(ag => {
            const status = ag.status?.toLowerCase().trim() || '';
            return status === 'não atendido' || status === 'não atendio' || status === 'faltou';
        });

        const filteredCompareceram = filtered.filter(ag => {
            const status = ag.status?.toLowerCase().trim() || '';
            return status !== 'não atendido' && status !== 'não atendio' && status !== 'faltou';
        });

        // Limpa analyzer e adiciona dados filtrados
        analyzer.limpar();
        filteredFaltaram.forEach(ag => analyzer.adicionarAgendamento(ag));
        filteredCompareceram.forEach(ag => analyzer.adicionarAgendamento(ag));

        // Re-renderiza UI
        window.schedulesIntegration.ui.render(analyzer.getDadosParaSalvar());

        // Salva filtro ativo
        this.activeFilters.agendamentos = filters;

        console.log('✅ Filtros aplicados com sucesso');
    }

    /**
     * Filtra agendamentos com base nos critérios
     * @private
     */
    _filterAgendamentos(agendamentos, filters) {
        return agendamentos.filter(ag => {
            // Filtro por dia/mes/ano específico
            if (filters.dia && ag.dia !== filters.dia) return false;
            if (filters.mes && ag.mes !== filters.mes) return false;
            if (filters.ano && ag.ano !== filters.ano) return false;

            // Filtro por intervalo de datas (dataInicio/dataFim)
            if (filters.dataInicio || filters.dataFim) {
                const agData = this._parseAgendamentoDate(ag);
                if (!agData) return false;

                if (filters.dataInicio) {
                    const inicio = new Date(filters.dataInicio);
                    if (agData < inicio) return false;
                }

                if (filters.dataFim) {
                    const fim = new Date(filters.dataFim);
                    fim.setHours(23, 59, 59, 999); // Inclui o dia inteiro
                    if (agData > fim) return false;
                }
            }

            // Filtro por status
            if (filters.status) {
                const agStatus = ag.status?.toLowerCase().trim() || '';
                if (filters.status === 'faltou') {
                    if (agStatus !== 'não atendido' && agStatus !== 'não atendio' && agStatus !== 'faltou') {
                        return false;
                    }
                } else if (filters.status === 'compareceu') {
                    if (agStatus === 'não atendido' || agStatus === 'não atendio' || agStatus === 'faltou') {
                        return false;
                    }
                }
            }

            // Filtro por fisioterapeuta (case-insensitive, partial match)
            if (filters.fisioterapeuta) {
                const fisio = ag.fisioterapeuta?.toLowerCase() || '';
                if (!fisio.includes(filters.fisioterapeuta.toLowerCase())) {
                    return false;
                }
            }

            // Filtro por paciente (case-insensitive, partial match)
            if (filters.paciente) {
                const paciente = ag.paciente?.toLowerCase() || '';
                if (!paciente.includes(filters.paciente.toLowerCase())) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Parse data do agendamento para comparação
     * @private
     */
    _parseAgendamentoDate(ag) {
        // Tenta dataSelecionada primeiro
        if (ag.dataSelecionada) {
            const parts = ag.dataSelecionada.split('/');
            if (parts.length === 3) {
                return new Date(parts[2], parts[1] - 1, parts[0]);
            }
        }

        // Tenta dia/mes/ano
        if (ag.dia && ag.mes && ag.ano) {
            return new Date(ag.ano, ag.mes - 1, ag.dia);
        }

        return null;
    }

    /**
     * Aplica filtros em Evoluções
     * @param {Object} filters - Objeto com filtros
     */
    applyEvolucoesFilters(filters) {
        console.log('🔍 Aplicando filtros em Evoluções:', filters);

        if (!window.evolucoesUI) {
            console.warn('⚠️ EvolucoesUI não disponível');
            return;
        }

        // Obtém dados originais do dataManager
        const allData = window.dataManager?.getEvolucoes() || [];
        console.log(`📊 Total de evoluções antes do filtro: ${allData.length}`);

        // Aplica filtros
        let filtered = this._filterEvolucoes(allData, filters);
        console.log(`📊 Total após filtros: ${filtered.length}`);

        // Re-renderiza UI com dados filtrados
        window.evolucoesUI.renderWithFilteredData(filtered);

        // Salva filtro ativo
        this.activeFilters.evolucoes = filters;

        console.log('✅ Filtros aplicados com sucesso');
    }

    /**
     * Filtra evoluções com base nos critérios
     * @private
     */
    _filterEvolucoes(evolucoes, filters) {
        return evolucoes.filter(ev => {
            // Filtro por dia/mes/ano
            if (filters.dia && ev.dia !== filters.dia) return false;
            if (filters.mes && ev.mes !== filters.mes) return false;
            if (filters.ano && ev.ano !== filters.ano) return false;

            // Filtro por paciente
            if (filters.paciente) {
                const paciente = ev.paciente?.toLowerCase() || '';
                if (!paciente.includes(filters.paciente.toLowerCase())) {
                    return false;
                }
            }

            // Filtro por fisioterapeuta
            if (filters.fisioterapeuta) {
                const fisio = ev.fisioterapeuta?.toLowerCase() || '';
                if (!fisio.includes(filters.fisioterapeuta.toLowerCase())) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Aplica filtros em Financeiro
     * @param {Object} filters - Objeto com filtros
     */
    applyFinanceiroFilters(filters) {
        console.log('🔍 Aplicando filtros em Financeiro:', filters);

        if (!window.financialIntegration) {
            console.warn('⚠️ FinancialIntegration não disponível');
            return;
        }

        // Obtém dados originais
        const allRecords = window.dataManager?.getFinanceiroRecords() || [];
        console.log(`📊 Total de registros financeiros antes do filtro: ${allRecords.length}`);

        // Aplica filtros
        let filtered = this._filterFinanceiro(allRecords, filters);
        console.log(`📊 Total após filtros: ${filtered.length}`);

        // Re-analisa dados filtrados
        if (window.financialIntegration.analyzer) {
            window.financialIntegration.analyzer.limpar();
            filtered.forEach(record => {
                window.financialIntegration.analyzer.adicionarAtendimento(record);
            });

            // Re-renderiza UI
            const analysisData = window.financialIntegration.analyzer.getAnalysis();
            window.financialIntegration.ui.render(analysisData);
        }

        // Salva filtro ativo
        this.activeFilters.financeiro = filters;

        console.log('✅ Filtros aplicados com sucesso');
    }

    /**
     * Filtra dados financeiros com base nos critérios
     * @private
     */
    _filterFinanceiro(records, filters) {
        return records.filter(record => {
            // Filtro por dia/mes/ano
            if (filters.dia && record.dia !== filters.dia) return false;
            if (filters.mes && record.mes !== filters.mes) return false;
            if (filters.ano && record.ano !== filters.ano) return false;

            // Filtro por faixa de valores
            if (filters.valorMin) {
                const valorMin = parseFloat(filters.valorMin);
                if (record.valor < valorMin) return false;
            }

            if (filters.valorMax) {
                const valorMax = parseFloat(filters.valorMax);
                if (record.valor > valorMax) return false;
            }

            // Filtro por profissional
            if (filters.profissional) {
                const prof = record.profissional?.toLowerCase() || '';
                if (!prof.includes(filters.profissional.toLowerCase())) {
                    return false;
                }
            }

            // Filtro por convênio
            if (filters.convenio) {
                const conv = record.convenio?.toLowerCase() || '';
                if (!conv.includes(filters.convenio.toLowerCase())) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Limpa filtros de um módulo e restaura dados completos
     * @param {string} module - 'evolucoes', 'financeiro' ou 'agendamentos'
     */
    clearFilters(module) {
        console.log(`🧹 Limpando filtros de ${module}`);

        this.activeFilters[module] = null;

        // Recarrega dados originais
        switch (module) {
            case 'agendamentos':
                if (window.schedulesIntegration) {
                    window.schedulesIntegration.reloadData();
                }
                break;

            case 'evolucoes':
                if (window.evolucoesUI) {
                    const allData = window.dataManager?.getEvolucoes() || [];
                    window.evolucoesUI.renderWithFilteredData(allData);
                }
                break;

            case 'financeiro':
                if (window.financialIntegration) {
                    window.financialIntegration.reloadData?.();
                }
                break;
        }

        console.log('✅ Filtros limpos');
    }

    /**
     * Retorna filtros ativos de um módulo
     */
    getActiveFilters(module) {
        return this.activeFilters[module];
    }

    /**
     * Verifica se há filtros ativos em um módulo
     */
    hasActiveFilters(module) {
        return this.activeFilters[module] !== null;
    }
}

// Instância global
window.unifiedFilterSystem = new UnifiedFilterSystem();

