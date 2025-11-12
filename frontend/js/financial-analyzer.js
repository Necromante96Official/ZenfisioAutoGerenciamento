/**
 * Financial Analyzer - Processa dados financeiros e gera análises
 */

class FinancialAnalyzer {
    constructor(records = []) {
        this.records = records;
        this.analysis = {};
    }

    /**
     * Normaliza nome para agrupamento consistente
     */
    _normalizeName(name) {
        if (!name || typeof name !== 'string') return '';
        return name.trim().toLowerCase().replace(/\s+/g, ' ');
    }

    /**
     * Formata procedimento de forma legível
     * Transforma: "Atendimento Fisioterapia Neurofuncional Adulto 2x semana"
     * Em: "Atendimento: Fisioterapia Neurofuncional Adulto - 2x semana"
     */
    _formatProcedimento(procedimento) {
        if (!procedimento || typeof procedimento !== 'string') return '-';
        
        let texto = procedimento.trim();
        
        // Padrão: "Atendimento Tipo 2x/3x semana" ou similares
        // Separa a frequência (Ex: "2x semana", "3x semana", etc)
        const frequenciaMatch = texto.match(/(\d+x\s+\w+)$/i);
        let frequencia = '';
        let base = texto;
        
        if (frequenciaMatch) {
            frequencia = frequenciaMatch[1];
            base = texto.substring(0, texto.lastIndexOf(frequenciaMatch[0])).trim();
        }
        
        // Separa a primeira palavra (normalmente "Atendimento")
        const partes = base.split(/\s+/);
        if (partes.length === 0) return texto;
        
        const primeira = partes[0];
        const resto = partes.slice(1).join(' ');
        
        // Monta a string formatada - SEM MARCAÇÕES (plain text)
        let resultado = `${primeira}:`;
        
        if (resto) {
            resultado += ` ${resto}`;
        }
        
        if (frequencia) {
            resultado += ` - ${frequencia}`;
        }
        
        return resultado;
    }

