/**
 * SCHEDULES-PARSER.JS
 * Módulo responsável por fazer o parse de mensagens de agendamento
 * Processa agendamentos que NÃO foram atendidos (status: "não atendido" ou "faltou")
 * 
 * Fluxo de Status:
 * - "não atendido" → Coletado neste parser
 * - "faltou" → Coletado neste parser
 * - "presença confirmada" → Coletado TAMBÉM para mostrar no lado esquerdo da aba
 * - "atendido" → Coletado TAMBÉM para mostrar no lado esquerdo da aba
 */

class SchedulesParser {
    constructor() {
        this.agendamentos = [];
    }

    /**
     * Faz o parse do conteúdo colado
     * @param {string} content - Conteúdo da mensagem
     * @returns {Object|null} Objeto com dados do agendamento ou null se inválido
     */
    parse(content) {
        if (!content || content.trim() === '') {
            return null;
        }

        // Remove caracteres especiais que podem aparecer
        content = content.replace(/[×•·]/g, ' ');

        const lines = content.split('\n');
        
        // ⭐ Obtém a data selecionada NO MOMENTO DO PARSE (não usa data atual depois)
        let dataSelecionada = null;
        if (window.dateManager && typeof window.dateManager.getDate === 'function') {
            const dateObj = window.dateManager.getDate();
            dataSelecionada = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
        }
        
        const agendamento = {
            horario: null,
            fisioterapeuta: null,
            paciente: null,
            celular: null,
            convenio: null,
            status: null,
            procedimentos: null,
            repetido: null,
            periodo: null,
            valorAtendimento: 0,
            tipoConvenio: null,
            dataProcessamento: new Date(),
            dataSelecionada: dataSelecionada, // ⭐ NOVO: Armazena data selecionada
            mes: null,
            ano: null,
            dia: null,
            isIsento: false,
            isPagante: false,
            isAtendido: false,
            isFalta: false,
            isNaoAtendido: false
        };

        // Parse linha por linha
        lines.forEach(line => {
            const cleanLine = line.trim();
            if (!cleanLine) return; // Pula linhas vazias

            // Horário - Extrai APENAS HH:MM - HH:MM
            if (cleanLine.match(/^Horário:/i) || cleanLine.match(/^Horário\s*:/i)) {
                let horarioCompleto = cleanLine.replace(/^Horário\s*:\s*/i, '').trim();
                horarioCompleto = horarioCompleto.replace(/^[×\-\s]+/, '').trim();
                const horaMatch = horarioCompleto.match(/\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}|\d{1,2}:\d{2}/);
                agendamento.horario = horaMatch ? horaMatch[0].trim() : horarioCompleto;
            }

            // Fisioterapeuta
            if (cleanLine.match(/^Fisioterapeuta:/i)) {
                agendamento.fisioterapeuta = cleanLine.replace(/^Fisioterapeuta\s*:\s*/i, '').trim();
            }

            // Paciente
            if (cleanLine.match(/^Paciente:/i)) {
                agendamento.paciente = cleanLine.replace(/^Paciente\s*:\s*/i, '').trim();
            }

            // Celular
            if (cleanLine.match(/^Celular:/i)) {
                agendamento.celular = cleanLine.replace(/^Celular\s*:\s*/i, '').trim();
            }

            // Convênio (suporta Convênio ou Convenio)
            if (cleanLine.match(/^Conv[êe]nio:/i)) {
                agendamento.convenio = cleanLine.replace(/^Conv[êe]nio\s*:\s*/i, '').trim();
            }

            // Status
            if (cleanLine.match(/^Status:/i)) {
                agendamento.status = cleanLine.replace(/^Status\s*:\s*/i, '').trim();
                const statusLower = agendamento.status.toLowerCase();
                
                // Classifica o status
                agendamento.isAtendido = statusLower === 'atendido';
                agendamento.isFalta = statusLower === 'faltou';
                agendamento.isNaoAtendido = statusLower === 'não atendido';
            }

            // Procedimentos
            if (cleanLine.match(/^Procedimentos:/i)) {
                agendamento.procedimentos = cleanLine.replace(/^Procedimentos\s*:\s*/i, '').trim();
                agendamento.isIsento = /isento/i.test(agendamento.procedimentos);
            }

            // Repetido
            if (cleanLine.match(/^Repetido:/i)) {
                agendamento.repetido = cleanLine.replace(/^Repetido\s*:\s*/i, '').trim();
            }

            // Período (suporta Período ou Periodo)
            if (cleanLine.match(/^Per[íi]odo:/i)) {
                const periodoText = cleanLine.replace(/^Per[íi]odo\s*:\s*/i, '').trim();
                agendamento.periodo = periodoText;
                
                // Extrai data inicial para determinar mês/ano
                const dataMatch = periodoText.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                if (dataMatch) {
                    agendamento.dia = parseInt(dataMatch[1]);
                    agendamento.mes = parseInt(dataMatch[2]);
                    agendamento.ano = parseInt(dataMatch[3]);
                    agendamento.dataInicial = new Date(agendamento.ano, agendamento.mes - 1, agendamento.dia);
                }
            }

            // Atendimento - Particular
            if (cleanLine.match(/atendimento.*r\$|r\$.*atendimento/i)) {
                const corrigido = cleanLine.replace(/\bPa\.{2,}\b/g, 'Particular');
                agendamento.tipoConvenio = corrigido.includes('Particular') ? 'Particular' : 'Outros';
                
                const valorMatch = corrigido.match(/R\$\s*([\d,.]+)/i);
                if (valorMatch) {
                    const valorStr = valorMatch[1]
                        .replace(/\./g, '')
                        .replace(',', '.');
                    agendamento.valorAtendimento = parseFloat(valorStr) || 0;
                }
            }
        });

