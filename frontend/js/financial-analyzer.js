/**
 * Financial Analyzer - Processa dados financeiros e gera análises
 */

class FinancialAnalyzer {
    constructor(records = []) {
        this.records = records;
        this.analysis = {};
    }

    /**
     * Executa análise completa
     */
    analyze() {
        // Os records já vêm filtrados de FinancialIntegration (getConfirmedRecords)
        // Não precisa filtrar novamente
        
        this.analysis = {
            summary: this._generateSummary(),
            byDate: this._analyzeByDate(),
            bySpecialty: this._analyzeBySpecialty(),
            byProfessional: this._analyzeByProfessional(),
            byPatient: this._analyzeByPatient()
        };

        return this.analysis;
    }

    /**
     * Valida record financeiro (não utilizado - validation feita no parser)
     */
    _validateRecord(record) {
        return record && 
               record.fisioterapeuta && 
               record.paciente && 
               record.convenio &&
               record.procedimentos &&
               record.status && 
               record.status.toLowerCase().includes('presença confirmada');
    }

    /**
     * Gera resumo geral
     */
    _generateSummary() {
        const totalAtendimentos = this.records.length;
        const pagantes = this.records.filter(r => !this._isIsento(r.convenio));
        const isentos = this.records.filter(r => this._isIsento(r.convenio));
        const receitaTotal = this.records.reduce((sum, r) => sum + (r.valor || 0), 0);

        return {
            totalAtendimentos,
            totalPagantes: pagantes.length,
            totalIsentos: isentos.length,
            receitaTotal: receitaTotal.toFixed(2),
            ticketMedio: totalAtendimentos > 0 ? (receitaTotal / totalAtendimentos).toFixed(2) : 0
        };
    }

    /**
     * Analisa registros por data de processamento
     */
    _analyzeByDate() {
        const dateMap = {};

        this.records.forEach(record => {
            const dataProcessamento = record.dataProcessamento || 'Data não informada';
            
            if (!dateMap[dataProcessamento]) {
                dateMap[dataProcessamento] = {
                    data: dataProcessamento,
                    mes: record.mes,
                    ano: record.ano,
                    atendimentos: 0,
                    pagantes: 0,
                    isentos: 0,
                    receita: 0,
                    registros: []
                };
            }

            dateMap[dataProcessamento].atendimentos++;
            dateMap[dataProcessamento].receita += record.valor || 0;
            dateMap[dataProcessamento].registros.push(record);

            if (this._isIsento(record.convenio)) {
                dateMap[dataProcessamento].isentos++;
            } else {
                dateMap[dataProcessamento].pagantes++;
            }
        });

        // Ordena por data (ano, depois mês, depois dia)
        return Object.values(dateMap).sort((a, b) => {
            if (a.ano !== b.ano) return b.ano - a.ano;
            if (a.mes !== b.mes) return b.mes - a.mes;
            
            // Extrai dia da data formatada DD/MM/YYYY
            const diaA = parseInt(a.data.split('/')[0]);
            const diaB = parseInt(b.data.split('/')[0]);
            return diaB - diaA;
        });
    }

    /**
     * Analisa por especialidade
     */
    _analyzeBySpecialty() {
        const specialties = {};

        this.records.forEach(record => {
            const specialty = this._extractSpecialty(record.procedimentos);
            
            if (!specialties[specialty]) {
                specialties[specialty] = {
                    nome: specialty,
                    atendimentos: 0,
                    pagantes: 0,
                    isentos: 0,
                    receita: 0
                };
            }

            specialties[specialty].atendimentos++;
            specialties[specialty].receita += record.valor || 0;

            if (this._isIsento(record.convenio)) {
                specialties[specialty].isentos++;
            } else {
                specialties[specialty].pagantes++;
            }
        });

        return Object.values(specialties).sort((a, b) => b.atendimentos - a.atendimentos);
    }

