/**
 * EVOLUCOES-ANALYZER.JS
 * Sistema completo de análise de evoluções pendentes
 * Processa dados de atendimentos e organiza por pacientes, fisioterapeutas e cronologia
 */

class EvolucoesAnalyzer {
    constructor() {
        this.evolucoes = [];
        this.pacientes = new Map();
        this.fisioterapeutas = new Map();
        this.cronologia = [];
        this.statusFiltro = 'Presença confirmada';
    }

    /**
     * Adiciona uma evolução aos dados (após validação de status)
     * @param {Object} agendamento - Dados do agendamento parseado
     * @returns {boolean} - True se foi adicionado
     */
    adicionarEvolucao(agendamento) {
        // Filtro crítico: só adiciona se status for "Presença confirmada"
        if (!agendamento || agendamento.status?.toLowerCase() !== this.statusFiltro.toLowerCase()) {
            console.warn(`⚠️ Evolução ignorada - Status: "${agendamento?.status}" (esperado: "${this.statusFiltro}")`);
            return false;
        }

        const evolucao = {
            id: this.evolucoes.length + 1,
            horario: agendamento.horario,
            fisioterapeuta: agendamento.fisioterapeuta || 'Não especificado',
            paciente: agendamento.paciente || 'Não especificado',
            celular: agendamento.celular,
            convenio: agendamento.convenio,
            status: agendamento.status,
            procedimentos: agendamento.procedimentos,
            periodo: agendamento.periodo,
            dataProcessamento: agendamento.dataProcessamento,
            mes: agendamento.mes,
            ano: agendamento.ano
        };

        this.evolucoes.push(evolucao);
        this._atualizarIndices();
        
        console.log(`✅ Evolução adicionada: ${evolucao.paciente} - ${evolucao.fisioterapeuta} - ${evolucao.horario}`);
        return true;
    }

    /**
     * Processa múltiplas evoluções
     * @param {Array} agendamentos - Array de agendamentos parseados
     * @returns {Object} - Relatório do processamento
     */
    processarMultiplas(agendamentos) {
        if (!Array.isArray(agendamentos)) {
            return { sucesso: 0, ignoradas: 0, erro: 'Input não é um array' };
        }

        let sucesso = 0;
        let ignoradas = 0;

        agendamentos.forEach(agendamento => {
            if (this.adicionarEvolucao(agendamento)) {
                sucesso++;
            } else {
                ignoradas++;
            }
        });

        console.log(`📊 Processamento: ${sucesso} sucesso, ${ignoradas} ignoradas`);
        return { sucesso, ignoradas, total: agendamentos.length };
    }

    /**
     * Atualiza mapas internos de pacientes, fisioterapeutas e cronologia
     * @private
     */
    _atualizarIndices() {
        this.pacientes.clear();
        this.fisioterapeutas.clear();
        this.cronologia = [];

        this.evolucoes.forEach(ev => {
            // Agrupa por paciente
            if (!this.pacientes.has(ev.paciente)) {
                this.pacientes.set(ev.paciente, {
                    nome: ev.paciente,
                    atendimentos: [],
                    fisioterapeutas: new Set(),
                    datas: new Set(),
                    totalAtendimentos: 0
                });
            }
            const paciente = this.pacientes.get(ev.paciente);
            paciente.atendimentos.push(ev);
            paciente.fisioterapeutas.add(ev.fisioterapeuta);
            paciente.datas.add(ev.periodo || `${ev.mes}/${ev.ano}`);
            paciente.totalAtendimentos++;

            // Agrupa por fisioterapeuta
            if (!this.fisioterapeutas.has(ev.fisioterapeuta)) {
                this.fisioterapeutas.set(ev.fisioterapeuta, {
                    nome: ev.fisioterapeuta,
                    atendimentos: [],
                    pacientes: new Set(),
                    datas: new Set(),
                    totalAtendimentos: 0,
                    totalPacientes: 0
                });
            }
            const fisio = this.fisioterapeutas.get(ev.fisioterapeuta);
            fisio.atendimentos.push(ev);
            fisio.pacientes.add(ev.paciente);
            fisio.datas.add(ev.periodo || `${ev.mes}/${ev.ano}`);
            fisio.totalAtendimentos++;
            fisio.totalPacientes = fisio.pacientes.size;

            // Adiciona à cronologia
            this.cronologia.push(ev);
        });

        // Ordena cronologia por data
        this.cronologia.sort((a, b) => {
            const dataA = new Date(a.ano, a.mes - 1, 1);
            const dataB = new Date(b.ano, b.mes - 1, 1);
            return dataB - dataA;
        });
    }

