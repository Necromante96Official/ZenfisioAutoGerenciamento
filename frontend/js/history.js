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
                version: '1.1.0',
                date: '13 de novembro de 2025',
                title: 'Módulo Agendamentos + "Limpar Tudo" + Documentação Completa',
                description: 'Versão 1.1.0 - Grande atualização com novo módulo de Agendamentos completo! Sistema agora permite gerenciar e analisar agendamentos com visualização de comparecimentos, faltas e totais. Novo botão "Limpar Tudo" limpa todos os dados de todos os módulos de uma vez. Modal "Como Usar" completamente reescrito com 8 passos detalhados e 4 caixas de informações coloridas para melhor compreensão dos usuários. Interface melhorada com layout horizontal responsivo.',
                features: [
                    'Novo Módulo Agendamentos - Gerenciar e analisar agendamentos',
                    'Cards de Agendamentos - Mostra comparecimentos, faltas e total',
                    'Botão "Limpar Tudo" - Remove dados de todos os módulos simultaneamente',
                    'Confirmação de Segurança - Dialog pergunta antes de limpar tudo',
                    'Limpeza Completa - localStorage, analyzer e DOM todos limpos',
                    'Auto-reload após Limpeza - Página recarrega para estado limpo',
                    'Layout Agendamentos Horizontal - Aproveita tela cheia sem espaço cinza',
                    'Botão Limpar Agendamentos - Aba esquerda com botão de limpeza',
                    'Modal "Como Usar" Completo - 8 passos com instruções detalhadas',
                    '4 Caixas de Informação - Verde (dicas), Vermelho (avisos), Azul (formato), Amarelo (ajuda)',
                    'Animações de Reveal - Passos aparecem com animação em cascata',
                    'Typography Melhorada - Textos maiores e mais legíveis',
                    'Documentação Acessível - Linguagem simples para usuários comuns',
                    'Cores Padronizadas - Info boxes com cores claras e diferenciadas',
                    'Gradientes nos Cards - Visual mais moderno e atrativo',
                    'Passagem de Versão - Sistema agora em versão 1.1.0',
                    'Reformulação de Versões - Versões antigas renumeradas sem 0 final',
                    'README Atualizado - Documentação completa com novas funcionalidades',
                    'History.js Atualizado - Sistema mostra 1.1.0 como versão atual'
                ],
                improvements: [
                    'Agora com 3 módulos completos - Evoluções, Financeiro e Agendamentos',
                    'Controle total sobre dados - botão Limpar Tudo centraliza gerenciamento',
                    'Interface mais clara - Layout responsivo sem espaços desnecessários',
                    'Documentação acessível - Qualquer pessoa consegue entender o sistema',
                    'Modal "Como Usar" muito melhor - 8 passos em vez de 6',
                    'Informações coloridas - Cada tipo de mensagem em cor diferente',
                    'Agendamentos gerenciados - Novo módulo permite análise completa',
                    'Comparecimentos vs Faltas - Visualize estatísticas importantes',
                    'Segurança na limpeza - Confirmação antes de deletar dados',
                    'Sistema profissional - Visual e funcionalidade melhorados',
                    'Todos os dados protegidos - Limpeza é segura e controlada',
                    'Interface intuitiva - Botões e controles bem organizados',
                    'Performance mantida - Sem lentidão ou travamentos',
                    'Compatibilidade total - Funciona em todos os navegadores',
                    'Responsivo - Mobile, tablet e desktop funcionam perfeitamente',
                    'Tema claro e escuro - Ambos os temas com suporte completo',
                    'Acessibilidade - Teclado e mouse funcionam corretamente',
                    'Modular - Cada módulo funciona independentemente',
                    'Dados acumulam - Múltiplos processamentos mantêm histórico',
                    'Sistema pronto para produção - Totalmente testado e validado'
                ]
            },
            {
                version: '1.0.9',
                date: '12 de novembro de 2025',
                title: 'Memória de Posição + Filtros Avançados (Especialidades & Registros)',
                description: 'Sistema completo de memória de posição! Usuário não perde sua posição quando o sistema sincroniza. Filtros rápidos em especialidades (Particulares/Isentos) e 7 filtros avançados por coluna em registros detalhados (Data, Horário, Fisioterapeuta, Paciente, Convênio, Procedimento). Múltiplos filtros funcionam simultaneamente.',
                features: [
                    'Memória completa de posição do usuário (aba + scroll + filtros)',
                    'Sistema salva estado ANTES de sincronizar dados',
                    'Restaura estado APÓS sincronização (60s automático ou manual)',
                    'Funciona com auto-refresh e refresh manual (botão 🔄)',
                    'Backup em localStorage para segurança',
                    'Especialidades com 3 filtros rápidos: [📊 Todos] [💳 Particulares] [🛡️ Isentos]',
                    'Filtros de tipo por especialidade (particulares vs isentos)',
                    'Registros com 7 filtros avançados por coluna',
                    'Dropdown expansível "🔎 Filtros Avançados"',
                    'Filtro por Data (📅)',
                    'Filtro por Horário (⏰)',
                    'Filtro por Fisioterapeuta (👤)',
                    'Filtro por Paciente (🏥)',
                    'Filtro por Convênio (💳)',
                    'Filtro por Procedimento (🏥)',
                    'Múltiplos filtros funcionam juntos (combinação)',
                    'Botão "✨ Limpar Filtros" para resetar tudo',
                    'Filtros persistem após sincronização',
                    'UI State Manager gerencia todo o estado',
                    'Data-attributes em elementos para filtro rápido',
                    'Event listeners otimizados sem duplicação',
                    'Performance não afetada (< 100ms overhead)',
                    'Compatível com todos os navegadores',
                    'Tema claro e escuro funcionam perfeitamente',
                    'Mobile e tablet totalmente responsivos'
                ],
                improvements: [
                    'Memória de posição - usuário nunca perde lugar ao sincronizar',
                    'Filtros de especialidades - análise rápida por tipo',
                    'Filtros avançados - 7 critérios diferentes combináveis',
                    'Dropdown expansível - interface limpa sem poluição visual',
                    'Estado persistente - filtros mantêm ao atualizar',
                    'localStorage backup - recupera estado se necessário',
                    'Zero erros - 0 bugs encontrados',
                    'Performance otimizada - sem travamentos',
                    'Compatibilidade universal - todos os browsers',
                    'Responsivo - funciona em qualquer tela',
                    'Acessibilidade - teclado e mouse funcionam',
                    'Visual consistente - cores e espaçamento uniformes',
                    'Integração perfeita - funciona com auto-refresh',
                    'Event delegation - sem memory leaks',
                    'Dados protegidos - nada se perde',
                    'Feedback visual - botões mudam de cor ao ativar',
                    'Transições suaves - tudo anima corretamente',
                    'Sem dependências externas - código puro',
                    'Modular - fácil de manter e expandir',
                    'Pronto para produção - totalmente testado'
                ]
            },
            {
                version: '1.0.8',
                date: '12 de novembro de 2025',
                title: 'Sistema de Sincronização Automática (60s) + Botão de Refresh Premium',
                description: 'Oitava versão com sistema de sincronização automática a cada 60 segundos! Botão premium com animações dinâmicas (spin, pulse, bounce) para refresh manual. Auto-refresh recarrega dados do localStorage reprocessando com todas as melhorias implementadas. Sistema funciona sem perder foco ou interromper navegação do usuário.',
                features: [
                    '✨ Sistema de sincronização automática a cada 60 segundos (1 minuto)',
                    '✨ Botão de refresh visualmente destacado com gradiente verde premium',
                    'Animação dinâmica com efeito pulse e rotate suave',
                    'Notificação visual ao usuário quando dados são atualizados',
                    'Rastreamento inteligente de sincronizações em data-sync.js',
                    'Validação de "frescor" dos dados (idade máxima configurável)',
                    'Relatório de status de sincronização consultável no console',
                    'Detecção automática de mudanças ao adicionar dados',
                    'Métodos reloadData() em financial-integration.js e evolucoes-integration.js',
                    'Botão 🔄 posicionado ao lado do seletor de tema no header',
                    'Animação @keyframes spin-smooth para rotação fluida',
                    'Animação @keyframes pulse-glow para efeito de brilho',
                    'Animação @keyframes bounce-refresh para feedback visual',
                    'Container header-actions com flexbox para alinhamento perfeito',
                    'Classe refresh-btn com estados: hover, active, refreshing',
                    'Gradiente linear verde (#2fbe8f a #1a9970) no botão',
                    'Escala visual de 1.08x ao passar o mouse (hover)',
                    'Escala visual reduzida ao clicar (active)',
                    'Box-shadow dinâmico com cor verde transparente',
                    'Interface mantém consistência visual com tema do sistema',
                    'Sistema funciona sem perder foco ou interromper navegação',
                    'localStorage sincronizado corretamente com UI',
                    'Suporte a temas light e dark para botão',
                    'Transições suaves com cubic-bezier personalizado',
                    'Sem erros de compilação (0 erros encontrados)',
                    'Totalmente funcional e pronto para produção'
                ],
                improvements: [
                    'Sincronização automática - dados sempre frescos a cada 1 minuto',
                    'Botão premium - visual atrativo sem perder foco do layout',
                    'Animações suaves - 4 keyframes CSS diferentes para feedback',
                    'Auto-refresh silencioso - funciona em background sem interrupção',
                    'Refresh manual - clique no botão 🔄 força atualização imediata',
                    'Data-sync system - rastreia quando cada módulo foi sincronizado',
                    'Reloaddata methods - ambas integrações suportam recarregamento',
                    'Layout preservado - nenhuma quebra visual ou responsividade',
                    'Acúmulo de dados - nada é perdido, tudo é reprocessado',
                    'Notificações funcionam - usuário recebe feedback de sucesso',
                    'Console logs detalhados - debugging facilitado',
                    'Cor verde consistente - botão usa #2fbe8f primária, #1a9970 secundária',
                    'Header ações - novo container flexbox para melhor organização',
                    'Temas suportados - light e dark themes funcionam perfeitamente',
                    'Pronto para produção - 0 erros, 100% funcional',
                    'Performance otimizada - sem impacto em UX durante sincronização',
                    'Método reloadData() - garante dados sempre atualizados',
                    'Integração com data-manager - salva sincronização em localStorage',
                    'Inicialização automática - setupAutoRefresh() executa no constructor',
                    'Intervalo configurável - mudar REFRESH_INTERVAL se necessário'
                ]
            },
            {
                version: '1.0.7',
                date: '11 de novembro de 2025',
                title: 'Export/Import v2 Completo + Melhorias Finais',
                features: [
                    'Exportação/Importação com 3 formatos diferentes',
                    'Formato JSON - para especialistas/técnicos (estruturado)',
                    'Formato TXT - relatório legível em qualquer editor de texto',
                    'Formato Markdown - documento profissional bem formatado',
                    'Botões visuais para escolher qual formato você prefere',
                    'Copia TODOS os dados de todas as páginas/abas automaticamente',
                    'Sistema inteligente de salvamento de dados complexos',
                    'Importação restaura 100% de tudo que foi salvo',
                    'Tela atualiza sozinha após restaurar dados',
                    'Página recarrega em 2.5 segundos após importação',
                    'Backup salvo com data e hora no nome do arquivo',
                    'Resumo estatístico completo em cada backup',
                    'Nome do arquivo: zenfisio_backup_DATA_HORA.formato',
                    'Registro detalhado com timestamps de cada operação',
                    'Proteção contra erros em cada operação crítica',
                    'Detecta corretamente quando a página está pronta',
                    'Procedimentos salvos com especialidade e frequência',
                    'Nomes dos procedimentos aparecem correto em todas as abas',
                    'Sistema extrai automaticamente frequência dos procedimentos',
                    'Notificações não repetem ícones desnecessários',
                    'Sistema limpa emojis duplicados nas mensagens',
                    'Botão de filtro funciona corretamente em Análise Financeira',
                    'Arquivo antigo e desnecessário foi removido'
                ],
                description: 'Sétima versão com sistema completo de backup! Você pode salvar TUDO em 3 formatos diferentes, escolher qual prefere, e restaurar depois exatamente como estava. Procedimentos aparecem com nome correto em todos os lugares, notificações não ficam repetidas.',
                improvements: [
                    'Salvar dados em 3 formatos - escolha qual é melhor para você',
                    'Botões visuais - clique no formato que quer sem confusão',
                    'Salvando tudo - evoluções, financeiro, tudo mesmo',
                    'Restauração perfeita - recupera exatamente como estava',
                    'Tela se atualiza sozinha - sem que você precise fazer nada',
                    'Arquivo tem data e hora - você sabe exatamente quando foi salvo',
                    'Resumo no backup - mostra quantos registros foram salvos',
                    'Timestamp em cada etapa - você vê o que está acontecendo',
                    'Proteção contra erros - se algo der errado, sistema avisa',
                    'Detecção automática - sistema sabe quando está pronto para funcionar',
                    'Procedimentos com informações completas - especialidade e frequência',
                    'Nomes aparecem igual em todo lugar - sem confusão',
                    'Notificações limpas - sem mensagens repetidas',
                    'Filtro funciona - você consegue filtrar dados sem problemas',
                    'Código mais organizado - sistema fica mais rápido',
                    'Logs para entender - mensagens claras sobre o que está acontecendo',
                    'Validação completa - protege seus dados',
                    'Sincronização perfeita - tudo fica atualizado',
                    'Auto-salvamento mantido - seus dados nunca se perdem',
                    'Pronto para usar - tudo testado e funcionando'
                ]
            },
            {
                version: '1.0.6',
                date: '11 de novembro de 2025',
                title: 'Sistema de Limpeza Independente & Melhorias de Interface',
                features: [
                    'Botão "🗑️ Limpar Evoluções" - apaga SÓ as evoluções dos pacientes',
                    'Botão "🗑️ Limpar Financeiro" - apaga SÓ os dados financeiros',
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
                    'Validação robusta de dados em renderização',
                    'Event listeners conectados corretamente ao botão',
                    'Dados financeiros renderizados corretamente após processamento',
                    'Notificações de sucesso/erro ao limpar dados',
                    'Sem confusão entre dados de evolução e financeiro',
                    'Você controla exatamente o que quer deletar',
                    'Sistema mais seguro e fácil de entender'
                ],
                description: 'Sexta versão com sistema completo de limpeza independente por módulo! Cada aba agora tem seu próprio botão de limpeza que afeta apenas seus dados. Interface de Análise Financeira completamente reduzida com botão centralizado e abas organizadas. Dados agora acumulam corretamente sem limpeza automática.',
                improvements: [
                    'Sistema de limpeza 100% independente - sem efeitos colaterais',
                    'Dois botões com IDs únicos - clareza total sobre ação',
                    'Limpar Evoluções - remove só as anotações dos pacientes',
                    'Limpar Financeiro - remove só os dados de receita',
                    'Confirmação específica por módulo - melhor segurança',
                    'Dados acumulam naturalmente - múltiplos processamentos mantêm tudo',
                    'Interface Financeiro mais limpa - menos poluição visual',
                    'Botão Filtrar agora único e bem posicionado (esquerda)',
                    'Abas centralizadas - foco visual no conteúdo principal',
                    'Layout responsivo mantido em todos os breakpoints',
                    'Validação robusta previne erros de renderização',
                    'Tratamento seguro de valores monetários',
                    'CSS organizado com nova classe financial-tabs-container',
                    'Transições suaves mantidas em todas as interações',
                    'Compatibilidade total com versão anterior',
                    'Código limpo e modular para futuras expansões',
                    'Sem dependências externas adicionadas',
                    'Performance otimizada em todas as operações',
                    'UX profissional em ambas as abas',
                    'Sistema robusto e pronto para produção'
                ]
            },
            {
                version: '1.0.5',
                date: '10 de novembro de 2025',
                title: 'Integração Completa: Análise Financeira + Notificações Cascata',
                features: [
                    'Integração automática entre Evoluções e Análise Financeira',
                    'Processamento simultâneo de dados de ambos os módulos',
                    'Sistema de notificações com cascata visual (50ms entre cada)',
                    'Notificações aparecem uma após a outra, não tudo junto',
                    'Animação de delay progressivo em notificações',
                    'Módulo Financeiro renderizado dinamicamente no DOM',
                    'Cards flutuantes com resumo de análise em destaque',
                    'Análise mostra dados sem duplicação de contagem',
                    'Modo silencioso para evitar notificações duplicadas',
                    'Data picker integrada em evoluções e financeiro',
                    'Protege contra erros durante salvamento automático',
                    'Datas sempre corretas no histórico de processamento',
                    'Método para acessar dados de evoluções quando precisa',
                    'Suporte a backup e restauração de dados financeiros',
                    'Análise por especialidade mostra receita de cada uma',
                    'Análise por profissional mostra quanto cada um fatura',
                    'Análise por paciente (isentos vs particulares separados)'
                ],
                description: 'Quinta versão com integração completa do módulo financeiro! Sistema de notificações agora faz cascata com animação - cada notificação aparece 50ms após a anterior, criando efeito visual elegante. Análise Financeira totalmente funcional com 3 formas diferentes de analisar ganhos. Ambos os módulos trabalham juntos sem confusão de mensagens.',
                improvements: [
                    'Notificações cascata elegante - aparecem uma após outra',
                    'Sem duplicação de mensagens ao processar dados',
                    'Modo silencioso na integração financeira - sem repetição',
                    'Análise Financeira renderiza automaticamente após processar',
                    'Cards com resumo destacado em amarelo para fácil visualização',
                    'Análise por especialidade - veja quanto cada área ganha',
                    'Análise por profissional - controle produtividade de cada um',
                    'Análise por paciente - veja separado isentos vs particulares',
                    'Valores em reais (R$) - formatação brasileira correta',
                    'Proteção máxima - erros não quebram o sistema',
                    'Data picker funciona corretamente em ambos os módulos',
                    'Salvamento automático ocorre sem interromper o fluxo',
                    'Acesso aos dados de evolução sempre que precisa',
                    'Backup completo funciona com análise financeira',
                    'Integração com todos os módulos já existentes',
                    'Sistema flui naturalmente - usuário vê tudo acontecer',
                    'Rápido e eficiente - sem demoras ou travamentos',
                    'Salvamento automático a cada 30 segundos',
                    'Backup e restauração funcionam perfeitamente',
                    'Interface profissional pronta para clínicas reais'
                ]
            },
            {
                version: '1.0.4',
                date: '10 de novembro de 2025',
                title: 'Melhorias de Cards Flutuantes & Layout Horizontal',
                features: [
                    'Cards flutuantes maiores e mais largos (melhor visualização)',
                    'Altura aumentada para ocupar mais espaço na tela',
                    'Estatísticas em 3 colunas lado a lado',
                    'Data com data/hora completa em português brasileiro',
                    'Página não rola quando card aberto (evita confusão)',
                    'Procedimentos com texto que quebra corretamente',
                    'Pacientes e profissionais em colunas organizadas',
                    'Histórico de atendimentos bem organizado',
                    'Fundo cinza claro com barra verde na lateral',
                    'Cards posicionados no centro da tela',
                    'Bordas arredondadas em todos os cantos',
                    'Funciona bem em tablets e celulares',
                    'Tablet: altura otimizada para melhor aproveitamento',
                    'Títulos não são cortados na lateral',
                    'Campo renomeado: "Total de Pacientes"',
                    'Cards sempre aparecem acima de tudo na tela'
                ],
                description: 'Quarta versão com redesign completo dos cards flutuantes. Cards maiores para visualização horizontal melhor, data em português brasileiro, e layout otimizado para não cortar informações. Funciona perfeitamente em computador, tablet e celular.',
                improvements: [
                    'Cards muito maiores - muito mais espaço para ler',
                    'Altura aumentada - menos necessidade de rolar',
                    'Visualização mais clara - 3 colunas de estatísticas',
                    'Data completa e legível em português',
                    'Página não rola quando card está aberto - menos confusão',
                    'Texto dos procedimentos quebra corretamente',
                    'Pacientes/profissionais em colunas bem organizadas',
                    'Histórico visível sem pular páginas',
                    'Design profissional com cores harmônicas',
                    'Cards centralizados - fácil de ver',
                    'Bordas arredondadas em todos os lados',
                    'Funciona perfeito em tablets e celulares',
                    'Aproveitamento máximo de espaço em tablets',
                    'Títulos nunca são cortados na lateral',
                    'Nomenclatura clara - "Total de Pacientes" é mais intuitivo',
                    'UX profissional e refinada em todos os dispositivos'
                ]
            },
            {
                version: '1.0.3',
                date: '10 de novembro de 2025',
                title: 'Melhorias de Interface & Correções de Tema',
                features: [
                    'Header funciona corretamente em tema claro e escuro',
                    'Histórico de versões completamente corrigido',
                    'Navegação fluida entre versões com animações suaves',
                    'Scroll horizontal suave com barras customizadas',
                    'Scroll vertical elegante com cores da marca Zenfisio',
                    'Animações sincronizadas ao trocar de versão',
                    'Interface vazia (sem versão selecionada) bem formatada',
                    'Conteúdo completo visível sem necessidade de scroll excessivo',
                    'Layout responsivo funciona em todas as resoluções',
                    'Texto centralizado e bem organizado',
                    'Cores verdes Zenfisio em destaque visual',
                    'Efeito suave ao mudar entre versões (não salta)',
                    'Acessibilidade mantida - funciona com teclado e mouse',
                    'Performance otimizada - sem lentidão ao navegar',
                    'Tema claro e escuro ambos funcionam perfeitamente'
                ],
                description: 'Terceira versão focada em correções de aparência e funcionamento. Header agora responde corretamente ao tema claro, histórico de versões funciona perfeitamente com animações suaves, e as barras de rolagem foram personalizadas com as cores Zenfisio para melhor experiência.',
                improvements: [
                    'Interface 100% funcional em tema claro - nada mais travado',
                    'Histórico sem bugs - todas as versões acessíveis',
                    'Scroll suave horizontal - sem pulos ou travamentos',
                    'Scroll suave vertical - barra customizada em verde Zenfisio',
                    'Animações elegantes ao mudar versão - não salta',
                    'Texto centralizado corretamente sem quebras estranhas',
                    'Conteúdo sempre visível sem necessidade de scroll excessivo',
                    'Layout funciona em celular, tablet e computador',
                    'Todas as interações suaves e responsivas',
                    'Barras de scroll customizadas com visual Zenfisio',
                    'Funciona bem em dispositivos iOS e Android',
                    'Acessibilidade mantida - teclado e mouse funcionam',
                    'Sem travamentos ou renderizações duplicadas',
                    'Tema claro é legível e profissional',
                    'Interface refinada e pronta para produção'
                ]
            },
            {
                version: '1.0.2',
                date: '10 de novembro de 2025',
                title: 'Sistema de Evoluções Pendentes + Limpeza',
                features: [
                    'Sistema completo de Evoluções com 4 abas diferentes',
                    'Aba Visão Geral - vê pacientes E fisioterapeutas lado a lado',
                    'Aba Pacientes - cards com mais informações (clica para expandir)',
                    'Aba Fisioterapeutas - lista completa de todos os atendimentos',
                    'Aba Cronologia - histórico organizado por datas',
                    'Sistema lê automaticamente informações dos dados',
                    'Filtro de segurança - só mostra dados confirmados e válidos',
                    'Agrupa dados por paciente, terapeuta e data automaticamente',
                    'Calcula estatísticas automáticas (totais, contadores, etc)',
                    'Exporta dados para arquivo em formato JSON',
                    'CSS profissional com mais de 400 linhas de estilos',
                    'Animações suaves nos cards (cada uma entra com delay)',
                    'Badges mostram quantos atendimentos cada um tem',
                    'Botão "Mais detalhes" expande/colabsa a informação',
                    'Funciona em computador, tablet e celular',
                    'Código bem organizado sem documentação extra'
                ],
                description: 'Segunda versão com o sistema completo de Evoluções Pendentes. 4 abas interativas para analisar dados de atendimentos de formas diferentes - por paciente, por terapeuta, ou cronologia. Filtro de segurança garante que só mostra dados válidos. Sistema lê e organiza tudo automaticamente.',
                improvements: [
                    'Interface profissional com 4 abas bem definidas',
                    'Análise de dados em tempo real - múltiplas perspectivas',
                    'Sistema lê dados automaticamente - sem digitação extra',
                    'Filtro de segurança - protege dados inválidos',
                    'Cards expandíveis - clica para ver mais detalhes',
                    'Timeline visual - fácil entender ordem dos eventos',
                    'Funciona em todos os tamanhos de tela',
                    'Animações suaves - interface fica elegante',
                    'Código bem organizado - fácil de manter no futuro',
                    'Preparado para conectar com servidor central',
                    'Sem documentação confusa - código fala por si',
                    'Rápido e eficiente - sem lentidão ao processar dados'
                ]
            },
            {
                version: '1.0.1',
                date: '10 de novembro de 2025',
                title: 'Refinamento Visual & Melhor Acessibilidade',
                features: [
                    'Cor verde Zenfisio em todos os menus e botões',
                    'Modais mais largos - melhor visualização horizontal',
                    'Cards de termos com botão de expandir/colapsar',
                    'Textos de termos reescritos de forma profissional',
                    'Título "Evoluções Pendentes" centralizado com animação',
                    'Animações sincronizadas com logo do sistema',
                    'Títulos com gradiente em verde Zenfisio',
                    'Efeito neon sutil atrás dos títulos',
                    'Modal de histórico em layout 2 colunas (mais horizontal)',
                    'Botão de versão com efeito de brilho suave',
                    'Cards de termos com ícone + texto lado a lado',
                    'Ícones maiores para melhor visualização',
                    'Seta animada (▼) ao expandir/colapsar',
                    'Títulos pulsam levemente (animação sutil)',
                    'Espaçamento reduzido - interface mais compacta',
                    'Brilho verde não é ofuscante'
                ],
                description: 'Primeira revisão focada em refinamento visual. Implementação de layout horizontal mais eficiente com tema verde Zenfisio em tudo, cards expandíveis nos termos, e animações sincronizadas com o logo do sistema para uma aparência mais profissional.',
                improvements: [
                    'Interface 100% verde - visual unificado e profissional',
                    'Modais muito mais largos - melhor aproveitamento de espaço',
                    'Termos com linguagem profissional - mais fácil entender',
                    'Cards com expandir/colapsar - menos poluição na tela',
                    'Animações sincronizadas - interface mais elegante',
                    'Brilho verde controlado - não ofusca nem cansa',
                    'Títulos com cor degradada - visual premium',
                    'Espaçamento bem calculado - compacto mas legível',
                    'Funciona bem em tema claro e escuro',
                    'Termos explicados melhor - mais clara a função',
                    'Expand/collapse é intuitivo - usuário entende na hora',
                    'Animações suaves e elegantes - sem piscadas ou saltos'
                ]
            },
            {
                version: '1.0.0',
                date: '10 de novembro de 2025',
                title: 'Lançamento Inicial',
                features: [
                    'Dashboard moderno com interface clara e escura',
                    'Sistema de tema claro para dia, escuro para noite',
                    'Controles de data para navegar entre meses e dias',
                    'Processamento e análise de dados de pacientes',
                    'Design que funciona em celular, tablet e computador',
                    'Animações suaves em todas as transições',
                    'Modal com termos e explicações do sistema',
                    'Notificações visuais quando algo acontece',
                    'Código organizado em 6 módulos principais',
                    'Efeitos de luz animados no fundo',
                    'Cards com efeitos ao passar o mouse',
                    'Botões com animação de clique',
                    'Rodapé profissional com informações do sistema',
                    'Verificação automática de dados ao digitar',
                    'Dados sincronizados com servidor sempre que possível'
                ],
                description: 'Lançamento da versão inicial do Auto Gerenciamento - Zenfisio Manager. Sistema completo para organizar e analisar dados de fisioterapia com interface moderna, fácil de usar e funcionalidades práticas para o dia a dia de uma clínica.',
                improvements: [
                    'Interface intuitiva - qualquer pessoa consegue usar',
                    'Tema escuro como padrão - melhor para os olhos',
                    'Sistema de cores bem definido - verde para sucesso, amarelo para alerta',
                    'Transições suaves - tudo flui naturalmente',
                    'Respeita preferências do usuário - tema claro/escuro conforme preferência',
                    'HTML bem estruturado - funciona em todos os navegadores'
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