    /**
     * Analisa por profissional
     */
    _analyzeByProfessional() {
        const professionals = {};

        this.records.forEach(record => {
            const pro = record.fisioterapeuta;

            if (!professionals[pro]) {
                professionals[pro] = {
                    nome: pro,
                    atendimentos: 0,
                    pagantes: 0,
                    isentos: 0,
                    receita: 0,
                    pacientes: new Set(),
                    especialidades: new Set()
                };
            }

            professionals[pro].atendimentos++;
            professionals[pro].receita += record.valor || 0;
            professionals[pro].pacientes.add(record.paciente);
            professionals[pro].especialidades.add(this._extractSpecialty(record.procedimentos));

            if (this._isIsento(record.convenio)) {
                professionals[pro].isentos++;
            } else {
                professionals[pro].pagantes++;
            }
        });

        return Object.values(professionals)
            .map(p => ({
                ...p,
                pacientesUnicos: p.pacientes.size,
                especialidades: Array.from(p.especialidades).join(', ')
            }))
            .sort((a, b) => b.atendimentos - a.atendimentos);
    }

    /**
     * Analisa por paciente (isento vs particular)
     */
    _analyzeByPatient() {
        const isentos = [];
        const particulares = [];

        this.records.forEach(record => {
            const patientEntry = {
                nome: record.paciente,
                celular: record.celular || '-',
                fisioterapeuta: record.fisioterapeuta,
                especialidade: this._extractSpecialty(record.procedimentos),
                procedimentos: record.procedimentos,
                atendimentos: 1,
                valor: record.valor || 0
            };

            if (this._isIsento(record.convenio)) {
                isentos.push(patientEntry);
            } else {
                particulares.push(patientEntry);
            }
        });

        // Agrupa por paciente
        const groupedIsentos = this._groupPatients(isentos);
        const groupedParticulares = this._groupPatients(particulares);

        return {
            isentos: groupedIsentos.sort((a, b) => b.atendimentos - a.atendimentos),
            particulares: groupedParticulares.sort((a, b) => b.valor - a.valor)
        };
    }

    /**
     * Agrupa pacientes por nome
     */
    _groupPatients(patients) {
        const grouped = {};

        patients.forEach(p => {
            if (!grouped[p.nome]) {
                grouped[p.nome] = { ...p };
            } else {
                grouped[p.nome].atendimentos++;
                grouped[p.nome].valor += p.valor;
            }
        });

        return Object.values(grouped);
    }

    /**
     * Extrai especialidade do procedimento
     */
    _extractSpecialty(procedimentos) {
        if (!procedimentos) return 'Geral';
        
        const specialties = {
            'postura': 'Educação Postural',
            'dor crônica': 'Dor Crônica',
            'ortopedia': 'Ortopedia',
            'neurologia': 'Neurologia',
            'traumatologia': 'Traumatologia',
            'respiratória': 'Fisioterapia Respiratória',
            'desportiva': 'Fisioterapia Desportiva'
        };

        for (let [key, specialty] of Object.entries(specialties)) {
            if (procedimentos.toLowerCase().includes(key)) {
                return specialty;
            }
        }

        return 'Geral';
    }

    /**
     * Determina se é isento
     */
    _isIsento(convenio) {
        if (!convenio) return false;
        const lower = convenio.toLowerCase();
        return lower.includes('isento') || !lower.includes('particular');
    }

    /**
     * Retorna dados de análise
     */
    getAnalysis() {
        return this.analysis;
    }

    /**
     * Retorna resumo
     */
    getSummary() {
        return this.analysis.summary || {};
    }

    /**
     * Retorna análise por data
     */
    getByDate() {
        return this.analysis.byDate || [];
    }

    /**
     * Retorna análise por especialidade
     */
    getSpecialties() {
        return this.analysis.bySpecialty || [];
    }

    /**
     * Retorna análise por profissional
     */
    getProfessionals() {
        return this.analysis.byProfessional || [];
    }

    /**
     * Retorna análise por paciente
     */
    getPatients() {
        return this.analysis.byPatient || { isentos: [], particulares: [] };
    }
}