    /**
     * Executa análise completa
     */
    analyze() {
        // Os records já vêm filtrados de FinancialIntegration (getConfirmedRecords)
        // Não precisa filtrar novamente
        
        // DEBUG: Conta isentos vs particulares
        const isentosCount = this.records.filter(r => this._isIsento(r.convenio, r.procedimentos)).length;
        const pagantesCount = this.records.filter(r => !this._isIsento(r.convenio, r.procedimentos)).length;
        console.log(`📊 Análise: ${isentosCount} isentos + ${pagantesCount} pagantes = ${this.records.length} total`);
        
        // DEBUG: Mostra exemplos de convênios encontrados
        const convênios = [...new Set(this.records.map(r => r.convenio))];
        console.log(`📋 Convênios encontrados:`, convênios);
        
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
     * REMOVIDO: Função não é utilizada no processo de análise
     */

    /**
     * Gera resumo geral
     */
    _generateSummary() {
        const totalAtendimentos = this.records.length;
        const pagantes = this.records.filter(r => !this._isIsento(r.convenio, r.procedimentos));
        const isentos = this.records.filter(r => this._isIsento(r.convenio, r.procedimentos));
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
            // Garante que dataProcessamento seja preenchida, nunca fica "Data não informada"
            let dataProcessamento = record.dataProcessamento;
            
            // Se não tiver data, usa data do mês/ano ou data atual
            if (!dataProcessamento || dataProcessamento === 'Data não informada') {
                if (record.mes && record.ano) {
                    // Tenta formatar com mês/ano disponíveis
                    const dia = '01';
                    const mes = String(record.mes).padStart(2, '0');
                    const ano = record.ano;
                    dataProcessamento = `${dia}/${mes}/${ano}`;
                } else {
                    // Usa data atual como fallback
                    const hoje = new Date();
                    const dia = String(hoje.getDate()).padStart(2, '0');
                    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
                    const ano = hoje.getFullYear();
                    dataProcessamento = `${dia}/${mes}/${ano}`;
                }
            }
            
            if (!dateMap[dataProcessamento]) {
                dateMap[dataProcessamento] = {
                    data: dataProcessamento,
                    mes: record.mes || new Date().getMonth() + 1,
                    ano: record.ano || new Date().getFullYear(),
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

            if (this._isIsento(record.convenio, record.procedimentos)) {
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

            // SMART: Passa tanto convenio quanto procedimentos para melhor detecção
            if (this._isIsento(record.convenio, record.procedimentos)) {
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
            // Normaliza nome do profissional para evitar duplicatas por espaços/maiúsculas
            const proNormalized = this._normalizeName(record.fisioterapeuta);
            const proDisplay = record.fisioterapeuta; // Original para exibição

            if (!professionals[proNormalized]) {
                professionals[proNormalized] = {
                    nome: proDisplay,
                    nomeNormalizado: proNormalized,
                    atendimentos: 0,
                    pagantes: 0,
                    isentos: 0,
                    receita: 0,
                    pacientes: new Set(),
                    especialidades: new Set()
                };
            }

            professionals[proNormalized].atendimentos++;
            professionals[proNormalized].receita += record.valor || 0;
            const pacienteNormalized = this._normalizeName(record.paciente);
            professionals[proNormalized].pacientes.add(pacienteNormalized);
            professionals[proNormalized].especialidades.add(this._extractSpecialty(record.procedimentos));

            if (this._isIsento(record.convenio, record.procedimentos)) {
                professionals[proNormalized].isentos++;
            } else {
                professionals[proNormalized].pagantes++;
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
            // Normaliza nome do paciente
            const pacienteNormalizado = this._normalizeName(record.paciente);
            const isIsento = this._isIsento(record.convenio, record.procedimentos);
            
            // DEBUG: Mostra classificação
            console.log(`   Paciente: ${record.paciente} | Convênio: "${record.convenio}" | Isento: ${isIsento}`);
            
            const patientEntry = {
                nome: record.paciente,
                nomeNormalizado: pacienteNormalizado,
                celular: record.celular || '-',
                fisioterapeuta: record.fisioterapeuta,
                especialidade: this._extractSpecialty(record.procedimentos),
                procedimentos: record.procedimentos,
                atendimentos: 1,
                valor: record.valor || 0
            };

            if (isIsento) {
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
     * Agrupa pacientes por nome (usa nome normalizado para agrupamento)
     */
    _groupPatients(patients) {
        const grouped = {};

        patients.forEach(p => {
            // Usa nome normalizado como chave
            const key = p.nomeNormalizado || this._normalizeName(p.nome);
            
            if (!grouped[key]) {
                grouped[key] = { ...p };
            } else {
                grouped[key].atendimentos++;
                grouped[key].valor += p.valor;
            }
        });

        return Object.values(grouped);
    }

    /**
     * Extrai especialidade do procedimento
     * Agora retorna o procedimento completo para melhor identificação
     */
    _extractSpecialty(procedimentos) {
        if (!procedimentos) return 'Geral';
        
        // Retorna o procedimento completo (ex: "Fisioterapia Ortopedia 3x semana")
        return procedimentos.trim();
    }

    /**
     * Determina se é isento
     * SMART: Verifica convenio E procedimentos para detectar isento
     */
    _isIsento(convenio, procedimentos = '') {
        if (!convenio && !procedimentos) return false;
        
        const convLower = convenio ? convenio.toLowerCase().trim() : '';
        
        // 1. Se convenio contém "isento", é isento
        if (convLower.includes('isento')) {
            return true;
        }
        
        // 2. Se convenio contém "particular", NÃO é isento
        if (convLower.includes('particular')) {
            return false;
        }
        
        // 3. Se contém convênio conhecido, NÃO é isento
        const convêniosComuns = [
            'unimed', 'sulamerica', 'bradesco', 'amil', 'hapvida', 'seguros',
            'vivo', 'claro', 'oi', 'tim', 'copasa', 'cabesp', 'funcef',
            'convênio', 'empresa', 'operadora', 'plano'
        ];
        
        if (convêniosComuns.some(conv => convLower.includes(conv))) {
            return false;
        }
        
        // 4. NOVO: Verifica se "isento" está no PROCEDIMENTO (ao final)
        if (procedimentos) {
            const procLower = procedimentos.toLowerCase().trim();
            // Se termina com "isento" ou contém "isento" no final
            if (procLower.endsWith('isento') || procLower.match(/\s+isento\s*$/)) {
                return true; // É ISENTO mesmo que convenio seja vazio
            }
        }
        
        // Padrão: não isento
        return false;
    }

    /**
     * Retorna dados de análise
     */
    getAnalysis() {
        return this.analysis;
    }

    /**
     * Método estático para formatar procedimento (acessível sem instância)
     * AGORA: Retorna o NOME EXATO sem simplificações
     */
    static formatarProcedimento(procedimento) {
        if (!procedimento || typeof procedimento !== 'string') return '-';
        
        // Retorna o procedimento EXATO como está
        // Sem simplificações, otimizações ou mudanças de formato
        return procedimento.trim();
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