    /**
     * Retorna relatório da Visão Geral
     * @returns {Object} - Dashboard com pacientes sem evolução e fisios sem evolução
     */
    getVisaoGeral() {
        const pacientesComFaltaEvolucao = Array.from(this.pacientes.values()).map(p => ({
            nome: p.nome,
            totalAtendimentos: p.totalAtendimentos,
            fisioterapeutas: Array.from(p.fisioterapeutas),
            datas: Array.from(p.datas),
            ultimoAtendimento: p.atendimentos[p.atendimentos.length - 1]?.periodo || 'N/A'
        }));

        const fisiosComFaltaEvolucao = Array.from(this.fisioterapeutas.values()).map(f => ({
            nome: f.nome,
            totalAtendimentos: f.totalAtendimentos,
            totalPacientes: f.totalPacientes,
            pacientes: Array.from(f.pacientes),
            datas: Array.from(f.datas)
        }));

        return {
            pacientes: pacientesComFaltaEvolucao,
            fisioterapeutas: fisiosComFaltaEvolucao,
            totalPacientesUnicos: this.pacientes.size,
            totalFisioterapeutasUnicos: this.fisioterapeutas.size,
            totalAtendimentos: this.evolucoes.length,
            geradoEm: new Date().toLocaleString('pt-BR')
        };
    }

    /**
     * Retorna lista completa de pacientes
     * @returns {Array} - Array de pacientes com todas informações
     */
    getPacientes() {
        return Array.from(this.pacientes.values()).map(p => ({
            nome: p.nome,
            totalAtendimentos: p.totalAtendimentos,
            fisioterapeutas: Array.from(p.fisioterapeutas).join(', '),
            datas: Array.from(p.datas).sort((a, b) => new Date(b) - new Date(a)),
            atendimentos: p.atendimentos.map(a => ({
                horario: a.horario,
                fisioterapeuta: a.fisioterapeuta,
                data: a.periodo || `${a.mes}/${a.ano}`,
                convenio: a.convenio,
                celular: a.celular
            }))
        })).sort((a, b) => a.nome.localeCompare(b.nome));
    }

    /**
     * Retorna lista completa de fisioterapeutas
     * @returns {Array} - Array de fisios com suas informações
     */
    getFisioterapeutas() {
        return Array.from(this.fisioterapeutas.values()).map(f => ({
            nome: f.nome,
            totalAtendimentos: f.totalAtendimentos,
            totalPacientes: f.totalPacientes,
            pacientes: Array.from(f.pacientes).sort(),
            datas: Array.from(f.datas).sort((a, b) => new Date(b) - new Date(a)),
            atendimentos: f.atendimentos.map(a => ({
                paciente: a.paciente,
                horario: a.horario,
                data: a.periodo || `${a.mes}/${a.ano}`,
                procedimentos: a.procedimentos
            }))
        })).sort((a, b) => a.nome.localeCompare(b.nome));
    }

