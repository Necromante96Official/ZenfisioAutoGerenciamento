/**
 * SCHEDULES-ANALYZER.JS
 * Sistema de análise de agendamentos com organização de faltas
 * 
 * Organiza dados em duas categorias:
 * 1. Faltaram (LADO ESQUERDO): "não atendido" ou "faltou"
 * 2. Compareceram (LADO DIREITO): "presença confirmada", "atendido", e TODOS OS OUTROS status
 */

class SchedulesAnalyzer {
    constructor() {
        this.faltaram = [];          // Não atendido + Faltou (LADO ESQUERDO)
        this.compareceram = [];      // Presença confirmada + Atendido + Outros (LADO DIREITO)
        this.pacientesMap = new Map(); // Map para dedup
        this.data = null;            // Data processada (DD/MM/YYYY)
    }

    /**
     * Adiciona agendamento aos dados
     * @param {Object} agendamento - Dados do agendamento parseado
     * @returns {Object} - {adicionado: boolean, categoria: 'faltaram'|'compareceram'}
     */
    adicionarAgendamento(agendamento) {
        if (!agendamento) {
            console.warn('⚠️ Agendamento nulo/undefined');
            return { adicionado: false, categoria: null };
        }

        const statusLower = agendamento.status?.toLowerCase().trim() || '';
        
        console.log(`   - Status recebido: "${agendamento.status}" → "${statusLower}"`);
        
        // Define a categoria baseada no status
        let categoria = null;
        
        if (statusLower === 'não atendido' || statusLower === 'não atendio' || statusLower === 'faltou') {
            // LADO ESQUERDO: Faltaram
            categoria = 'faltaram';
            this.faltaram.push(agendamento);
            console.log(`   ✅ Adicionado em FALTARAM: ${agendamento.paciente}`);
        } else {
            // LADO DIREITO: Todos os OUTROS (presença confirmada, atendido, cancelado, etc)
            categoria = 'compareceram';
            this.compareceram.push(agendamento);
            console.log(`   ✅ Adicionado em COMPARECERAM: ${agendamento.paciente}`);
        }

        // Armazena a data se ainda não tiver
        // Prioritiza a data do dateManager sobre a data dos dados parseados
        if (!this.data) {
            if (window.dateManager) {
                const currentDate = window.dateManager.getDate();
                const dia = String(currentDate.getDate()).padStart(2, '0');
                const mes = String(currentDate.getMonth() + 1).padStart(2, '0');
                const ano = currentDate.getFullYear();
                this.data = `${dia}/${mes}/${ano}`;
                console.log(`   - Data definida pelo dateManager: ${this.data}`);
            } else if (agendamento.dia && agendamento.mes && agendamento.ano) {
                this.data = `${String(agendamento.dia).padStart(2, '0')}/${String(agendamento.mes).padStart(2, '0')}/${agendamento.ano}`;
                console.log(`   - Data definida pelos dados parseados: ${this.data}`);
            }
        }

        return { adicionado: true, categoria };
    }

    /**
     * Processa múltiplos agendamentos
     * @param {Array} agendamentos - Array de agendamentos parseados
     * @returns {Object} - Relatório do processamento
     */
    processarMultiplos(agendamentos) {
        if (!Array.isArray(agendamentos)) {
            console.warn('⚠️ SchedulesAnalyzer.processarMultiplos: entrada não é array', agendamentos);
            return { compareceram: 0, faltaram: 0, total: 0 };
        }

        console.log(`📊 SchedulesAnalyzer.processarMultiplos() iniciado com ${agendamentos.length} agendamentos`);

        let contCompareceram = 0;
        let contFaltaram = 0;

        agendamentos.forEach((agendamento, index) => {
            console.log(`   [${index + 1}] Processando: ${agendamento.paciente} - Status: "${agendamento.status}"`);
            const resultado = this.adicionarAgendamento(agendamento);
            if (resultado.adicionado) {
                if (resultado.categoria === 'compareceram') {
                    contCompareceram++;
                } else if (resultado.categoria === 'faltaram') {
                    contFaltaram++;
                }
            }
        });

        console.log(`📊 Processamento concluído: ${contCompareceram} compareceram, ${contFaltaram} faltaram`);
        return { compareceram: contCompareceram, faltaram: contFaltaram, total: agendamentos.length };
    }

