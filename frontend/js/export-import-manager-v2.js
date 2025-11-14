/**
 * Export/Import Manager v2 - VERSÃO COMPLETA
 * Exporta TUDO de TODAS as páginas e abas
 * Suporta múltiplos formatos: JSON, TXT, MD
 */

class ExportImportManagerV2 {
    constructor() {
        this.exportFormats = ['json', 'txt', 'md'];
        this.init();
    }

    /**
     * Inicializa o sistema
     */
    init() {
        if (document.readyState === 'loading') {
            // DOM ainda está carregando
            document.addEventListener('DOMContentLoaded', () => {
                this.attachListeners();
            });
        } else {
            // DOM já está pronto
            setTimeout(() => {
                this.attachListeners();
            }, 100);
        }
    }

    /**
     * Attach listeners aos botões
     */
    attachListeners() {
        console.log('🔧 ExportImportManagerV2.attachListeners() chamado');
        
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const importInput = document.getElementById('importInput');

        console.log('� Procurando botões:');
        console.log(`  exportBtn: ${exportBtn ? '✅ encontrado' : '❌ NÃO ENCONTRADO'}`);
        console.log(`  importBtn: ${importBtn ? '✅ encontrado' : '❌ NÃO ENCONTRADO'}`);
        console.log(`  importInput: ${importInput ? '✅ encontrado' : '❌ NÃO ENCONTRADO'}`);

        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                console.log('📤 CLIQUE EM EXPORTAR DETECTADO', e);
                this.showExportDialog();
            });
            console.log('✅ Event listener de exportar adicionado');
        } else {
            console.warn('⚠️ Botão exportBtn não encontrado no DOM!');
        }

        if (importBtn) {
            importBtn.addEventListener('click', (e) => {
                console.log('📥 CLIQUE EM IMPORTAR DETECTADO', e);
                if (importInput) {
                    importInput.click();
                }
            });
            console.log('✅ Event listener de importar adicionado');
        } else {
            console.warn('⚠️ Botão importBtn não encontrado no DOM!');
        }

        if (importInput) {
            importInput.addEventListener('change', (e) => {
                console.log('📥 ARQUIVO SELECIONADO:', e.target.files?.[0]?.name);
                this.handleImport(e);
            });
            console.log('✅ Event listener de file input adicionado');
        }

        console.log('✅ System de Export/Import v2 listeners configurado');
    }

    /**
     * Coleta TODOS os dados de TODAS as páginas/abas
     */
    collectAllDataComprehensive() {
        console.log('🔍 Coletando dados de TODAS as páginas...');

        const completeData = {
            // ===== PÁGINA DE EVOLUÇÕES =====
            evolucoes: {
                // Dados brutos
                registros: window.dataManager?.getEvolucoes() || [],
                
                // Análise estruturada
                analiseGeral: this._safeGet(() => window.evolucoesIntegration?.analyzer?.getVisaoGeral?.() || {}),
                analiseEstatisticas: this._safeGet(() => window.evolucoesIntegration?.analyzer?.getEstatisticas?.() || {}),
                analisePacientes: this._safeGet(() => this._serializeMap(window.evolucoesIntegration?.analyzer?.pacientes)),
                analiseFisioterapeutas: this._safeGet(() => this._serializeMap(window.evolucoesIntegration?.analyzer?.fisioterapeutas)),
                cronologia: this._safeGet(() => window.evolucoesIntegration?.analyzer?.cronologia || []),
                
                // Filtros salvos (se houver)
                filtrosAtivos: this._safeGet(() => {
                    const filterSystem = window.filterSystemEvolucoes;
                    return filterSystem ? {
                        dia: filterSystem.filters?.dia,
                        mes: filterSystem.filters?.mes,
                        ano: filterSystem.filters?.ano,
                        paciente: filterSystem.filters?.paciente,
                        fisioterapeuta: filterSystem.filters?.fisioterapeuta,
                        procedimentos: filterSystem.filters?.procedimentos,
                        convenio: filterSystem.filters?.convenio
                    } : null;
                })
            },

            // ===== PÁGINA DE ANÁLISE FINANCEIRA =====
            financeiro: {
                // Dados brutos
                records: window.dataManager?.getFinanceiroRecords() || [],
                
                // Análise estruturada completa
                resumo: this._safeGet(() => window.dataManager?.getFinanceiro()?.summary || {}),
                porData: this._safeGet(() => window.dataManager?.getFinanceiro()?.byDate || {}),
                porEspecialidade: this._safeGet(() => window.dataManager?.getFinanceiro()?.bySpecialty || {}),
                porProfissional: this._safeGet(() => window.dataManager?.getFinanceiro()?.byProfessional || {}),
                porPaciente: this._safeGet(() => window.dataManager?.getFinanceiro()?.byPatient || {}),
                
                // Filtros salvos (se houver)
                filtrosAtivos: this._safeGet(() => {
                    const filterSystem = window.filterSystemFinanceiro;
                    return filterSystem ? {
                        dia: filterSystem.filters?.dia,
                        mes: filterSystem.filters?.mes,
                        ano: filterSystem.filters?.ano,
                        paciente: filterSystem.filters?.paciente,
                        fisioterapeuta: filterSystem.filters?.fisioterapeuta,
                        procedimentos: filterSystem.filters?.procedimentos,
                        convenio: filterSystem.filters?.convenio
                    } : null;
                })
            },

            // ===== PÁGINA DE AGENDAMENTOS =====
            agendamentos: {
                // Dados brutos
                dadosCompletos: window.dataManager?.getSchedules() || {},
                
                // Dados organizados
                compareceram: this._safeGet(() => window.schedulesIntegration?.analyzer?.compareceram || []),
                faltaram: this._safeGet(() => window.schedulesIntegration?.analyzer?.faltaram || []),
                
                // Análise estruturada
                resumo: this._safeGet(() => window.schedulesIntegration?.analyzer?.getResumo() || {}),
                estatisticasPorFisio: this._safeGet(() => window.schedulesIntegration?.analyzer?.getEstatisticasPorFisio() || []),
                estatisticasPorConvenio: this._safeGet(() => window.schedulesIntegration?.analyzer?.getEstatisticasPorConvenio() || []),
                pacientesUnicosFaltaram: this._safeGet(() => window.schedulesIntegration?.analyzer?.getPacientesUnicosFaltaram() || []),
                
                // Data de referência
                dataReferencia: this._safeGet(() => window.schedulesIntegration?.analyzer?.data || 'Não informada'),
                
                // Totalizadores
                totais: {
                    compareceram: this._safeGet(() => window.schedulesIntegration?.analyzer?.compareceram?.length || 0),
                    faltaram: this._safeGet(() => window.schedulesIntegration?.analyzer?.faltaram?.length || 0),
                    total: this._safeGet(() => (window.schedulesIntegration?.analyzer?.compareceram?.length || 0) + (window.schedulesIntegration?.analyzer?.faltaram?.length || 0))
                }
            },

            // ===== METADADOS =====
            metadata: {
                versao: window.SYSTEM_INFO?.version || '2.0.0.1',
                sistema: window.SYSTEM_INFO?.name || 'Zenfisio Auto Gerenciamento',
                desenvolvedor: window.SYSTEM_INFO?.developer?.name || 'Desconhecido',
                diretora: window.SYSTEM_INFO?.director?.name || 'Não informada',
                instituicao: window.SYSTEM_INFO?.institution?.name || 'Zenfisio',
                universidade: window.SYSTEM_INFO?.university?.name || 'Não informada',
                dataExportacao: new Date().toISOString(),
                dataFormatada: new Date().toLocaleDateString('pt-BR'),
                horarioFormatado: new Date().toLocaleTimeString('pt-BR'),
                usuario: 'Clinica Zenfisio',
                userAgent: navigator.userAgent,
                resolucao: `${window.innerWidth}x${window.innerHeight}`,
                navegador: this._getBrowserInfo(),
                copyright: window.SYSTEM_INFO?.copyright || '© 2025 Zenfisio. Todos os direitos reservados.'
            },

            // ===== RESUMO PARA VALIDAÇÃO =====
            resumo: {
                evolucoes: {
                    total: window.dataManager?.getEvolucoes()?.length || 0,
                    pacientes: this._safeGet(() => window.evolucoesIntegration?.analyzer?.pacientes?.size || 0),
                    fisioterapeutas: this._safeGet(() => window.evolucoesIntegration?.analyzer?.fisioterapeutas?.size || 0)
                },
                financeiro: {
                    totalRecords: window.dataManager?.getFinanceiroRecords()?.length || 0,
                    totalAtendimentos: this._safeGet(() => window.dataManager?.getFinanceiro()?.summary?.totalAtendimentos || 0),
                    totalReceitaBruta: this._safeGet(() => window.dataManager?.getFinanceiro()?.summary?.receitaBruta || '0.00'),
                    totalReceitaLiquida: this._safeGet(() => window.dataManager?.getFinanceiro()?.summary?.receitaLiquida || '0.00'),
                    receitaTotal: this._safeGet(() => window.dataManager?.getFinanceiro()?.summary?.receitaTotal || '0.00'),
                    pacientesUnicos: this._safeGet(() => window.dataManager?.getFinanceiro()?.summary?.pacientesUnicos || 0)
                },
                agendamentos: {
                    totalCompareceram: this._safeGet(() => window.schedulesIntegration?.analyzer?.compareceram?.length || 0),
                    totalFaltaram: this._safeGet(() => window.schedulesIntegration?.analyzer?.faltaram?.length || 0),
                    totalAgendamentos: this._safeGet(() => (window.schedulesIntegration?.analyzer?.compareceram?.length || 0) + (window.schedulesIntegration?.analyzer?.faltaram?.length || 0)),
                    dataReferencia: this._safeGet(() => window.schedulesIntegration?.analyzer?.data || 'Não informada'),
                    taxaFalta: this._safeGet(() => window.schedulesIntegration?.analyzer?.getResumo()?.taxaFalta || '0')
                },
                dataUltimoSalva: window.dataManager?.getLastSaveTime() || new Date().toISOString()
            }
        };

        console.log('✅ Coleta de dados concluída');
        console.log('📊 Resumo:', completeData.resumo);

        return completeData;
    }

    /**
     * Converte Map para Object para JSON
     */
    _serializeMap(map) {
        const obj = {};
        if (map && map.forEach) {
            map.forEach((value, key) => {
                // Tenta serializar recursivamente
                obj[key] = this._serializeValue(value);
            });
        }
        return obj;
    }

    /**
     * Serializa valores recursivamente
     */
    _serializeValue(value) {
        if (value === null || value === undefined) return value;
        if (typeof value !== 'object') return value;
        if (value instanceof Date) return value.toISOString();
        if (value instanceof Map) return this._serializeMap(value);
        if (Array.isArray(value)) return value.map(v => this._serializeValue(v));
        
        // Para objetos
        const obj = {};
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                obj[key] = this._serializeValue(value[key]);
            }
        }
        return obj;
    }

    /**
     * Executa função com segurança (try-catch)
     */
    _safeGet(fn) {
        try {
            return fn();
        } catch (e) {
            console.warn('⚠️ Erro ao coletar dados:', e.message);
            return null;
        }
    }

    /**
     * Retorna informação do navegador
     */
    _getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.indexOf('Chrome') > -1) return 'Chrome';
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('Safari') > -1) return 'Safari';
        if (ua.indexOf('Edge') > -1) return 'Edge';
        return 'Desconhecido';
    }

    /**
     * Mostra diálogo de exportação com opções de formato
     */
    showExportDialog() {
        // Remove diálogo anterior se existir
        const existing = document.getElementById('export-format-modal');
        if (existing) existing.remove();

        const html = `
            <div id="export-format-modal" class="export-modal-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                animation: fadeIn 0.3s ease-out;
            ">
                <div class="export-modal" style="
                    background: var(--bg-primary);
                    border-radius: 12px;
                    padding: 30px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    animation: slideInUp 0.3s ease-out;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="margin: 0; color: var(--text-primary);">📥 Escolha o Formato</h2>
                        <button id="close-export-modal" style="
                            background: none;
                            border: none;
                            font-size: 24px;
                            cursor: pointer;
                            color: var(--text-secondary);
                        ">✕</button>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="export-format-btn" data-format="json" style="
                            padding: 12px;
                            border: 2px solid var(--accent-primary);
                            background: var(--bg-secondary);
                            color: var(--text-primary);
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: all 0.2s;
                        ">
                            📄 JSON (Recomendado)
                        </button>
                        <button class="export-format-btn" data-format="txt" style="
                            padding: 12px;
                            border: 2px solid var(--accent-secondary);
                            background: var(--bg-secondary);
                            color: var(--text-primary);
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: all 0.2s;
                        ">
                            📝 TXT (Legível)
                        </button>
                        <button class="export-format-btn" data-format="md" style="
                            padding: 12px;
                            border: 2px solid var(--accent-tertiary);
                            background: var(--bg-secondary);
                            color: var(--text-primary);
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: all 0.2s;
                        ">
                            🔗 Markdown (Documentação)
                        </button>
                    </div>

                    <div style="
                        margin-top: 20px;
                        padding: 12px;
                        background: var(--bg-tertiary);
                        border-radius: 6px;
                        font-size: 12px;
                        color: var(--text-secondary);
                    ">
                        <strong>ℹ️ Formatos:</strong><br>
                        • JSON: Para importação posterior (estruturado)<br>
                        • TXT: Para leitura em qualquer editor<br>
                        • Markdown: Para relatórios profissionais
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        // Adiciona listeners aos botões de formato
        document.querySelectorAll('.export-format-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.closest('button').getAttribute('data-format');
                document.getElementById('export-format-modal').remove();
                this.handleExport(format);
            });

            // Hover effect
            btn.addEventListener('mouseover', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            });
            btn.addEventListener('mouseout', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            });
        });

        // Fechar ao clicar no X ou fora do modal
        document.getElementById('close-export-modal').addEventListener('click', () => {
            document.getElementById('export-format-modal').remove();
        });

        document.getElementById('export-format-modal').addEventListener('click', (e) => {
            if (e.target.id === 'export-format-modal') {
                document.getElementById('export-format-modal').remove();
            }
        });

        // Adiciona animações se não existirem
        if (!document.getElementById('export-animations')) {
            const style = document.createElement('style');
            style.id = 'export-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Formata dados para TXT legível
     */
    formatToTxt(allData) {
        let txt = '';
        
        txt += '╔' + '═'.repeat(78) + '╗\n';
        txt += '║' + ' '.repeat(20) + '🏥 ' + allData.metadata.sistema.toUpperCase() + ' '.repeat(78 - 23 - allData.metadata.sistema.length) + '║\n';
        txt += '║' + ' '.repeat(24) + 'v' + allData.metadata.versao + ' '.repeat(78 - 25 - allData.metadata.versao.length) + '║\n';
        txt += '║' + ' '.repeat(25) + 'RELATÓRIO COMPLETO' + ' '.repeat(78 - 43) + '║\n';
        txt += '╠' + '═'.repeat(78) + '╣\n';
        txt += '║' + ' '.repeat(78) + '║\n';
        txt += '║  👨‍💻 DESENVOLVEDOR' + ' '.repeat(57) + '║\n';
        txt += '║     ' + allData.metadata.desenvolvedor + ' '.repeat(78 - 5 - allData.metadata.desenvolvedor.length) + '║\n';
        txt += '║' + ' '.repeat(78) + '║\n';
        txt += '║  👩‍💼 DIRETORA' + ' '.repeat(64) + '║\n';
        txt += '║     ' + allData.metadata.diretora + ' '.repeat(78 - 5 - allData.metadata.diretora.length) + '║\n';
        txt += '║' + ' '.repeat(78) + '║\n';
        txt += '║  🏢 INSTITUIÇÃO' + ' '.repeat(60) + '║\n';
        txt += '║     ' + allData.metadata.instituicao + ' '.repeat(78 - 5 - allData.metadata.instituicao.length) + '║\n';
        txt += '║' + ' '.repeat(78) + '║\n';
        txt += '║  🎓 UNIVERSIDADE' + ' '.repeat(59) + '║\n';
        txt += '║     ' + allData.metadata.universidade + ' '.repeat(78 - 5 - allData.metadata.universidade.length) + '║\n';
        txt += '║' + ' '.repeat(78) + '║\n';
        txt += '║  © ' + allData.metadata.copyright + ' '.repeat(78 - 4 - allData.metadata.copyright.length) + '║\n';
        txt += '║' + ' '.repeat(78) + '║\n';
        txt += '╚' + '═'.repeat(78) + '╝\n\n';

        // Metadados
        txt += '📋 METADADOS DO BACKUP\n';
        txt += '─'.repeat(80) + '\n';
        txt += `Versão do Sistema: ${allData.metadata.versao}\n`;
        txt += `Data do Backup: ${allData.metadata.dataFormatada}\n`;
        txt += `Hora do Backup: ${allData.metadata.horarioFormatado}\n`;
        txt += `Navegador: ${allData.metadata.navegador}\n`;
        txt += `Resolução da Tela: ${allData.metadata.resolucao}\n\n`;

        // Resumo Evoluções
        txt += '📈 EVOLUÇÕES - RESUMO\n';
        txt += '─'.repeat(80) + '\n';
        txt += `Total de Registros: ${allData.resumo.evolucoes.total}\n`;
        txt += `Pacientes Únicos: ${allData.resumo.evolucoes.pacientes}\n`;
        txt += `Fisioterapeutas: ${allData.resumo.evolucoes.fisioterapeutas}\n\n`;

        // Detalhes Evoluções
        if (allData.evolucoes.registros.length > 0) {
            txt += '📝 EVOLUÇÕES - DETALHES\n';
            txt += '─'.repeat(80) + '\n';
            allData.evolucoes.registros.forEach((evo, idx) => {
                txt += `\n[${idx + 1}] ${evo.paciente}\n`;
                txt += `    Horário: ${evo.horario}\n`;
                txt += `    Fisioterapeuta: ${evo.fisioterapeuta}\n`;
                txt += `    Procedimentos: ${evo.procedimentos}\n`;
                txt += `    Convênio: ${evo.convenio || 'Particular'}\n`;
                txt += `    Período: ${evo.periodo}\n`;
                txt += `    Data: ${evo.dataProcessamento}\n`;
            });
            txt += '\n';
        }

        // Resumo Financeiro
        txt += '💰 FINANCEIRO - RESUMO\n';
        txt += '─'.repeat(80) + '\n';
        txt += `Total de Atendimentos: ${allData.resumo.financeiro.totalAtendimentos}\n`;
        txt += `Pacientes Únicos: ${allData.resumo.financeiro.pacientesUnicos}\n`;
        txt += `Receita Bruta: R$ ${allData.resumo.financeiro.totalReceitaBruta}\n`;
        txt += `Receita Líquida: R$ ${allData.resumo.financeiro.totalReceitaLiquida}\n`;
        txt += `Receita Total: R$ ${allData.resumo.financeiro.receitaTotal}\n\n`;

        // Detalhes Financeiro
        if (Object.keys(allData.financeiro.resumo).length > 0) {
            txt += '💵 FINANCEIRO - DETALHES\n';
            txt += '─'.repeat(80) + '\n';
            txt += JSON.stringify(allData.financeiro.resumo, null, 2) + '\n\n';
        }

        // Por Data
        if (Object.keys(allData.financeiro.porData).length > 0) {
            txt += '📅 FINANCEIRO - POR DATA\n';
            txt += '─'.repeat(80) + '\n';
            txt += JSON.stringify(allData.financeiro.porData, null, 2) + '\n\n';
        }

        // Resumo Agendamentos
        txt += '📋 AGENDAMENTOS - RESUMO\n';
        txt += '─'.repeat(80) + '\n';
        txt += `Total de Agendamentos: ${allData.resumo.agendamentos.totalAgendamentos}\n`;
        txt += `Compareceram: ${allData.resumo.agendamentos.totalCompareceram}\n`;
        txt += `Faltaram: ${allData.resumo.agendamentos.totalFaltaram}\n`;
        txt += `Taxa de Faltas: ${allData.resumo.agendamentos.taxaFalta}%\n`;
        txt += `Data de Referência: ${allData.resumo.agendamentos.dataReferencia}\n\n`;

        // Detalhes Agendamentos - Compareceram
        if (allData.agendamentos.compareceram.length > 0) {
            txt += '✅ AGENDAMENTOS - COMPARECERAM\n';
            txt += '─'.repeat(80) + '\n';
            allData.agendamentos.compareceram.forEach((ag, idx) => {
                txt += `\n[${idx + 1}] ${ag.paciente}\n`;
                txt += `    Horário: ${ag.horario}\n`;
                txt += `    Fisioterapeuta: ${ag.fisioterapeuta}\n`;
                txt += `    Status: ${ag.status}\n`;
                txt += `    Convênio: ${ag.convenio || 'Não informado'}\n`;
            });
            txt += '\n';
        }

        // Detalhes Agendamentos - Faltaram
        if (allData.agendamentos.faltaram.length > 0) {
            txt += '❌ AGENDAMENTOS - FALTARAM\n';
            txt += '─'.repeat(80) + '\n';
            allData.agendamentos.faltaram.forEach((ag, idx) => {
                txt += `\n[${idx + 1}] ${ag.paciente}\n`;
                txt += `    Horário: ${ag.horario}\n`;
                txt += `    Fisioterapeuta: ${ag.fisioterapeuta}\n`;
                txt += `    Status: ${ag.status}\n`;
                txt += `    Convênio: ${ag.convenio || 'Não informado'}\n`;
                txt += `    Celular: ${ag.celular || 'Não informado'}\n`;
            });
            txt += '\n';
        }

        txt += '═'.repeat(80) + '\n';
        txt += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;

        return txt;
    }

    /**
     * Formata dados para Markdown
     */
    formatToMd(allData) {
        let md = '';

        md += '---\n';
        md += 'layout: report\n';
        md += 'title: Relatório de Backup Zenfisio\n';
        md += `version: ${allData.metadata.versao}\n`;
        md += `date: ${allData.metadata.dataFormatada}\n`;
        md += '---\n\n';

        md += '# 🏥 ' + allData.metadata.sistema + ' - v' + allData.metadata.versao + '\n\n';
        md += 'Relatório Completo de Backup do Sistema\n\n';
        
        md += '## 📋 Informações Profissionais\n\n';
        md += `| Informação | Detalhes |\n`;
        md += `|-----------|----------|\n`;
        md += `| **Sistema** | ${allData.metadata.sistema} |\n`;
        md += `| **Versão** | ${allData.metadata.versao} |\n`;
        md += `| **Desenvolvedor** | ${allData.metadata.desenvolvedor} |\n`;
        md += `| **Diretora** | ${allData.metadata.diretora} |\n`;
        md += `| **Instituição** | ${allData.metadata.instituicao} |\n`;
        md += `| **Universidade** | ${allData.metadata.universidade} |\n\n`;

        md += '---\n\n';

        md += '## 📚 Informações do Backup\n\n';
        md += `- **Data de Backup**: ${allData.metadata.dataFormatada}\n`;
        md += `- **Hora de Backup**: ${allData.metadata.horarioFormatado}\n`;
        md += `- **Navegador Utilizado**: ${allData.metadata.navegador}\n`;
        md += `- **Resolução**: ${allData.metadata.resolucao}\n`;
        md += `- **Copyright**: ${allData.metadata.copyright}\n\n`;

        md += '---\n\n';

        md += '## 📈 Resumo de Evoluções\n\n';
        md += `| Métrica | Valor |\n`;
        md += `|--------|-------|\n`;
        md += `| Total de Registros | ${allData.resumo.evolucoes.total} |\n`;
        md += `| Pacientes Únicos | ${allData.resumo.evolucoes.pacientes} |\n`;
        md += `| Fisioterapeutas | ${allData.resumo.evolucoes.fisioterapeutas} |\n\n`;

        if (allData.evolucoes.registros.length > 0) {
            md += '## 📝 Detalhes de Evoluções\n\n';
            allData.evolucoes.registros.forEach((evo, idx) => {
                md += `### ${idx + 1}. ${evo.paciente}\n\n`;
                md += `- **Horário**: ${evo.horario}\n`;
                md += `- **Fisioterapeuta**: ${evo.fisioterapeuta}\n`;
                md += `- **Procedimentos**: ${evo.procedimentos}\n`;
                md += `- **Convênio**: ${evo.convenio || 'Particular'}\n`;
                md += `- **Período**: ${evo.periodo}\n`;
                md += `- **Data**: ${evo.dataProcessamento}\n\n`;
            });
        }

        md += '## 💰 Resumo Financeiro\n\n';
        md += `| Métrica | Valor |\n`;
        md += `|--------|-------|\n`;
        md += `| Total de Atendimentos | ${allData.resumo.financeiro.totalAtendimentos} |\n`;
        md += `| Pacientes Únicos | ${allData.resumo.financeiro.pacientesUnicos} |\n`;
        md += `| Receita Bruta | R$ ${allData.resumo.financeiro.totalReceitaBruta} |\n`;
        md += `| Receita Líquida | R$ ${allData.resumo.financeiro.totalReceitaLiquida} |\n`;
        md += `| Receita Total | R$ ${allData.resumo.financeiro.receitaTotal} |\n\n`;

        md += '## 📋 Resumo de Agendamentos\n\n';
        md += `| Métrica | Valor |\n`;
        md += `|--------|-------|\n`;
        md += `| Total de Agendamentos | ${allData.resumo.agendamentos.totalAgendamentos} |\n`;
        md += `| Compareceram | ${allData.resumo.agendamentos.totalCompareceram} |\n`;
        md += `| Faltaram | ${allData.resumo.agendamentos.totalFaltaram} |\n`;
        md += `| Taxa de Faltas | ${allData.resumo.agendamentos.taxaFalta}% |\n`;
        md += `| Data de Referência | ${allData.resumo.agendamentos.dataReferencia} |\n\n`;

        if (allData.agendamentos.compareceram.length > 0) {
            md += '### ✅ Pacientes que Compareceram\n\n';
            allData.agendamentos.compareceram.forEach((ag, idx) => {
                md += `${idx + 1}. **${ag.paciente}** - ${ag.horario} (${ag.fisioterapeuta})\n`;
            });
            md += '\n';
        }

        if (allData.agendamentos.faltaram.length > 0) {
            md += '### ❌ Pacientes que Faltaram\n\n';
            allData.agendamentos.faltaram.forEach((ag, idx) => {
                md += `${idx + 1}. **${ag.paciente}** - ${ag.horario} (${ag.fisioterapeuta}) - Tel: ${ag.celular || 'N/A'}\n`;
            });
            md += '\n';
        }

        md += '---\n\n';
        md += `*Backup gerado em ${new Date().toLocaleString('pt-BR')}*\n`;

        return md;
    }

    /**
     * Handle export - Exporta em formato selecionado
     */
    handleExport(format = 'json') {
        try {
            console.log(`📤 Iniciando exportação em formato: ${format.toUpperCase()}`);

            if (!window.dataManager) {
                this.showNotification('Gerenciador de dados não disponível', 'error');
                return;
            }

            // Coleta todos os dados
            const allData = this.collectAllDataComprehensive();

            // Logs detalhados
            console.log('📊 DADOS COLETADOS:');
            console.log(`   ✅ Evoluções: ${allData.resumo.evolucoes.total} registros`);
            console.log(`   ✅ Financeiro: ${allData.resumo.financeiro.totalRecords} records / ${allData.resumo.financeiro.totalAtendimentos} atendimentos`);
            console.log(`   ✅ Agendamentos: ${allData.resumo.agendamentos.totalAgendamentos} registros (${allData.resumo.agendamentos.totalCompareceram} compareceram, ${allData.resumo.agendamentos.totalFaltaram} faltaram)`);

            // Valida se há dados
            const temEvol = allData.resumo.evolucoes.total > 0;
            const temFin = allData.resumo.financeiro.totalAtendimentos > 0;
            const temAgend = allData.resumo.agendamentos.totalAgendamentos > 0;

            console.log(`📋 Validação: Evoluções=${temEvol}, Financeiro=${temFin}, Agendamentos=${temAgend}`);

            if (!temEvol && !temFin && !temAgend) {
                this.showNotification('Nenhum dado para exportar', 'warning');
                return;
            }

            let content, mimeType, filename;

            // Processa formato
            switch (format) {
                case 'json':
                    content = JSON.stringify(allData, null, 2);
                    mimeType = 'application/json';
                    filename = `zenfisio_backup_${this._getTimestamp()}.json`;
                    break;

                case 'txt':
                    content = this.formatToTxt(allData);
                    mimeType = 'text/plain;charset=utf-8';
                    filename = `zenfisio_backup_${this._getTimestamp()}.txt`;
                    break;

                case 'md':
                    content = this.formatToMd(allData);
                    mimeType = 'text/markdown;charset=utf-8';
                    filename = `zenfisio_backup_${this._getTimestamp()}.md`;
                    break;

                default:
                    throw new Error(`Formato desconhecido: ${format}`);
            }

            // Download
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`✅ Download iniciado: ${filename}`);
            console.log(`   Tamanho: ${(blob.size / 1024).toFixed(2)} KB`);

            // Notificações com detalhes
            this.showNotification(`✅ Backup exportado com sucesso!`, 'success', 3000);
            this.showNotification(`📊 ${allData.resumo.evolucoes.total} evoluções exportadas`, 'info', 2500);
            this.showNotification(`💰 ${allData.resumo.financeiro.totalAtendimentos} atendimentos financeiros exportados`, 'info', 2500);
            this.showNotification(`📋 ${allData.resumo.agendamentos.totalAgendamentos} agendamentos exportados`, 'info', 2500);
            this.showNotification(`📁 Arquivo: ${filename}`, 'info', 3000);
            this.showNotification(`💾 Tamanho: ${(blob.size / 1024).toFixed(2)} KB`, 'info', 2000);

        } catch (error) {
            console.error('❌ Erro ao exportar:', error);
            this.showNotification('Erro ao exportar', 'error');
            this.showNotification(error.message, 'warning', 4000);
        }
    }

    /**
     * Handle import - Restaura dados de arquivo
     */
    handleImport(event) {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            console.log(`📥 Importando: ${file.name}`);

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result;
                    
                    if (!window.dataManager) {
                        this.showNotification('Gerenciador não disponível', 'error');
                        return;
                    }

                    // Parse JSON
                    const importedData = JSON.parse(content);

                    // Validação
                    if (!importedData.metadata?.versao) {
                        throw new Error('Arquivo não é um backup válido');
                    }

                    console.log(`✅ Arquivo validado - Versão: ${importedData.metadata.versao}`);
                    console.log('📊 DADOS A IMPORTAR:');

                    let contEvol = 0, contFin = 0, contAgend = 0;

                    // Restaura evoluções
                    if (importedData.evolucoes?.registros?.length > 0) {
                        contEvol = importedData.evolucoes.registros.length;
                        window.dataManager.addEvolucoes(importedData.evolucoes.registros);
                        console.log(`   ✅ ${contEvol} evoluções restauradas`);

                        // Recarrega na interface
                        if (window.evolucoesIntegration?.analyzer) {
                            window.evolucoesIntegration.analyzer.evolucoes = importedData.evolucoes.registros;
                            window.evolucoesIntegration.analyzer._atualizarIndices();
                            window.evolucoesIntegration.ui?.render?.();
                        }
                    }

                    // Restaura financeiro
                    if (importedData.financeiro?.records?.length > 0) {
                        contFin = importedData.financeiro.records.length;
                        const records = importedData.financeiro.records;
                        const analysis = {
                            summary: importedData.financeiro.resumo,
                            byDate: importedData.financeiro.porData,
                            bySpecialty: importedData.financeiro.porEspecialidade,
                            byProfessional: importedData.financeiro.porProfissional,
                            byPatient: importedData.financeiro.porPaciente
                        };

                        window.dataManager.addFinanceiro(analysis, records);
                        console.log(`   ✅ ${contFin} registros financeiros restaurados`);

                        // Recarrega na interface
                        if (window.financialIntegration?.ui) {
                            window.financialIntegration.ui.render(analysis, records);
                        }
                    }

                    // Restaura agendamentos
                    if (importedData.agendamentos?.dadosCompletos) {
                        const schedulesData = importedData.agendamentos.dadosCompletos;
                        contAgend = (schedulesData.compareceram?.length || 0) + (schedulesData.faltaram?.length || 0);
                        window.dataManager.addSchedules(schedulesData);
                        console.log(`   ✅ ${contAgend} agendamentos restaurados`);

                        // Recarrega na interface
                        if (window.schedulesIntegration?.analyzer) {
                            window.schedulesIntegration.analyzer.restaurarDados(schedulesData);
                            window.schedulesIntegration.ui?.render?.();
                        }
                    }

                    console.log('✅ Importação concluída!');

                    // Notificações com detalhes
                    this.showNotification('✅ Backup restaurado com sucesso!', 'success', 3000);
                    this.showNotification(`📊 ${contEvol} evoluções restauradas`, 'info', 2500);
                    this.showNotification(`💰 ${importedData.resumo.financeiro.totalAtendimentos} atendimentos financeiros restaurados`, 'info', 2500);
                    this.showNotification(`📋 ${contAgend} agendamentos restaurados`, 'info', 2500);
                    this.showNotification('🔄 Página recarregando em 3 segundos...', 'info', 2000);

                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);

                } catch (error) {
                    console.error('❌ Erro ao importar:', error);
                    this.showNotification('❌ Erro ao importar arquivo', 'error');
                    this.showNotification(error.message, 'warning', 4000);
                }
            };

            reader.readAsText(file);
            event.target.value = '';

        } catch (error) {
            console.error('❌ Erro:', error);
            this.showNotification('Erro ao processar arquivo', 'error');
        }
    }

    /**
     * Retorna timestamp formatado
     */
    _getTimestamp() {
        return new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 3000) {
        if (window.notify) {
            window.notify.show(message, type, duration);
        } else if (window.notificationSystem) {
            window.notificationSystem.show(message, type, duration);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
}

// Instância global
let exportImportManager;

document.addEventListener('DOMContentLoaded', () => {
    exportImportManager = new ExportImportManagerV2();
    window.exportImportManager = exportImportManager;
    console.log('✅ ExportImportManagerV2 pronto');
});
