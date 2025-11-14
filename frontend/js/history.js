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
                version: '1.1.3',
                date: 'Novembro de 2025',
                title: 'Sistema Unificado de Filtros Avançados',
                description: 'Sistema completo de filtros para TODAS as páginas! Agora você tem um botão roxo bonito no topo (🔍 Filtros) que abre um modal extenso com 3 abas - uma para cada módulo. Filtre por data (dia, semana, 15 dias, mês, ano), por pessoa, por valores, e muito mais. Os dados continuam salvos - os filtros só mudam a visualização!',
                features: [
                    'Botão Global de Filtros - roxo no header, funciona em todas as páginas',
                    'Modal com 3 Abas - Evoluções, Financeiro e Agendamentos (cada uma com seus filtros)',
                    'Filtros de Período Rápido - botões para Dia, Semana (Seg-Sex), 15 Dias, Mês e Ano',
                    'Agendamentos: Filtra por data, status (compareceu/faltou), fisioterapeuta, paciente',
                    'Evoluções: Filtra por dia/mês/ano, paciente e fisioterapeuta',
                    'Financeiro: Filtra por data, faixa de valores (R$ mín/máx), profissional e convênio',
                    'Intervalo de Datas - escolhe data início e data fim para períodos personalizados',
                    'Dados Preservados - filtros não apagam nada, só mostram o que você quer ver',
                    'Botão Limpar Filtros - volta a mostrar todos os dados com 1 clique',
                    'Modal Extenso - 800px de largura, bem organizado e fácil de usar'
                ],
                improvements: [
                    'Sistema detecta automaticamente qual página você está e abre a aba certa',
                    'Filtros funcionam em tempo real - aplica e vê resultado na hora',
                    'Busca inteligente - não precisa escrever o nome completo',
                    'Combina vários filtros ao mesmo tempo',
                    'Interface moderna com gradiente roxo no botão',
                    'Totalmente responsivo - funciona perfeito em celular',
                    'Animações suaves ao abrir e trocar de abas',
                    'Dados acumulativos corrigidos - agendamentos somam ao invés de substituir',
                    'Data correta mantida - cada registro mantém a data que foi enviado',
                    'Cálculo de dias úteis (Seg-Sex) para períodos de trabalho'
                ]
            },
            {
                version: '1.1.2',
                date: 'Novembro de 2025',
                title: 'Sistema de Cores e Modais Padronizados',
                description: 'Deixamos todos os modais (janelas que abrem) com a mesma aparência! Agora os 3 modais principais têm cores padronizadas, botão X sempre no mesmo lugar, e tudo fica mais fácil de ler. Verde Zenfisio (#2fbe8f) em destaque e tema escuro confortável para os olhos.',
                features: [
                    '3 Modais Iguais - Agendamentos, Detalhes do Paciente e Cards Flutuantes todos com mesmo visual',
                    'Layout Horizontal - aproveita melhor o espaço da tela, mais conteúdo visível',
                    'Cores Padronizadas - verde Zenfisio, cinza escuro para fundo, texto branco fácil de ler',
                    'Botão X no Lugar Certo - sempre no canto superior direito para fechar',
                    'Grid de 2 Colunas - informações organizadas lado a lado',
                    'Tema Escuro Confortável - não cansa os olhos'
                ],
                improvements: [
                    'Texto sempre visível e fácil de ler',
                    'Botão X bem grande e fácil de clicar',
                    'Modais centralizados na tela',
                    'Fundo escurecido atrás dos modais',
                    'Funciona bem em celular, tablet e computador',
                    'Visual profissional e organizado'
                ]
            },
            {
                version: '1.1.0',
                date: 'Novembro de 2025',
                title: 'Novo Módulo Agendamentos',
                description: 'Agora você tem um módulo completo para ver agendamentos! Visualize quem compareceu, quem faltou, e tenha controle total. Também adicionamos botão "Limpar Tudo" que apaga dados de todos os módulos de uma vez, e melhoramos o modal "Como Usar" com 8 passos bem explicados.',
                features: [
                    'Módulo Agendamentos Completo - veja todos os agendamentos organizados',
                    'Cards de Agendamentos - mostra quem compareceu e quem faltou',
                    'Botão Limpar Tudo - apaga dados de todos os módulos de uma vez',
                    'Confirmação de Segurança - pergunta antes de apagar tudo',
                    'Página Recarrega Sozinha - depois de limpar, já fica pronto para usar',
                    'Layout Horizontal - aproveita toda a tela sem espaços vazios',
                    'Modal Como Usar Melhorado - 8 passos bem explicados',
                    'Caixas Coloridas - Verde (dicas), Vermelho (avisos), Azul (informações), Amarelo (ajuda)'
                ],
                improvements: [
                    'Agora tem 3 módulos: Evoluções, Financeiro e Agendamentos',
                    'Controle total dos seus dados com botão centralizado',
                    'Interface mais limpa e organizada',
                    'Qualquer pessoa consegue entender como usar',
                    'Visual mais profissional e moderno',
                    'Funciona em celular, tablet e computador',
                    'Dados protegidos - só apaga se você confirmar',
                    'Tudo rápido e sem travamentos'
                ]
            },
            {
                version: '1.0.9',
                date: 'Novembro de 2025',
                title: 'Memória de Posição + Filtros Avançados',
                description: 'O sistema agora lembra onde você estava! Quando os dados atualizam sozinhos (a cada 60 segundos), você não perde sua posição na tela. Filtros rápidos em especialidades (Particulares/Isentos) e 7 filtros diferentes nas colunas dos registros para você encontrar exatamente o que procura.',
                features: [
                    'Memória de Posição - sistema lembra qual aba você estava, onde estava rolando e quais filtros aplicou',
                    'Funciona com Atualização Automática - não perde posição quando atualiza sozinho',
                    'Filtros em Especialidades - [📊 Todos] [💳 Particulares] [🛡️ Isentos]',
                    'Filtros Avançados - 7 filtros nas colunas: Data, Horário, Fisioterapeuta, Paciente, Convênio, Procedimento',
                    'Dropdown de Filtros - clique em "🔎 Filtros Avançados" para abrir',
                    'Combinar Filtros - use vários filtros ao mesmo tempo',
                    'Botão Limpar Filtros - clique em "✨ Limpar Filtros" para resetar tudo'
                ],
                improvements: [
                    'Você não perde o lugar quando a página atualiza',
                    'Filtros rápidos para análise por tipo',
                    '7 formas diferentes de filtrar informações',
                    'Interface limpa - filtros só aparecem quando precisa',
                    'Seus filtros ficam salvos mesmo atualizando',
                    'Rápido e sem travamentos',
                    'Funciona em todos os navegadores e dispositivos'
                ]
            },
            {
                version: '1.0.8',
                date: 'Novembro de 2025',
                title: 'Sincronização Automática + Botão de Atualizar',
                description: 'Seus dados agora atualizam sozinhos a cada 60 segundos (1 minuto)! Não precisa fazer nada - o sistema recarrega e processa tudo automaticamente. Também tem um botão verde bonito (🔄) no topo da tela para você atualizar na hora quando quiser.',
                features: [
                    'Atualização Automática - a cada 60 segundos os dados recarregam sozinhos',
                    'Botão de Atualizar - clique no 🔄 verde para atualizar na hora',
                    'Animação no Botão - gira e brilha quando está atualizando',
                    'Notificação Visual - aparece mensagem quando atualiza com sucesso',
                    'Funciona em Segundo Plano - você pode continuar usando enquanto atualiza'
                ],
                improvements: [
                    'Dados sempre frescos e atualizados',
                    'Botão bonito e fácil de ver',
                    'Você não perde o que estava fazendo',
                    'Mensagens avisam quando atualizou',
                    'Rápido - atualiza em segundos',
                    'Funciona com tema claro e escuro'
                ]
            },
            {
                version: '1.0.7',
                date: 'Novembro de 2025',
                title: 'Sistema de Backup Completo',
                description: 'Agora você pode salvar TODOS os seus dados! Escolha entre 3 formatos diferentes: JSON (para técnicos), TXT (fácil de ler) ou Markdown (bem formatado). Depois pode importar de volta e recuperar tudo como estava. O arquivo vem com data e hora no nome para você saber quando foi salvo.',
                features: [
                    'Salvar em 3 Formatos - JSON, TXT ou Markdown',
                    'Botões Visuais - clique no formato que preferir',
                    'Salva Tudo - evoluções, financeiro, tudo junto',
                    'Importar Backups - restaura exatamente como estava',
                    'Nome com Data/Hora - sabe quando foi salvo (ex: zenfisio_backup_14-11-2025_15-30.json)',
                    'Resumo no Arquivo - mostra quantos registros foram salvos',
                    'Página Atualiza Sozinha - depois de importar já fica pronto para usar'
                ],
                improvements: [
                    'Seus dados ficam seguros - pode fazer backup quando quiser',
                    'Escolhe o formato que é melhor para você',
                    'Recupera tudo sem perder nada',
                    'Nome do arquivo bem organizado',
                    'Vê o que tem dentro do backup antes de abrir',
                    'Rápido e fácil de usar',
                    'Protege contra erros - avisa se algo der errado'
                ]
            },
            {
                version: '1.0.6',
                date: 'Novembro de 2025',
                title: 'Limpeza Independente por Módulo',
                description: 'Cada módulo agora tem seu próprio botão de limpeza! Pode apagar só as Evoluções ou só os dados Financeiros - cada um tem seu botão separado. Seus dados acumulam quando você processa várias vezes, não apaga mais sozinho.',
                features: [
                    'Botão Limpar Evoluções - apaga SÓ as evoluções dos pacientes',
                    'Botão Limpar Financeiro - apaga SÓ os dados financeiros',
                    'Confirmação Antes de Apagar - pergunta se tem certeza antes',
                    'Dados Acumulam - processa várias vezes e guarda tudo',
                    'Botão Filtrar Organizado - ficou melhor posicionado na tela'
                ],
                improvements: [
                    'Cada módulo tem seu próprio controle',
                    'Você escolhe exatamente o que quer apagar',
                    'Segurança - confirma antes de deletar',
                    'Dados não somem mais sozinhos',
                    'Interface mais limpa e organizada',
                    'Funciona rápido e sem erros'
                ]
            },
            {
                version: '1.0.5',
                date: 'Outubro de 2025',
                title: 'Integração Financeira Automática',
                description: 'O módulo Financeiro agora funciona junto com as Evoluções! Quando você processa dados, ambos os módulos trabalham juntos automaticamente. As notificações aparecem uma de cada vez com animação bonita (não tudo junto de uma vez).',
                features: [
                    'Integração Automática - Evoluções e Financeiro trabalham juntos',
                    'Notificações em Cascata - aparecem uma após a outra',
                    'Análise Financeira Completa - vê receita por especialidade, profissional e paciente',
                    'Cards com Resumo - informações importantes em destaque',
                    'Valores em Reais - mostra R$ com formatação brasileira correta'
                ],
                improvements: [
                    'Dois módulos funcionam juntos sem confusão',
                    'Notificações organizadas - não aparecem todas ao mesmo tempo',
                    'Análise completa de ganhos e receitas',
                    'Visual profissional com informações destacadas',
                    'Dados salvam automaticamente',
                    'Rápido e eficiente'
                ]
            },
            {
                version: '1.0.4',
                date: 'Outubro de 2025',
                title: 'Cards Flutuantes Melhorados',
                description: 'Os cards que aparecem com informações ficaram maiores e melhores! Agora ocupam mais espaço na tela, têm 3 colunas de informações lado a lado, e a data aparece completa em português. A página não rola quando o card está aberto, evitando confusão.',
                features: [
                    'Cards Maiores - muito mais espaço para ver informações',
                    'Layout Horizontal - 3 colunas de estatísticas lado a lado',
                    'Data em Português - data e hora completa no formato brasileiro',
                    'Página Não Rola - quando o card está aberto, a página fica parada',
                    'Funciona em Todos os Dispositivos - computador, tablet e celular'
                ],
                improvements: [
                    'Melhor visualização de informações',
                    'Texto não é cortado',
                    'Fácil de ler',
                    'Design profissional',
                    'Cores harmônicas',
                    'Funciona perfeitamente em qualquer tela'
                ]
            },
            {
                version: '1.0.3',
                date: 'Outubro de 2025',
                title: 'Melhorias Visuais e de Tema',
                description: 'Correções importantes na aparência do sistema! O header (topo da tela) agora funciona perfeitamente em tema claro e escuro. O histórico de versões foi corrigido e funciona com animações suaves. As barras de rolagem ganharam as cores verde Zenfisio.',
                features: [
                    'Header Corrigido - funciona bem em tema claro e escuro',
                    'Histórico Funcional - todas as versões acessíveis com animações',
                    'Barras de Rolagem Customizadas - verde Zenfisio',
                    'Transições Suaves - tudo anima de forma elegante',
                    'Layout Responsivo - funciona em todos os tamanhos de tela'
                ],
                improvements: [
                    'Interface sem bugs',
                    'Tema claro funciona perfeitamente',
                    'Navegação fluida entre versões',
                    'Animações elegantes',
                    'Visual profissional e polido',
                    'Funciona em celular, tablet e computador'
                ]
            },
            {
                version: '1.0.2',
                date: 'Outubro de 2025',
                title: 'Sistema de Evoluções Pendentes',
                description: 'Novo sistema completo para ver evoluções de pacientes! São 4 abas diferentes para analisar os atendimentos: uma visão geral, lista de pacientes, lista de fisioterapeutas e uma linha do tempo. Clique nos cards para expandir e ver mais detalhes.',
                features: [
                    '4 Abas Interativas - Visão Geral, Pacientes, Fisioterapeutas, Cronologia',
                    'Cards Expandíveis - clique para ver mais informações',
                    'Filtro de Segurança - só mostra dados confirmados e válidos',
                    'Organização Automática - agrupa por paciente, terapeuta e data',
                    'Contador de Atendimentos - badges mostram quantos tem cada um',
                    'Animações Suaves - cards aparecem um após o outro'
                ],
                improvements: [
                    'Análise completa de atendimentos',
                    'Múltiplas formas de ver os mesmos dados',
                    'Interface profissional e organizada',
                    'Fácil de entender e usar',
                    'Funciona em todos os dispositivos',
                    'Rápido e eficiente'
                ]
            },
            {
                version: '1.0.1',
                date: 'Outubro de 2025',
                title: 'Melhorias Visuais e Cores',
                description: 'Primeira atualização focada em deixar tudo mais bonito! Cor verde Zenfisio em todos os menus e botões, modais mais largos para melhor visualização, e cards com botão de expandir/colapsar. Títulos ganharam animação sutil que combina com o logo do sistema.',
                features: [
                    'Verde Zenfisio em Tudo - cor da marca em menus e botões',
                    'Modais Mais Largos - melhor aproveitamento da tela',
                    'Cards Expandíveis - clique para ver mais ou menos informações',
                    'Títulos Animados - pulsam levemente como o logo',
                    'Animações Sincronizadas - tudo combina visualmente',
                    'Brilho Verde Controlado - não cansa os olhos'
                ],
                improvements: [
                    'Visual unificado e profissional',
                    'Melhor uso do espaço horizontal',
                    'Menos poluição na tela',
                    'Animações elegantes e suaves',
                    'Fácil de ler e entender',
                    'Funciona com tema claro e escuro'
                ]
            },
            {
                version: '1.0.0',
                date: 'Outubro de 2025',
                title: 'Lançamento Inicial',
                description: 'Primeira versão do Auto Gerenciamento Zenfisio! Sistema completo para organizar e analisar dados de fisioterapia. Interface moderna que funciona em celular, tablet e computador. Tema escuro como padrão (melhor para os olhos) mas você pode mudar para claro quando quiser.',
                features: [
                    'Dashboard Moderno - interface limpa e organizada',
                    'Tema Claro e Escuro - escolha qual prefere',
                    'Controles de Data - navegue entre meses e dias facilmente',
                    'Processamento de Dados - analisa informações de pacientes',
                    'Design Responsivo - funciona em qualquer dispositivo',
                    'Animações Suaves - transições elegantes em tudo',
                    'Notificações Visuais - avisos quando algo acontece',
                    'Efeitos de Luz no Fundo - visual moderno e atrativo'
                ],
                improvements: [
                    'Interface intuitiva - qualquer pessoa consegue usar',
                    'Visual profissional e moderno',
                    'Funciona em todos os navegadores',
                    'Rápido e eficiente',
                    'Cores verdes Zenfisio',
                    'Pronto para uso em clínicas'
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
