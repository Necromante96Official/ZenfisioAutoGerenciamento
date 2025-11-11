/**
 * HISTÓRICO DE ATUALIZAÇÕES
 * Gerencia a exibição e interatividade do modal de histórico de versões
 */

class HistoryManager {
    constructor() {
        this.historyModal = document.getElementById('historyModal');
        this.historyContent = document.getElementById('historyContent');
        this.closeHistoryBtn = document.getElementById('closeHistory');
        this.versionBadge = document.querySelector('.version-badge');
        this.versions = this.getVersions();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderVersions();
    }

    setupEventListeners() {
        // Abrir histórico ao clicar na versão
        if (this.versionBadge) {
            this.versionBadge.addEventListener('click', () => this.openHistory());
        }

        // Fechar histórico
        this.closeHistoryBtn.addEventListener('click', () => this.closeHistory());

        // Fechar ao clicar fora
        this.historyModal.addEventListener('click', (e) => {
            if (e.target === this.historyModal) {
                this.closeHistory();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.historyModal.classList.contains('active')) {
                this.closeHistory();
            }
        });
    }

    getVersions() {
        return [
            {
                version: '1.0.0.7',
                date: '11 de novembro de 2025',
                title: 'Export/Import v2 Completo + Melhorias Finais',
                features: [
                    'Exportação/Importação Manager v2 com 3 formatos suportados',
                    'Formato JSON para importação técnica estruturada',
                    'Formato TXT para relatórios legíveis em qualquer editor',
                    'Formato Markdown para documentação profissional formatada',
                    'Modal visual para seleção interativa de formato',
                    'Coleta abrangente de dados de TODAS as páginas e abas',
                    'Serialização inteligente com suporte a Maps e objetos complexos',
                    'Importação com restauração completa de dados',
                    'Sincronização automática de UI após importação',
                    'Recarregamento de página após 2.5s da importação',
                    'Metadados completos em cada backup (data, versão, navegador, resolução)',
                    'Resumo estatístico quantitativo no backup',
                    'Timestamp em nomenclatura: zenfisio_backup_YYYY-MM-DD_HH-MM-SS.ext',
                    'Log detalhado com timestamps de todas as operações',
                    'Validação robusta com try-catch em todas as operações',
                    'Detecção correta de DOM readyState no inicialização',
                    'Suporte a formato procedure completo com especialidade e frequência',
                    'Procedimentos exibem nome correto em Especialidades, Registros e Pacientes',
                    'Função formatarProcedimento() com regex para extração de frequência',
                    'Sistema de notificações sem duplicação de ícones',
                    'Remoção de emojis de mensagens (5 instâncias eliminadas)',
                    'Filtro modal operacional e responsivo em análise financeira',
                    'Arquivo obsoleto export-import-manager.js removido'
                ],
                description: 'Sétima versão com sistema completo de backup v2! Suporte a 3 formatos (JSON/TXT/MD) com interface visual para seleção. Captura todos os dados de todas as páginas com serialização inteligente. Importação restaura completamente dados e sincroniza UI. Correções de procedimentos e notificações finalizadas.',
                improvements: [
                    'Exportação multiformat - JSON estruturado, TXT legível, Markdown profissional',
                    'Modal visual com 3 botões - escolha intuitiva de formato',
                    'Coleta abrangente - evoluções, financeiro, metadados, resumo estatístico',
                    'Serialização robusta - suporta Maps, Dates, objetos complexos',
                    'Importação completa - restaura dados e sincroniza todas as UIs',
                    'Metadados ricos - data, versão, navegador, resolução, timestamp',
                    'Resumo quantitativo - totais de registros, pacientes, financeiro',
                    'Nomenclatura com timestamp - rastreamento perfeito de backups múltiplos',
                    'Detecta DOM readyState - resolve problema de botões não responsivos',
                    'Procedimentos formatados - nome completo com especialidade e frequência',
                    'Notificações sem duplicação - remove emojis de mensagens, sistema adiciona ícones',
                    'Filtro modal funcional - abas flutuantes operacionais em financeiro',
                    'Código limpo - sem arquivos obsoletos, estrutura modular',
                    'Log detalhado - debugging facilitado com timestamps em cada operação',
                    'Validação robusta - try-catch em todas as operações críticas',
                    'Sincronização perfeita - UI recarrega e mostra dados importados',
                    'Auto-save mantido - 10 segundos com gravação consolidada',
                    'Zero erros de compilação - validação passa em todos os arquivos',
                    'Performance otimizada - sem renderizações duplicadas',
                    'Pronto para produção - todas as features testadas e validadas'
                ]
            },
            {
                version: '1.0.0.6',
                date: '11 de novembro de 2025',
                title: 'Sistema de Limpeza Independente & Melhorias de Interface',
                features: [
                    'Botão "🗑️ Limpar Evoluções" com limpeza seletiva de Evoluções',
                    'Botão "🗑️ Limpar Financeiro" com limpeza seletiva de Financeiro',
                    'Cada botão limpa APENAS seu módulo (dados da outra aba mantidos)',
                    'Dialog de confirmação específico para cada tipo de limpeza',
                    'Novo arquivo clear-data-manager.js gerenciador de limpeza',
                    'IDs únicos para cada botão: clearEvolucoesDataBtn e clearFinanceiroDataBtn',
                    'Dados agora ACUMULAM ao processar múltiplas vezes',
                    'Remoção de limpeza automática que causava perda de dados',
                    'Botão "Filtrar" centralizado com abas em Financeiro',
                    'Abas de navegação (Por Data, Especialidades, etc) centralizadas',
                    'Botão "Filtrar" posicionado à esquerda, isolado dos botões de limpeza',
                    'Layout mais intuitivo e equilibrado em Financeiro',
                    'Console.logs detalhados no render de dados financeiros',
                    'Validação robusta de dados em _generateHTML()',
                    '_attachEventListeners() implementada com event delegation',
                    'Tratamento de valores undefined/null em _formatValue()',
                    'Contêiner filter-container-financeiro removido',
                    'Event listeners conectados corretamente ao botão',
                    'Dados financeiros renderizados corretamente após processamento',
                    'Notificações de sucesso/erro ao limpar dados'
                ],
                description: 'Sexta versão com sistema completo de limpeza independente por módulo! Cada aba agora tem seu próprio botão de limpeza que afeta apenas seus dados. Interface de Análise Financeira completamente reduzida com botão centralizado e abas organizadas. Dados agora acumulam corretamente sem limpeza automática.',
                improvements: [
                    'Sistema de limpeza 100% independente - sem efeitos colaterais',
                    'Dois botões com IDs únicos - clareza total sobre ação',
                    'Confirmação específica por módulo - melhor segurança',
                    'Dados acumulam naturalmente - múltiplos processamentos mantêm tudo',
                    'Interface Financeiro mais limpa - menos poluição visual',
                    'Botão Filtrar agora único e bem posicionado (esquerda)',
                    'Abas centralizadas - foco visual no conteúdo principal',
                    'Layout responsivo mantido em todos os breakpoints',
                    'Console.logs para debug facilitado em produção',
                    'Validação robusta previne erros de renderização',
                    'Event delegation em place para botões dinâmicos',
                    'Tratamento seguro de valores monetários (null/undefined)',
                    'CSS organizado com nova classe financial-tabs-container',
                    'Transições suaves mantidas em todas as interações',
                    'Compatibilidade total com versão anterior',
                    'Código limpo e modular para futuras expansões',
                    'Sem dependências externas adicionadas',
                    'Performance otimizada em todas as operações',
                    'UX profissional em ambas as abas',
                    'Documentação completa em CHANGELOG.md e README.md'
                ]
            },
            {
                version: '1.0.0.5',
                date: '10 de novembro de 2025',
                title: 'Integração Completa: Análise Financeira + Notificações Cascata',
                features: [
                    'Integração automática entre Evoluções e Análise Financeira',
                    'Processamento simultâneo de dados de ambos os módulos',
                    'Sistema de notificações com cascata visual (50ms stagger)',
                    'Notificações flexbox com gap: 12px para melhor espaçamento',
                    'Animação de delay progressivo em notificações',
                    'Módulo Financeiro renderizado dinamicamente no DOM',
                    'Cards flutuantes com cards de análise expandidos',
                    'FinancialAnalyzer sem dupla filtragem de registros',
                    'Modo silencioso para FinancialIntegration (sem notificação dupla)',
                    'Data picker integrada em evoluções e financeiro',
                    'Try-catch em ambos os saveData para robustez',
                    'Cronologia com data correta do date picker',
                    'Método getEvolucoes() adicionado ao EvolucoesAnalyzer',
                    'Suporte a export/import de dados financeiros',
                    'Análise por especialidade com formatação monetária',
                    'Análise por profissional com pacientes únicos',
                    'Análise por paciente (isentos vs particulares)'
                ],
                description: 'Quinta versão com integração completa do módulo financeiro! Sistema de notificações agora cascata com animação progressiva de 50ms entre cada uma. Análise Financeira totalmente funcional com 3 abas (Especialidades, Profissionais, Pacientes). Ambos os módulos trabalham em harmonia sem duplicação de notificações.',
                improvements: [
                    'Notificações cascata elegante - cada uma aparece 50ms após anterior',
                    'Sem duplicação de notificações ao processar dados',
                    'FinancialIntegration modo silencioso quando chamada por Evoluções',
                    'Análise Financeira renderiza automaticamente após processar',
                    'Cards financeiros com cards de resumo destacados em amarelo',
                    'Análise por especialidade mostra receita total por tipo',
                    'Análise por profissional com pacientes únicos e especialidades',
                    'Análise por paciente separada: isentos vs particulares',
                    'Formatação de valores monetários pt-BR (R$ X,XX)',
                    'Try-catch em ambas as integrações para robustez máxima',
                    'Data picker aplicada antes de processar financeiro',
                    'Registro de dados automático sem erros de save interromperem fluxo',
                    'getEvolucoes() permite que DataManager acesse análises',
                    'Integração com dateManager para datas consistentes',
                    'Sistema modular permite futuras expansões sem conflitos',
                    'UX fluida - usuário vê tudo acontecer em tempo real',
                    'Performance otimizada com processamento paralelo',
                    'Dados persistem via localStorage (auto-save 30s)',
                    'Export/Import funciona com ambos os tipos de análise',
                    'Interface completa e profissional para operações clínicas'
                ]
            },
            {
                version: '1.0.0.4',
                date: '10 de novembro de 2025',
                title: 'Melhorias de Cards Flutuantes & Layout Horizontal',
                features: [
                    'Cards flutuantes redesenhados com dimensões aumentadas (max-width 1000px)',
                    'Altura otimizada para 90vh com centralização perfeita na tela',
                    'Grid de estatísticas em 3 colunas para melhor visualização',
                    'Data em formato pt-br (seg, 10 de novembro de 2025 10:24:45)',
                    'Body travado ao abrir cards (overflow: hidden)',
                    'Procedimentos com layout responsivo (word-wrap: break-word)',
                    'Lista de pacientes/profissionais em grid multi-coluna',
                    'Histórico de atendimentos em grid responsivo',
                    'Seções com background #f8f9fa e border-left verde',
                    'Posicionamento centralizado no lado direito da tela',
                    'Border-radius 16px em todos os lados (não apenas top)',
                    'Melhor responsividade para tablets (768px) e mobile (480px)',
                    'Altura de 95vh em tablets para máximo aproveitamento',
                    'Padding dinâmico no header para não cortar títulos',
                    'Renomeação: "Pacientes Únicos" → "Total de Pacientes"',
                    'Z-index 9999 para floating cards acima de tudo'
                ],
                description: 'Quarta versão com redesign completo dos cards flutuantes. Dimensões aumentadas para melhor visualização horizontal, formatação de data em português brasileiro, e layout otimizado para não cortar informações. Cards agora mais profissionais e totalmente responsivos em todos os dispositivos.',
                improvements: [
                    'Cards 42% mais largos (700px → 1000px max-width)',
                    'Altura aumentada em 12.5% (80vh → 90vh)',
                    'Cenário visual mais amplo - menos rolagem necessária',
                    'Data com timezone de Brasília em português claro',
                    'Grid 3-coluna para estatísticas - visualização imediata',
                    'Procedimentos visíveis sem truncamento de texto',
                    'Pacientes/profissionais em layout multi-coluna fluído',
                    'Body travado previne scroll acidental durante uso de cards',
                    'Posicionamento centralizado evita corte nas laterais',
                    'Responsividade mantida em todos os breakpoints',
                    'Transições suaves com animações sincronizadas',
                    'Acessibilidade melhorada com melhor contraste',
                    'Nomeação intuitiva dos campos (Total de Pacientes)',
                    'Consistência entre cards de pacientes e fisioterapeutas',
                    'Performance otimizada sem renderizações extra',
                    'UX profissional com detalhes polidos'
                ]
            },
            {
                version: '1.0.0.3',
                date: '10 de novembro de 2025',
                title: 'Melhorias de UI/UX & Correções de Tema',
                features: [
                    'Header responsivo ao tema claro/escuro sem erros de renderização',
                    'Reparação completa do histórico de versões com navegação fluida',
                    'Scroll suave em navegação de abas com scrollbar customizado',
                    'Scroll elegante no conteúdo do histórico com feedback visual',
                    'Animações suaves ao trocar versões (opacity + transform)',
                    'Fixação de CSS para empty-state com centralização perfeita',
                    'Versão de tema reconhecida no header footer superior',
                    'Overflow corrigido para exibição completa de conteúdo',
                    'Min-height: 0 implementado para flex layout correto',
                    'Transições suaves sincronizadas em toda a interface',
                    'Scrollbar nativa customizada com cores Zenfisio',
                    'Webkit overflow-scrolling para experiência mobile otimizada',
                    'Seletor CSS precisado em .version-card para renderização estável',
                    'Scroll into view suave ao mudar de versão no histórico',
                    'Layout responsivo mantido em todas as quebras de tela'
                ],
                description: 'Terceira versão focada em correções críticas de tema e melhorias significativas de UX. Header agora responde corretamente ao tema claro, histórico de versões funciona perfeitamente com animações suaves, e scrollbars foram customizadas para melhor experiência visual com paleta Zenfisio.',
                improvements: [
                    'Interface 100% funcional em tema claro - header não fica mais preso no escuro',
                    'Histórico sem bugs - todas as 3 versões acessíveis com navegação fluida',
                    'Scroll não-intrusivo - horizontal suave com scrollbar de 4px altura',
                    'Conteúdo visível - vertical suave com scrollbar de 6px largura',
                    'Transições elegantes - opacity 0-1 com transform suave ao trocar versão',
                    'CSS flexbox otimizado - min-height: 0 em containers de scroll',
                    'Empty-state profissional - texto centralizado sem quebras de linha',
                    'Seletor CSS específico - .version-card[data-version] evita conflitos',
                    'Animações sincronizadas - 0.3s ease-out para suavidade consistente',
                    'Scrollbar nativa customizada - feedback visual do scroll Zenfisio',
                    'Mobile-first - webkit-overflow-scrolling para performance em iOS',
                    'Acessibilidade preservada - todas as interações mantêm funcionalidade',
                    'Performance otimizada - sem renderizações duplicadas ou flashs',
                    'Compatibilidade mantida - dark/light theme responsivo',
                    'Experiência do usuário refinada - interface fluida e profissional'
                ]
            },
            {
                version: '1.0.0.2',
                date: '10 de novembro de 2025',
                title: 'Sistema de Evoluções Pendentes + Limpeza',
                features: [
                    'Sistema completo de Evoluções Pendentes com 4 abas',
                    'Aba Visão Geral com 2 colunas (Pacientes | Fisioterapeutas)',
                    'Aba Pacientes com cards animados e expandíveis',
                    'Aba Fisioterapeutas com list completa de atendimentos',
                    'Aba Cronologia com timeline agrupada por data',
                    'Parser de dados com extração automática de campos',
                    'Filtro crítico: "Presença confirmada" (dados válidos)',
                    'Agregação de dados por paciente/fisioterapeuta/data',
                    'Estatísticas automáticas do período',
                    'Exportação de dados em JSON',
                    'CSS evolucoes-tabs.css com 400+ linhas de estilos',
                    'Animações progressivas em cards (delays de 50ms)',
                    'Badges com contadores de atendimentos',
                    'Botão "Mais detalhes" com expand/collapse suave',
                    'Responsividade completa (desktop/tablet/mobile)',
                    'Remoção de todos os arquivos de documentação'
                ],
                description: 'Segunda versão com implementação do sistema de Evoluções Pendentes. Adição de 4 abas interativas para análise de dados de atendimentos, com parser robusto, filtro de status crítico e agregações automáticas. Limpeza completa de documentação, focando apenas em código funcional.',
                improvements: [
                    'Interface profissional com 4 abas independentes',
                    'Análise de dados em tempo real com múltiplas visualizações',
                    'Parser robusto extrai dados de formato livre',
                    'Filtro crítico garante integridade de dados',
                    'Cards expandíveis permitem exploração detalhada',
                    'Timeline visual facilita análise cronológica',
                    'Responsividade perfeita em todos os dispositivos',
                    'Animações fluidas melhoram UX sem poluição visual',
                    'Código modular facilita futuras expansões (Análise Financeira)',
                    'Sistema pronto para integração com ZenFisio API',
                    'Codebase limpo sem documentação desnecessária',
                    'Desempenho otimizado sem renderizações duplicadas'
                ]
            },
            {
                version: '1.0.0.1',
                date: '10 de novembro de 2025',
                title: 'Aprimoramentos de Interface & Acessibilidade',
                features: [
                    'Esquema de cores verde Zenfisio em todo o sistema',
                    'Layout horizontal aprimorado de modais (max-width 1000px)',
                    'Cards de termos com funcionalidade expandível/colapsável',
                    'Conteúdo de termos reescrito em linguagem profissional',
                    'Título "Evoluções Pendentes" centralizado e animado',
                    'Animações fluidas sincronizadas com logo "Auto Gerenciamento"',
                    'Gradiente de texto nos títulos (verde Zenfisio)',
                    'Neon verde sutil atrás de títulos (sem ofuscação)',
                    'Modal histórico com layout 2-column mais horizontal',
                    'Botão de versão (📦) com animação shine sutilizada',
                    'Cards de termos com grid layout (icon + conteúdo)',
                    'Icons maiores (1.4rem) nos cards de termos',
                    'Expand/collapse com ícone animado (▼)',
                    'Pulso sutil e harmônico nos títulos (2.5s)',
                    'Redução de padding em card-header (1.5rem → 1rem)',
                    'Opacidade reduzida do neon background'
                ],
                description: 'Primeira revisão focada em refinamento visual e profissionalismo. Implementação de layout horizontal mais eficiente, tema verde Zenfisio completo, cards expandíveis nos termos e sincronização de animações com o logo do sistema.',
                improvements: [
                    'Interface 100% verde Zenfisio (#2fbe8f) - redução de poluição visual',
                    'Modais mais horizontais (600px → 900-1000px max-width)',
                    'Conteúdo de termos agora com contexto profissional completo',
                    'Cards de termos expandíveis para melhor organização',
                    'Animações sincronizadas (slideDown, pulse-subtle)',
                    'Neon background com opacidade reduzida (0.15 → 0.08)',
                    'Hierarquia visual clara com títulos gradiente',
                    'Espaçamento otimizado (padding 1.5rem → 1rem)',
                    'Acessibilidade melhorada (dark/light theme)',
                    'Profissionalismo aumentado em documentação de termos',
                    'UX melhorada com expand/collapse intuitivo',
                    'Animações mais sutis e focadas (evita fadiga visual)'
                ]
            },
            {
                version: '1.0.0.0',
                date: '10 de novembro de 2025',
                title: 'Lançamento Inicial',
                features: [
                    'Dashboard moderno com interface dark/light',
                    'Sistema de tema claro e escuro com persistência',
                    'Controles de data avançados (navegação mensal e diária)',
                    'Processamento e análise de evoluções pendentes',
                    'Design responsivo para mobile, tablet e desktop',
                    'Animações fluidas e transições suaves',
                    'Modal de termos com conteúdo detalhado',
                    'Sistema de feedback visual (notificações)',
                    'Arquitetura modular com 6 módulos JavaScript',
                    'Efeitos neon animados no background',
                    'Cards com hover effects e gradientes',
                    'Sistema de botões com ripple effect',
                    'Footer profissional com informações do sistema',
                    'Validação de dados em tempo real',
                    'API de integração com backend Python'
                ],
                description: 'Lançamento da versão inicial do Auto Gerenciamento - Zenfisio Manager. Sistema completo para análise de dados de fisioterapia com interface moderna e funcionalidades avançadas de processamento.',
                improvements: [
                    'Interface intuitiva e fácil de usar para equipe clínica',
                    'Tema dark como padrão para reduzir fadiga visual',
                    'Sistema de cores bem definido (azul primário, sucesso verde, alerta amarelo)',
                    'Transições suaves (150ms-500ms) para melhor UX',
                    'Suporte a acessibilidade (prefers-reduced-motion)',
                    'Estrutura HTML semântica para melhor SEO'
                ]
            }
        ];
    }