    /**
     * Retorna resumo para os cards informativos
     * @returns {Object} - {totalCompareceram, totalFaltas, data}
     */
    getResumo() {
        return {
            totalCompareceram: this.compareceram.length,
            totalFaltas: this.faltaram.length,
            totalRegistros: this.compareceram.length + this.faltaram.length,
            data: this.data || 'Data não informada',
            taxaFalta: this.compareceram.length + this.faltaram.length > 0 
                ? ((this.faltaram.length / (this.compareceram.length + this.faltaram.length)) * 100).toFixed(1)
                : 0
        };
    }

    /**
     * Retorna lista de pacientes que FALTARAM
     * Formatada para exibição lado ESQUERDO (Faltaram)
     * @returns {Array} - Array de pacientes com dados básicos
     */
    getPacientesFaltaram() {
        return this.faltaram.map(ag => ({
            id: this._gerarId(),
            nome: ag.paciente,
            horario: ag.horario,
            fisioterapeuta: ag.fisioterapeuta,
            convenio: ag.convenio,
            status: ag.status,
            celular: ag.celular,
            procedimentos: ag.procedimentos,
            periodo: ag.periodo,
            repetido: ag.repetido,
            tipo: 'falta'
        })).sort((a, b) => a.nome.localeCompare(b.nome));
    }

    /**
     * Retorna lista de pacientes que COMPARECERAM
     * Formatada para exibição lado DIREITO (Compareceram)
     * @returns {Array} - Array de pacientes com dados básicos
     */
    getPacientesCompareceram() {
        return this.compareceram.map(ag => ({
            id: this._gerarId(),
            nome: ag.paciente,
            horario: ag.horario,
            fisioterapeuta: ag.fisioterapeuta,
            convenio: ag.convenio,
            status: ag.status,
            celular: ag.celular,
            procedimentos: ag.procedimentos,
            periodo: ag.periodo,
            repetido: ag.repetido,
            tipo: 'compareceu'
        })).sort((a, b) => a.nome.localeCompare(b.nome));
    }

    /**
     * Retorna dados para visualização lado a lado
     * Usado na aba Pacientes
     * @returns {Object} - {faltaram: [], compareceram: []}
     */
    getPacientesComparativo() {
        return {
            faltaram: this.getPacientesFaltaram(),     // Lado esquerdo
            compareceram: this.getPacientesCompareceram(), // Lado direito
            resumo: this.getResumo()
        };
    }

    /**
     * Retorna estatísticas por fisioterapeuta
     * Mostra quantos compareceram vs faltaram
     * @returns {Object} - Mapa de fisioterapeutas com estatísticas
     */
    getEstatisticasPorFisio() {
        const stats = new Map();

        // Processa compareceram
        this.compareceram.forEach(ag => {
            const fisio = ag.fisioterapeuta || 'Não informado';
            if (!stats.has(fisio)) {
                stats.set(fisio, { nome: fisio, compareceram: 0, faltaram: 0 });
            }
            stats.get(fisio).compareceram++;
        });

        // Processa faltaram
        this.faltaram.forEach(ag => {
            const fisio = ag.fisioterapeuta || 'Não informado';
            if (!stats.has(fisio)) {
                stats.set(fisio, { nome: fisio, compareceram: 0, faltaram: 0 });
            }
            stats.get(fisio).faltaram++;
        });

        // Converte para array e calcula taxa de falta
        return Array.from(stats.values()).map(stat => ({
            ...stat,
            total: stat.compareceram + stat.faltaram,
            taxaFalta: ((stat.faltaram / (stat.compareceram + stat.faltaram)) * 100).toFixed(1)
        })).sort((a, b) => b.total - a.total);
    }

