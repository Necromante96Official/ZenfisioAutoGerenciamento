/**
 * SYSTEM-INFO.JS
 * Informações oficiais do sistema Zenfisio
 * Alinhado com README.md
 */

const SYSTEM_INFO = {
    // Versão do Sistema
    version: '1.1.2',
    
    // Nome do Sistema
    name: 'Auto Gerenciamento Zenfisio',
    
    // Desenvolvedor Principal
    developer: {
        name: 'GameDev Necromante96Official (Lucas Tavares Mattos)',
        role: 'Full Stack Developer',
        username: 'Necromante96Official'
    },
    
    // Diretora Autorizante
    director: {
        name: 'Fernanda Tambosi Varella',
        role: 'Diretora - ESEFID/UFRGS'
    },
    
    // Instituição Parceira
    institution: {
        name: 'ESEFID/UFRGS - Clínica de Fisioterapia',
        type: 'Clínica de Reabilitação Fisioterapêutica'
    },
    
    // Universidade
    university: {
        name: 'Universidade Federal do Rio Grande do Sul',
        abbreviation: 'UFRGS',
        department: 'Escola de Educação Física, Fisioterapia e Dança'
    },
    
    // Data de Criação
    createdAt: 'Novembro de 2025',
    
    // Descrição
    description: 'Sistema web de gerenciamento automático de dados clínicos, financeiros e administrativos para clínicas de fisioterapia, desenvolvido como projeto profissional voluntário',
    
    // Features/Funcionalidades
    features: [
        'Análise de Evoluções Pendentes',
        'Análise Financeira Avançada',
        'Gerenciamento de Agendamentos',
        'Exportação/Importação de Dados em 3 Formatos',
        'Filtros Avançados por Período/Especialidade/Profissional',
        'Interface Moderna Responsiva com Tema Claro/Escuro',
        'Armazenamento 100% Local (LocalStorage)',
        'Auto-save Automático a cada 10 segundos',
        'LGPD Compliant'
    ],
    
    // Copyright
    copyright: '© 2025 Lucas Tavares. Todos os direitos reservados.',
    
    // License
    license: 'Licença Exclusiva de Uso Colaborativo Profissional',
    
    // Tecnologias
    technologies: {
        frontend: ['HTML5', 'CSS3', 'JavaScript (ES6+)'],
        storage: ['LocalStorage API'],
        dependencies: 'Nenhuma (Vanilla Stack)'
    },
    
    // Status Legal
    status: {
        type: 'Projeto Profissional Voluntário',
        institution_rights: 'Uso exclusivo interno ESEFID/UFRGS',
        developer_rights: 'Propriedade intelectual completa',
        portfolio_inclusion: true,
        compliance: ['LGPD', 'Conselho Federal de Fisioterapia']
    }
};

// Função helper para formatar informações em bloco profissional
function getSystemHeader() {
    return `
╔════════════════════════════════════════════════════════════════════╗
║                AUTO GERENCIAMENTO ZENFISIO                        ║
║                        Sistema v${SYSTEM_INFO.version}                         ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  👨‍💻 Desenvolvido por                                               ║
║     ${SYSTEM_INFO.developer.name}
║     (${SYSTEM_INFO.developer.username})
║                                                                    ║
║  👩‍💼 Direção Autorizante                                            ║
║     ${SYSTEM_INFO.director.name}
║     ${SYSTEM_INFO.director.role}
║                                                                    ║
║  🏥 Instituição Parceira                                          ║
║     ${SYSTEM_INFO.institution.name}
║                                                                    ║
║  🎓 Universidade                                                  ║
║     ${SYSTEM_INFO.university.abbreviation} - ${SYSTEM_INFO.university.name}
║                                                                    ║
║  ${SYSTEM_INFO.copyright}
║                                                                    ║
║  Licença: ${SYSTEM_INFO.license}
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
    `;
}