    renderVersions() {
        // Renderizar versões com abas para melhor visualização
        const tabsHTML = this.versions.map((v, i) => 
            `<button class="version-tab ${i === 0 ? 'active' : ''}" data-version="${v.version}">v${v.version}</button>`
        ).join('');
        
        const cardsHTML = this.versions.map((version, index) => {
            const featuresHTML = version.features.map(f => `<li class="version-feature">${f}</li>`).join('');
            const improvementsHTML = version.improvements.map(i => `<li class="version-improvement">${i}</li>`).join('');
            
            return `
                <div class="version-card ${index === 0 ? 'active' : ''}" data-version="${version.version}" style="display: ${index === 0 ? 'block' : 'none'};">
                    <div class="version-header-compact">
                        <div class="version-title-compact">${version.title}</div>
                        <div class="version-date-compact">${version.date}</div>
                    </div>
                    
                    <div class="version-content-scroll">
                        <p class="version-description">${version.description}</p>
                        
                        <div class="features-section">
                            <h4 class="section-title">✨ Funcionalidades</h4>
                            <ul class="features-list">
                                ${featuresHTML}
                            </ul>
                        </div>
                        
                        <div class="improvements-section">
                            <h4 class="section-title">🎯 Melhorias</h4>
                            <ul class="improvements-list">
                                ${improvementsHTML}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.historyContent.innerHTML = `
            <div class="history-tabs-container">
                <div class="version-tabs">
                    ${tabsHTML}
                </div>
                <div class="version-cards-container">
                    ${cardsHTML}
                </div>
            </div>
        `;
        
        // Adicionar event listeners aos tabs
        this.setupVersionTabs();
    }

    setupVersionTabs() {
        const tabs = this.historyContent.querySelectorAll('.version-tab');
        const cards = this.historyContent.querySelectorAll('.version-card');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const version = tab.getAttribute('data-version');
                
                // Remove active de todos
                tabs.forEach(t => t.classList.remove('active'));
                cards.forEach(c => {
                    c.classList.remove('active');
                    c.style.display = 'none';
                });
                
                // Ativa selecionado
                tab.classList.add('active');
                const activeCard = this.historyContent.querySelector(`.version-card[data-version="${version}"]`);
                if (activeCard) {
                    activeCard.classList.add('active');
                    activeCard.style.display = 'block';
                    // Scroll suave para o topo
                    activeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    openHistory() {
        this.historyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeHistory() {
        this.historyModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new HistoryManager();
});