        // Define se é pagante
        agendamento.isPagante = !agendamento.isIsento && agendamento.valorAtendimento > 0;

        // Se não tiver mês/ano definido, usa a data do dateManager
        if (!agendamento.mes || !agendamento.ano) {
            if (window.dateManager) {
                const currentDate = window.dateManager.getDate();
                agendamento.dia = currentDate.getDate();
                agendamento.mes = currentDate.getMonth() + 1;
                agendamento.ano = currentDate.getFullYear();
                console.log(`   - Data do dateManager aplicada: ${agendamento.dia}/${agendamento.mes}/${agendamento.ano}`);
            } else {
                // Tenta extrair da linha de período como fallback
                const allDataMatch = content.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                if (allDataMatch) {
                    agendamento.dia = parseInt(allDataMatch[1]);
                    agendamento.mes = parseInt(allDataMatch[2]);
                    agendamento.ano = parseInt(allDataMatch[3]);
                } else {
                    // Se não conseguir, usa data de processamento atual
                    const hoje = new Date();
                    agendamento.dia = hoje.getDate();
                    agendamento.mes = hoje.getMonth() + 1;
                    agendamento.ano = hoje.getFullYear();
                }
            }
        }

        // Valida campos essenciais
        if (!agendamento.horario || !agendamento.paciente) {
            console.warn('❌ Validação falhou - faltam campos: ', {
                temHorario: !!agendamento.horario,
                temPaciente: !!agendamento.paciente
            });
            return null;
        }