// Função helper para formatar em Markdown
function getSystemHeaderMarkdown() {
    return `# 🏥 ${SYSTEM_INFO.name} - v${SYSTEM_INFO.version}

## Sistema de Gerenciamento de Dados e Análise Financeira

---

## 👨‍💻 Desenvolvido por
**${SYSTEM_INFO.developer.name}**  
*${SYSTEM_INFO.developer.role}*  
GitHub: [@${SYSTEM_INFO.developer.username}](https://github.com/${SYSTEM_INFO.developer.username})

## 👩‍💼 Autorização e Direção
**${SYSTEM_INFO.director.name}**  
*${SYSTEM_INFO.director.role}*

## 🏥 Instituição Parceira
**${SYSTEM_INFO.institution.name}**  
*${SYSTEM_INFO.institution.type}*

## 🎓 Universidade
**${SYSTEM_INFO.university.abbreviation} - ${SYSTEM_INFO.university.name}**  
${SYSTEM_INFO.university.department}

---

## 📋 Funcionalidades

${SYSTEM_INFO.features.map(f => `- ✅ ${f}`).join('\n')}

---

## 🛠️ Tecnologias

**Frontend:** ${SYSTEM_INFO.technologies.frontend.join(', ')}  
**Storage:** ${SYSTEM_INFO.technologies.storage.join(', ')}  
**Dependências:** ${SYSTEM_INFO.technologies.dependencies}

---

## 📄 Informações Legais

${SYSTEM_INFO.copyright}  
Licença: ${SYSTEM_INFO.license}  
Data de Criação: ${SYSTEM_INFO.createdAt}

---

`;
}

// Função helper para obter HTML formatado profissional
function getSystemHeaderHTML() {
    return `
<div style="
    background: linear-gradient(135deg, #2fbe8f 0%, #1fa070 100%);
    color: white;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
">
    <div style="max-width: 900px; margin: 0 auto;">
        <h1 style="margin: 0 0 0.3rem 0; font-size: 2.2em;">🏥 ${SYSTEM_INFO.name}</h1>
        <p style="margin: 0 0 0.5rem 0; font-size: 0.95em; opacity: 0.95;">v${SYSTEM_INFO.version} • ${SYSTEM_INFO.createdAt}</p>
        
        <hr style="border: none; border-top: 2px solid rgba(255,255,255,0.3); margin: 1rem 0;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; font-size: 0.95em; line-height: 1.8;">
            <div>
                <strong>👨‍💻 Desenvolvedor:</strong><br>
                ${SYSTEM_INFO.developer.name}<br>
                <small style="opacity: 0.9;">${SYSTEM_INFO.developer.role}</small>
            </div>
            <div>
                <strong>👩‍💼 Direção:</strong><br>
                ${SYSTEM_INFO.director.name}<br>
                <small style="opacity: 0.9;">${SYSTEM_INFO.director.role}</small>
            </div>
            <div>
                <strong>🏥 Instituição:</strong><br>
                ${SYSTEM_INFO.institution.name}
            </div>
            <div>
                <strong>🎓 Universidade:</strong><br>
                ${SYSTEM_INFO.university.abbreviation} - ${SYSTEM_INFO.university.name}
            </div>
        </div>
        
        <hr style="border: none; border-top: 2px solid rgba(255,255,255,0.3); margin: 1rem 0;">
        
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.9em;">
            <span>📝 ${SYSTEM_INFO.license}</span>
            <span>📍 ${SYSTEM_INFO.status.type}</span>
            <span>✅ ${SYSTEM_INFO.status.compliance.join(' • ')}</span>
        </div>
        
        <p style="margin: 1rem 0 0 0; font-size: 0.9em; opacity: 0.9;">
            ${SYSTEM_INFO.copyright}
        </p>
    </div>
</div>
    `;
}

// Exporta globalmente
window.SYSTEM_INFO = SYSTEM_INFO;
window.getSystemHeader = getSystemHeader;
window.getSystemHeaderMarkdown = getSystemHeaderMarkdown;
window.getSystemHeaderHTML = getSystemHeaderHTML;


