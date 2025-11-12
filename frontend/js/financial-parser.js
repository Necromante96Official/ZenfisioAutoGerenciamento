/**
 * Financial Parser - Extrai dados financeiros de registros de atendimento
 * Extrai: Fisioterapeuta, Paciente, Convênio, Procedimentos, Valor
 */

class FinancialParser {
    constructor() {
        this.records = [];
    }

    /**
     * Parse de dados financeiros do texto
     * Agora suporta múltiplas mensagens com caracteres especiais
     */
    parse(text) {
        if (!text || typeof text !== 'string') {
            return [];
        }

        // Remove caracteres especiais que podem aparecer
        text = text.replace(/[×•·]/g, ' ').trim();

        this.records = [];
        const lines = text.split('\n');
        let currentRecord = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Detecta início de novo registro
            if (line.match(/^Horário:/i)) {
                if (currentRecord) {
                    this.records.push(currentRecord);
                }
                currentRecord = this._initializeRecord();
            }

            if (!currentRecord) continue;

            // Extrai campos
            if (line.match(/^Horário:/i)) {
                currentRecord.horario = this._extractValue(line);
            } else if (line.match(/^Fisioterapeuta:/i)) {
                currentRecord.fisioterapeuta = this._extractValue(line);
            } else if (line.match(/^Paciente:/i)) {
                currentRecord.paciente = this._extractValue(line);
            } else if (line.match(/^Celular:/i)) {
                currentRecord.celular = this._extractValue(line);
            } else if (line.match(/^Convênio:/i)) {
                currentRecord.convenio = this._extractValue(line);
            } else if (line.match(/^Status:/i)) {
                currentRecord.status = this._extractValue(line);
            } else if (line.match(/^Procedimentos:/i)) {
                currentRecord.procedimentos = this._extractValue(line);
            } else if (line.match(/^Repetido:/i)) {
                currentRecord.repetido = this._extractValue(line);
            } else if (line.match(/^\d{2}\/\d{2}\/\d{4}/)) {
                currentRecord.dataAtendimento = this._extractDate(line);
            } else if (line.match(/Atendimento.*?R\$\s*[\d.,]+/i)) {
                currentRecord.valor = this._extractFinancialValue(line);
            }
        }

        if (currentRecord) {
            this.records.push(currentRecord);
        }

        return this.records;
    }

    /**
     * Inicializa registro vazio
     */
    _initializeRecord() {
        return {
            horario: '',
            fisioterapeuta: '',
            paciente: '',
            celular: '',
            convenio: '',
            status: '',
            procedimentos: '',
            repetido: '',
            dataAtendimento: '',
            valor: 0
        };
    }

    /**
     * Extrai valor após ':' em uma linha
     */
    _extractValue(line) {
        const parts = line.split(':');
        return parts.length > 1 ? parts.slice(1).join(':').trim() : '';
    }

    /**
     * Extrai data no formato DD/MM/YYYY até YYYY
     */
    _extractDate(line) {
        const dateMatch = line.match(/(\d{2}\/\d{2}\/\d{4})/);
        return dateMatch ? dateMatch[1] : '';
    }

    /**
     * Extrai valor financeiro (R$ 15,00)
     */
    _extractFinancialValue(line) {
        const valueMatch = line.match(/R\$\s*([\d.,]+)/i);
        if (valueMatch) {
            const value = valueMatch[1]
                .replace('.', '')
                .replace(',', '.')
                .trim();
            return parseFloat(value) || 0;
        }
        return 0;
    }

    /**
     * Filtra registros confirmados
     * Aceita qualquer status preenchido como válido
     * NOTA: v1.0.0.9 usa getValidRecords() que é mais flexível
     */
    getConfirmedRecords() {
        // Se não tem status, qualquer registro com dados principais é considerado válido
        return this.records.filter(r => {
            const temDados = (r.fisioterapeuta && r.fisioterapeuta.trim()) || 
                           (r.paciente && r.paciente.trim());
            // Aceita se tem dados E (tem status OU é um registro válido)
            return temDados && r.status;
        });
    }

    /**
     * Filtra registros com status diferente de "Presença confirmada"
     * (como "Atendido", "Compareceu", etc)
     */
    getOtherStatusRecords() {
        return this.records.filter(r => 
            r.status && !r.status.toLowerCase().includes('presença confirmada')
        );
    }

    /**
     * Retorna registros validados
     * Valida que pelo menos os campos principais estejam preenchidos
     * NOTA: NÃO requer status, apenas dados principais (fisio OU paciente)
     */
    getValidRecords() {
        return this.records.filter(r => {
            // Requer pelo menos fisioterapeuta OU paciente (um dos principais)
            const temDadosPrincipais = (r.fisioterapeuta && r.fisioterapeuta.trim()) || 
                                       (r.paciente && r.paciente.trim());
            
            // Aceita registro se tem dados principais (status é opcional)
            return temDadosPrincipais;
        });
    }

    /**
     * Extrai especialidade do procedimento
     */
    static extractSpecialty(procedimentos) {
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

        return procedimentos.split(' ')[0] || 'Geral';
    }

    /**
     * Determina se é isento ou pagante
     */
    static isIsento(convenio) {
        if (!convenio) return false;
        return convenio.toLowerCase().includes('isento') || 
               convenio.toLowerCase().includes('particular') === false;
    }
}
