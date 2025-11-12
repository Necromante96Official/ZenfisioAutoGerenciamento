/**
 * FILTER-SYSTEM.JS
 * Sistema inteligente de filtragem para Evoluções e Financeiro
 * Filtra por: data, paciente, fisioterapeuta, status, procedimentos, convênio
 */

class FilterSystem {
    constructor(type = 'evolucoes') {
        this.type = type; // 'evolucoes' ou 'financeiro'
        this.activeFilters = {
            data: null,
            dia: null,
            mes: null,
            ano: null,
            paciente: '',
            fisioterapeuta: '',
            status: '',
            procedimentos: '',
            convenio: ''
        };
        this.originalData = [];
        this.filteredData = [];
        this.filterOptions = {
            pacientes: [],
            fisioterapeutas: [],
            status: [],
            procedimentos: [],
            convenios: []
        };
    }

    /**
     * Define dados originais e extrai opções de filtro
     */
    setData(data) {
        if (!Array.isArray(data)) {
            console.warn('FilterSystem.setData: dados não são array', data);
            this.originalData = [];
            this.filteredData = [];
            return;
        }
        this.originalData = JSON.parse(JSON.stringify(data)); // Deep copy
        this.filteredData = JSON.parse(JSON.stringify(data));
        this._extractFilterOptions();
    }

    /**
     * Extrai opções únicas para cada filtro
     * Remove opções vazias ou sem sentido
     */
    _extractFilterOptions() {
        const options = {
            pacientes: new Set(),
            fisioterapeutas: new Set(),
            status: new Set(),
            procedimentos: new Set(),
            convenios: new Set()
        };

        this.originalData.forEach(item => {
            // Extrai apenas valores válidos (não vazios, não undefined)
            if (item.paciente && item.paciente.trim()) {
                options.pacientes.add(item.paciente.trim());
            }
            if (item.fisioterapeuta && item.fisioterapeuta.trim()) {
                options.fisioterapeutas.add(item.fisioterapeuta.trim());
            }
            if (item.status && item.status.trim()) {
                options.status.add(item.status.trim());
            }
            if (item.procedimentos && item.procedimentos.trim()) {
                options.procedimentos.add(item.procedimentos.trim());
            }
            if (item.convenio && item.convenio.trim()) {
                // Categoriza como Particular ou Isento
                const tipo = item.convenio.toLowerCase().includes('isento') ? 'Isento' : 'Particular';
                options.convenios.add(tipo);
            }
        });

        this.filterOptions = {
            pacientes: Array.from(options.pacientes).sort().filter(p => p.length > 0),
            fisioterapeutas: Array.from(options.fisioterapeutas).sort().filter(f => f.length > 0),
            status: Array.from(options.status).sort().filter(s => s.length > 0),
            procedimentos: Array.from(options.procedimentos).sort().filter(p => p.length > 0),
            convenios: Array.from(options.convenios).sort().filter(c => c.length > 0)
        };

        console.log('📋 Filtros extraídos:', this.filterOptions);
    }

    /**
     * Aplica filtro de data (dia/mês/ano independentes)
     */
    setDateFilter(dia = null, mes = null, ano = null) {
        this.activeFilters.dia = dia;
        this.activeFilters.mes = mes;
        this.activeFilters.ano = ano;
        this.applyFilters();
    }

    /**
     * Aplica filtro de texto (paciente, fisioterapeuta, etc)
     */
    setTextFilter(filterType, value) {
        if (this.activeFilters.hasOwnProperty(filterType)) {
            this.activeFilters[filterType] = value.toLowerCase().trim();
            this.applyFilters();
        }
    }

    /**
     * Limpa filtros específicos ou todos
     */
    clearFilter(filterType = null) {
        if (filterType) {
            this.activeFilters[filterType] = filterType.includes('dia') || filterType.includes('mes') || filterType.includes('ano') ? null : '';
        } else {
            this.activeFilters = {
                data: null,
                dia: null,
                mes: null,
                ano: null,
                paciente: '',
                fisioterapeuta: '',
                status: '',
                procedimentos: '',
                convenio: ''
            };
        }
        this.applyFilters();
    }

    /**
     * Aplica todos os filtros ativos
     */
    applyFilters() {
        this.filteredData = this.originalData.filter(item => {
            // Filtro por data (extrai do dataProcessamento format: DD/MM/YYYY)
            if (this.activeFilters.dia !== null || this.activeFilters.mes !== null || this.activeFilters.ano !== null) {
                const dataProcessamento = item.dataProcessamento || '';
                const partes = dataProcessamento.split('/');
                const dia = parseInt(partes[0]);
                const mes = parseInt(partes[1]);
                const ano = parseInt(partes[2]);

                if (this.activeFilters.dia !== null && dia !== this.activeFilters.dia) return false;
                if (this.activeFilters.mes !== null && mes !== this.activeFilters.mes) return false;
                if (this.activeFilters.ano !== null && ano !== this.activeFilters.ano) return false;
            }

            // Filtro por paciente (exato, com dropdown)
            if (this.activeFilters.paciente) {
                if (item.paciente?.toLowerCase() !== this.activeFilters.paciente) {
                    return false;
                }
            }

            // Filtro por fisioterapeuta (exato, com dropdown)
            if (this.activeFilters.fisioterapeuta) {
                if (item.fisioterapeuta?.toLowerCase() !== this.activeFilters.fisioterapeuta) {
                    return false;
                }
            }

            // Filtro por status
            if (this.activeFilters.status && 
                !item.status?.toLowerCase().includes(this.activeFilters.status.toLowerCase())) {
                return false;
            }

            // Filtro por convênio (Particular ou Isento)
            if (this.activeFilters.convenio) {
                const isIsento = item.convenio?.toLowerCase().includes('isento');
                const filterIsento = this.activeFilters.convenio.toLowerCase() === 'isento';
                if (isIsento !== filterIsento) return false;
            }

            return true;
        });

        return this.filteredData;
    }

    /**
     * Retorna dados filtrados
     */
    getFilteredData() {
        return this.filteredData;
    }

    /**
     * Retorna opções disponíveis para filtros
     */
    getFilterOptions() {
        return this.filterOptions;
    }

    /**
     * Retorna filtros ativos
     */
    getActiveFilters() {
        return this.activeFilters;
    }

    /**
     * Retorna estatísticas dos dados filtrados
     */
    getStats() {
        const totalRegistros = this.filteredData.length;
        const totalPagantes = this.filteredData.filter(item => 
            item.convenio && !item.convenio.toLowerCase().includes('isento')
        ).length;
        const totalIsentos = this.filteredData.filter(item => 
            item.convenio && item.convenio.toLowerCase().includes('isento')
        ).length;
        const totalReceita = this.filteredData.reduce((sum, item) => sum + (item.valor || 0), 0);

        return {
            totalRegistros,
            totalPagantes,
            totalIsentos,
            totalReceita: totalReceita.toFixed(2),
            percentualReduzido: ((this.filteredData.length / this.originalData.length) * 100).toFixed(1)
        };
    }
}