        return agendamento;
    }

    /**
     * Processa múltiplas mensagens de uma vez
     * @param {string} content - Conteúdo com múltiplas mensagens
     * @returns {Array} Array de agendamentos
     */
    parseMultiple(content) {
        if (!content || content.trim() === '') {
            return [];
        }

        let cleanContent = content.replace(/[×•·]/g, ' ').trim();
        const agendamentos = [];
        
        // Divide por "Horário:" como identificador de bloco
        const horariosPattern = /(?=Horário:)/gi;
        const blocos = cleanContent.split(horariosPattern).filter(b => b.trim());
        
        console.log(`📅 Detectados ${blocos.length} blocos de agendamento`);
        
        blocos.forEach((bloco, index) => {
            let blocoCompleto = (index === 0 ? '' : 'Horário:') + bloco;
            blocoCompleto = blocoCompleto.trim();
            
            const linhas = blocoCompleto.split('\n')
                .map(l => l.trim())
                .filter(l => l.length > 0);
            
            const temHorario = linhas.some(l => l.startsWith('Horário:'));
            const temPaciente = linhas.some(l => l.startsWith('Paciente:'));
            
            if (!temHorario || !temPaciente) {
                console.warn(`⚠️ Bloco ${index + 1} ignorado - dados incompletos`);
                return;
            }
            
            const blocoConteudo = linhas.join('\n');
            const agendamento = this.parse(blocoConteudo);
            
            if (agendamento) {
                agendamentos.push(agendamento);
                console.log(`✅ Agendamento ${index + 1} parseado: ${agendamento.horario} - ${agendamento.paciente} (${agendamento.status})`);
            }
        });
        
        console.log(`📊 Total de agendamentos processados: ${agendamentos.length}`);
        return agendamentos;
    }

    /**
     * Formata data para exibição
     * @param {Date} date 
     * @returns {string}
     */
    formatDate(date) {
        if (!(date instanceof Date)) return '';
        
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    /**
     * Formata valor monetário
     * @param {number} valor 
     * @returns {string}
     */
    formatMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    /**
     * Retorna nome do mês
     * @param {number} mes - Número do mês (1-12)
     * @returns {string}
     */
    getNomeMes(mes) {
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return meses[mes - 1] || '';
    }

    /**
     * Extrai especialidade do procedimento
     * @param {string} procedimento 
     * @returns {string}
     */
    extrairEspecialidade(procedimento) {
        if (!procedimento) return 'Não especificado';

        const patterns = [
            { regex: /músculoesquelética/i, nome: 'Fisioterapia Músculoesquelética' },
            { regex: /neurológica/i, nome: 'Fisioterapia Neurológica' },
            { regex: /respiratória/i, nome: 'Fisioterapia Respiratória' },
            { regex: /cardíaca/i, nome: 'Fisioterapia Cardíaca' },
            { regex: /pélvica/i, nome: 'Fisioterapia Pélvica' },
            { regex: /geriátrica/i, nome: 'Fisioterapia Geriátrica' },
            { regex: /pediátrica/i, nome: 'Fisioterapia Pediátrica' },
            { regex: /desportiva/i, nome: 'Fisioterapia Desportiva' },
            { regex: /dermato/i, nome: 'Fisioterapia Dermatofuncional' },
            { regex: /pilates/i, nome: 'Pilates' },
            { regex: /rpg/i, nome: 'RPG' },
            { regex: /acupuntura/i, nome: 'Acupuntura' }
        ];

        for (const pattern of patterns) {
            if (pattern.regex.test(procedimento)) {
                return pattern.nome;
            }
        }

        return 'Fisioterapia Geral';
    }

    /**
     * Valida mensagem antes de processar
     * @param {string} content 
     * @returns {Object} {valido: boolean, erro: string}
     */
    validar(content) {
        if (!content || content.trim() === '') {
            return { valido: false, erro: 'Mensagem vazia' };
        }

        content = content.replace(/[×•·]/g, ' ');

        const temHorario = /horário\s*:/i.test(content);
        const temPaciente = /paciente\s*:/i.test(content);

        if (!temHorario) {
            return { valido: false, erro: 'Campo "Horário" não encontrado' };
        }

        if (!temPaciente) {
            return { valido: false, erro: 'Campo "Paciente" não encontrado' };
        }

        return { valido: true, erro: '' };
    }

    /**
     * Limpa conteúdo de caracteres especiais
     * @param {string} content 
     * @returns {string}
     */
    limparConteudo(content) {
        return content
            .replace(/[×•·]/g, ' ')
            .replace(/\r\n/g, '\n')
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();
    }
}

// Exporta a classe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchedulesParser;
}