    /**
     * Retorna cronologia agrupada por datas
     * @returns {Object} - Cronologia organizada por data
     */
    getCronologia() {
        const cronologiaAgrupada = {};

        this.cronologia.forEach(ev => {
            // Usa dataProcessamento que está no formato DD/MM/YYYY
            const data = ev.dataProcessamento || ev.periodo || `${String(ev.mes).padStart(2, '0')}/${ev.ano}`;
            
            if (!cronologiaAgrupada[data]) {
                cronologiaAgrupada[data] = [];
            }

            cronologiaAgrupada[data].push({
                horario: ev.horario,
                paciente: ev.paciente,
                fisioterapeuta: ev.fisioterapeuta,
                celular: ev.celular,
                convenio: ev.convenio,
                procedimentos: ev.procedimentos
            });
        });

        // Ordena por data (mais recente primeiro)
        const cronologiaOrdenada = Object.keys(cronologiaAgrupada)
            .sort((a, b) => {
                const [diaA, mesA, anoA] = a.split('/').map(Number);
                const [diaB, mesB, anoB] = b.split('/').map(Number);
                return new Date(anoB, mesB - 1, diaB) - new Date(anoA, mesA - 1, diaA);
            })
            .reduce((acc, data) => {
                acc[data] = cronologiaAgrupada[data].sort((a, b) => {
                    return a.horario.localeCompare(b.horario);
                });
                return acc;
            }, {});

        return cronologiaOrdenada;
    }

    /**
     * Retorna estatísticas gerais
     * @returns {Object} - Estatísticas do período
     */
    getEstatisticas() {
        const atendimentosPorMes = {};
        const atendimentosPorFisio = {};
        const atendimentosPorConvenio = {};

        this.evolucoes.forEach(ev => {
            // Por mês
            const meChave = `${String(ev.mes).padStart(2, '0')}/${ev.ano}`;
            atendimentosPorMes[meChave] = (atendimentosPorMes[meChave] || 0) + 1;

            // Por fisioterapeuta
            atendimentosPorFisio[ev.fisioterapeuta] = (atendimentosPorFisio[ev.fisioterapeuta] || 0) + 1;

            // Por convênio
            const convenio = ev.convenio || 'Não informado';
            atendimentosPorConvenio[convenio] = (atendimentosPorConvenio[convenio] || 0) + 1;
        });

        return {
            totalEvolucoesAguardando: this.evolucoes.length,
            totalPacientesUnicos: this.pacientes.size,
            totalFisioterapeutasUnicos: this.fisioterapeutas.size,
            atendimentosPorMes,
            atendimentosPorFisio,
            atendimentosPorConvenio,
            periodoAnalise: `${new Date().toLocaleDateString('pt-BR')}`
        };
    }

    /**
     * Limpa todos os dados
     */
    limpar() {
        this.evolucoes = [];
        this.pacientes.clear();
        this.fisioterapeutas.clear();
        this.cronologia = [];
        console.log('🗑️ Dados de evoluções limpos');
    }

    /**
     * Retorna array de evoluções
     */
    getEvolucoes() {
        return this.evolucoes;
    }

    /**
     * Exporta dados em JSON
     * @returns {string} - JSON stringificado
     */
    exportarJSON() {
        return JSON.stringify({
            evolucoes: this.evolucoes,
            visaoGeral: this.getVisaoGeral(),
            pacientes: this.getPacientes(),
            fisioterapeutas: this.getFisioterapeutas(),
            cronologia: this.getCronologia(),
            estatisticas: this.getEstatisticas()
        }, null, 2);
    }

    /**
     * Importa dados de JSON
     * @param {string} jsonString - JSON para importar
     * @returns {boolean} - Sucesso ou falha
     */
    importarJSON(jsonString) {
        try {
            const dados = JSON.parse(jsonString);
            if (dados.evolucoes && Array.isArray(dados.evolucoes)) {
                this.limpar();
                dados.evolucoes.forEach(ev => {
                    this.evolucoes.push(ev);
                });
                this._atualizarIndices();
                console.log('✅ Dados importados com sucesso');
                return true;
            }
            return false;
        } catch (erro) {
            console.error('❌ Erro ao importar JSON:', erro);
            return false;
        }
    }
}

// Exporta a classe para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EvolucoesAnalyzer;
}