    /**
     * Retorna estatísticas por convênio
     * Mostra padrão de falta por tipo de convênio
     * @returns {Array} - Array de estatísticas por convênio
     */
    getEstatisticasPorConvenio() {
        const stats = new Map();

        // Processa compareceram
        this.compareceram.forEach(ag => {
            const convenio = ag.convenio || 'Não informado';
            if (!stats.has(convenio)) {
                stats.set(convenio, { convenio, compareceram: 0, faltaram: 0 });
            }
            stats.get(convenio).compareceram++;
        });

        // Processa faltaram
        this.faltaram.forEach(ag => {
            const convenio = ag.convenio || 'Não informado';
            if (!stats.has(convenio)) {
                stats.set(convenio, { convenio, compareceram: 0, faltaram: 0 });
            }
            stats.get(convenio).faltaram++;
        });

        // Converte para array e calcula
        return Array.from(stats.values()).map(stat => ({
            ...stat,
            total: stat.compareceram + stat.faltaram,
            taxaFalta: ((stat.faltaram / (stat.compareceram + stat.faltaram)) * 100).toFixed(1)
        })).sort((a, b) => b.total - a.total);
    }

    /**
     * Retorna lista de pacientes únicos que faltaram (de-duplicado)
     * Útil para enviar avisos/lembretes
     * @returns {Array} - Array de pacientes únicos
     */
    getPacientesUnicosFaltaram() {
        const pacientes = new Map();
        
        this.faltaram.forEach(ag => {
            const nome = ag.paciente;
            if (!pacientes.has(nome)) {
                pacientes.set(nome, {
                    nome,
                    celular: ag.celular,
                    totalFaltas: 0,
                    datas: []
                });
            }
            const p = pacientes.get(nome);
            p.totalFaltas++;
            p.datas.push(this.data || 'Data não informada');
        });

        return Array.from(pacientes.values()).sort((a, b) => b.totalFaltas - a.totalFaltas);
    }

    /**
     * Exporta dados em JSON
     * @returns {string} - JSON stringificado
     */
    exportarJSON() {
        return JSON.stringify({
            data: this.data,
            resumo: this.getResumo(),
            pacientesComparativo: this.getPacientesComparativo(),
            estatisticasPorFisio: this.getEstatisticasPorFisio(),
            estatisticasPorConvenio: this.getEstatisticasPorConvenio(),
            pacientesUnicosFaltaram: this.getPacientesUnicosFaltaram()
        }, null, 2);
    }

    /**
     * Limpa todos os dados
     */
    limpar() {
        this.faltaram = [];
        this.compareceram = [];
        this.pacientesMap.clear();
        this.data = null;
        console.log('🗑️ Dados de agendamentos limpos');
    }

    /**
     * Gera ID único para cada paciente
     * @private
     */
    _gerarId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Retorna dados brutos para serem salvos
     * @returns {Object}
     */
    getDadosParaSalvar() {
        return {
            faltaram: this.faltaram,
            compareceram: this.compareceram,
            data: this.data,
            resumo: this.getResumo()
        };
    }

    /**
     * Restaura dados de um backup
     * @param {Object} dados - Dados salvos anteriormente
     */
    restaurarDados(dados) {
        if (!dados) return;
        
        this.faltaram = dados.faltaram || [];
        this.compareceram = dados.compareceram || [];
        this.data = dados.data || null;
        
        console.log('✅ Dados de agendamentos restaurados');
    }

    /**
     * Sincroniza a data com o dateManager
     * Garante que sempre mostre a data selecionada
     */
    sincronizarDataComDateManager() {
        if (window.dateManager && typeof window.dateManager.getDate === 'function') {
            try {
                const currentDate = window.dateManager.getDate();
                const dia = String(currentDate.getDate()).padStart(2, '0');
                const mes = String(currentDate.getMonth() + 1).padStart(2, '0');
                const ano = currentDate.getFullYear();
                const novaData = `${dia}/${mes}/${ano}`;
                
                if (this.data !== novaData) {
                    console.log(`🔄 Data sincronizada: ${this.data} → ${novaData}`);
                    this.data = novaData;
                }
            } catch (e) {
                console.warn('⚠️ Erro ao sincronizar data com dateManager:', e);
            }
        }
    }
}

// Exporta a classe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchedulesAnalyzer;
}