// Função helper para formatar informações
function getSystemHeader() {
    return `
╔════════════════════════════════════════════════════════════════════╗
║                   ZENFISIO AUTO GERENCIAMENTO                    ║
║                        Sistema v${SYSTEM_INFO.version}                         ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Desenvolvido por: ${SYSTEM_INFO.developer.name}
║  ${' '.repeat(18)}(${SYSTEM_INFO.developer.username})
║                                                                    ║
║  Diretora: ${SYSTEM_INFO.director.name}
║  Instituição: ${SYSTEM_INFO.institution.name}
║  Universidade: ${SYSTEM_INFO.university.name}
║                                                                    ║
║  ${SYSTEM_INFO.copyright}
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
    `;
}

// Função helper para formatar em Markdown
function getSystemHeaderMarkdown() {
    return `# 🏥 ${SYSTEM_INFO.name} v${SYSTEM_INFO.version}

## Sistema de Gerenciamento de Dados Clínicos

---

### 👨‍💻 Desenvolvido por
**${SYSTEM_INFO.developer.name}**  
*${SYSTEM_INFO.developer.role}*  
GitHub: [@${SYSTEM_INFO.developer.username}](https://github.com/${SYSTEM_INFO.developer.username})

### 👩‍💼 Direção
**${SYSTEM_INFO.director.name}**  
*${SYSTEM_INFO.director.role}*

### 🏢 Instituição
**${SYSTEM_INFO.institution.name}**  
*${SYSTEM_INFO.institution.type}*

### 🎓 Afiliação Acadêmica
**${SYSTEM_INFO.university.name}**  
${SYSTEM_INFO.university.department}

---

### 📋 Funcionalidades
${SYSTEM_INFO.features.map(f => `- ✅ ${f}`).join('\n')}

---

### 📄 Informações Legais
${SYSTEM_INFO.copyright}  
Licença: ${SYSTEM_INFO.license}

---

`;
}

// Função helper para obter HTML formatado
function getSystemHeaderHTML() {
    return `
<div style="
    background: linear-gradient(135deg, #2fbe8f 0%, #1fa070 100%);
    color: white;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
">
    <div style="max-width: 800px; margin: 0 auto;">
        <h1 style="margin: 0 0 0.5rem 0; font-size: 2em;">🏥 ${SYSTEM_INFO.name}</h1>
        <p style="margin: 0 0 1rem 0; font-size: 1.1em; opacity: 0.95;">v${SYSTEM_INFO.version}</p>
        
        <hr style="border: none; border-top: 2px solid rgba(255,255,255,0.3); margin: 1rem 0;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; font-size: 0.95em;">
            <div>
                <strong>👨‍💻 Desenvolvedor:</strong><br>
                ${SYSTEM_INFO.developer.name}<br>
                <small>${SYSTEM_INFO.developer.role}</small>
            </div>
            <div>
                <strong>👩‍💼 Direção:</strong><br>
                ${SYSTEM_INFO.director.name}<br>
                <small>${SYSTEM_INFO.director.role}</small>
            </div>
            <div>
                <strong>🏢 Instituição:</strong><br>
                ${SYSTEM_INFO.institution.name}
            </div>
            <div>
                <strong>🎓 Universidade:</strong><br>
                ${SYSTEM_INFO.university.name}
            </div>
        </div>
        
        <hr style="border: none; border-top: 2px solid rgba(255,255,255,0.3); margin: 1rem 0;">
        
        <p style="margin: 0; font-size: 0.9em; opacity: 0.9;">
            ${SYSTEM_INFO.copyright}
        </p>
    </div>
</div>
    `;
}

// Exporta globalmente
window.SYSTEM_INFO = SYSTEM_INFO;
window.getSystemHeader = getSystemHeader;
window.getSystemHeaderMarkdown = getSystemHeaderMarkdown;
window.getSystemHeaderHTML = getSystemHeaderHTML;
