/**
 * STRING-UTILS.JS
 * Funções utilitárias para normalização de strings
 * Garante consistência de dados entre parsers e analyzers
 */

const StringUtils = {
    /**
     * Normaliza nome: trim, lowercase, remove espaços múltiplos
     * @param {string} name - Nome a normalizar
     * @returns {string} Nome normalizado
     */
    normalizeName(name) {
        if (!name || typeof name !== 'string') return '';
        return name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' '); // Remove espaços múltiplos
    },

    /**
     * Normaliza com preservação de capitalização (para exibição)
     * @param {string} name - Nome a normalizar
     * @returns {string} Nome com primeira letra maiúscula
     */
    normalizeNameForDisplay(name) {
        if (!name || typeof name !== 'string') return '';
        const normalized = name.trim();
        return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
    },

    /**
     * Compara dois nomes ignorando caso e espaços
     * @param {string} name1 - Primeiro nome
     * @param {string} name2 - Segundo nome
     * @returns {boolean} True se nomes são equivalentes
     */
    compareNames(name1, name2) {
        return this.normalizeName(name1) === this.normalizeName(name2);
    },

    /**
     * Extrai o primeiro nome (parte antes do espaço)
     * @param {string} name - Nome completo
     * @returns {string} Primeiro nome
     */
    getFirstName(name) {
        if (!name || typeof name !== 'string') return '';
        return name.trim().split(' ')[0];
    }
};

// Exporta para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StringUtils;
}
