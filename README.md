<div align="center">
  <img src="assets/logo.svg" alt="Zenfisio Logo" width="150">
  
  # Auto Gerenciamento Zenfisio
  
  **Sistema Proprietário de Gerenciamento de Dados e Análise Financeira**
  
  *Uso Exclusivo: Zenfisio - Clínica de Fisioterapia*
  
  [![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0.7-brightgreen)](#)
  [![Licença](https://img.shields.io/badge/licen%C3%A7a-Proprietária%20Zenfisio-blue)](#direitos-autorais)
  [![Ano](https://img.shields.io/badge/ano-2025-informational)](#)
  
</div>

---

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Características Principais](#características-principais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades Detalhadas](#funcionalidades-detalhadas)
- [Termos de Uso](#termos-de-uso)
- [Direitos Autorais](#direitos-autorais)
- [Suporte e Contribuição](#suporte-e-contribuição)
- [Roadmap](#roadmap)

---

## 🎯 Sobre o Projeto

**Auto Gerenciamento Zenfisio** é um sistema web proprietário desenvolvido exclusivamente para uso interno na Clínica Zenfisio de Fisioterapia. O sistema automatiza o processamento de dados de pacientes, análise de evoluções pendentes e fornece insights financeiros detalhados através de uma interface moderna e responsiva.

Desenvolvido com tecnologias vanilla JavaScript, HTML5 e CSS3, oferece uma experiência de uso leve, rápida e confiável, otimizada para os fluxos operacionais específicos da clínica.

⚠️ **INFORMAÇÃO IMPORTANTE**: Este software é de propriedade exclusiva da Zenfisio e seu acesso e uso são restritos ao pessoal autorizado da clínica.

---

## ✨ Características Principais

### 📊 Módulo de Análise Financeira
- **Análise em Tempo Real**: Processamento instantâneo de dados financeiros
- **Múltiplas Visualizações**:
  - Por Data (cronológico)
  - Por Especialidade (categorização)
  - Por Profissional (responsáveis)
  - Por Paciente (particular vs. isento)
- **Filtros Avançados**: Customize análises por período, especialidade e profissional
- **Indicadores de Performance**: Total de atendimentos, receita, taxa de conversão
- **Backup de Dados**: Exportação segura de dados em JSON para recuperação local

### 📝 Módulo de Evoluções Pendentes
- **Processamento Inteligente**: Extração automática de informações do texto
- **Suporte a Múltiplos Formatos**: Compatível com diversos layouts de dados
- **Histórico Completo**: Rastreamento de todas as evoluções registradas
- **Análise por Período**: Visualize dados por data específica
- **Categorização Automática**: Organização por paciente, terapeuta e status

### 🎨 Interface Moderna
- **Design Responsivo**: Perfeito em desktop, tablet e mobile
- **Tema Claro/Escuro**: Adaptação automática às preferências do sistema
- **Animações Suaves**: Transições elegantes e feedback visual
- **Acessibilidade**: Navegação intuitiva e clara
- **Modal Personalizado**: Confirmações e diálogos profissionais

### 💾 Gerenciamento de Dados
- **Armazenamento Local**: Dados persistidos exclusivamente em LocalStorage
- **Auto-save**: Salvamento automático a cada 10 segundos
- **Backup Seguro**: Exportação de dados em JSON para recuperação
- **Limpeza Modular**: Remova dados de forma independente por módulo
- **Histórico de Versões**: Rastreamento completo de atualizações do sistema

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **HTML5** | — | Estrutura semântica e markup |
| **CSS3** | — | Estilização, Grid, Flexbox, Animações |
| **JavaScript (ES6+)** | — | Lógica aplicacional, manipulação DOM |
| **SVG** | — | Ícones e logo vetorial |
| **LocalStorage API** | — | Persistência de dados cliente |

### Nenhuma Dependência Externa
O projeto foi deliberadamente desenvolvido sem frameworks ou bibliotecas externas, garantindo:
- ✅ Máxima performance
- ✅ Segurança aprimorada
- ✅ Facilidade de manutenção
- ✅ Compatibilidade universal

---

## 📖 Como Usar

### Módulo de Evoluções Pendentes

1. **Seleção de Data**
   - Use os botões de navegação para escolher a data
   - Clique em "Hoje" para retornar à data atual
   - Selecione data específica clicando no campo de data

2. **Inserção de Dados**
   - Cole o conteúdo das evoluções no textarea
   - Formato esperado:
     ```
     Horário: 09:00 - 10:00
     Fisioterapeuta: Nome do Profissional
     Paciente: Nome do Paciente
     Celular: +55 (XX) 9XXXX-XXXX
     Convênio: Particular/Convênio
     Status: Presença confirmada
     Procedimentos: Descrição do atendimento
     ```

3. **Processamento**
   - Clique em "Processar" para analisar dados
   - Visualize resultados nas abas: Visão Geral, Pacientes, Fisioterapeutas, Cronologia
   - Os dados são salvos automaticamente

4. **Limpeza**
   - Use "Limpar Evoluções" para remover dados deste módulo
   - Confirme na janela modal
   - Dados de Financeiro **não serão afetados**

### Módulo de Análise Financeira

1. **Importação de Dados**
   - Processe dados em "Evoluções Pendentes"
   - Dados são automaticamente analisados financeiramente

2. **Visualização de Análises**
   - **Por Data**: Receita e atendimentos organizados por dia
   - **Especialidades**: Performance de cada serviço oferecido
   - **Profissionais**: Contribuição individual de cada terapeuta
   - **Pacientes**: Segmentação entre particulares e isentos

3. **Filtros Avançados**
   - Clique em "Filtrar" para refinar análises
   - Selecione período, especialidade ou profissional
   - Aplique para visualizar dados específicos

4. **Limpeza de Dados**
   - Use "Limpar Financeiro" para remover dados deste módulo
   - Confirme na janela modal de confirmação
   - Dados de Evoluções **não serão afetados**
   - Importante: Sempre faça backup antes de limpar

5. **Backup e Exportação de Dados**
   - Use "Exportar" para baixar dados em múltiplos formatos
   - **Formatos Disponíveis**:
     - **JSON**: Formato estruturado para importação futura (recomendado para backups técnicos)
     - **TXT**: Arquivo legível em qualquer editor de texto (ideal para consulta rápida)
     - **Markdown**: Relatório profissional formatado (perfeito para documentação)
   - Escolha o formato na janela modal que aparece ao clicar em "Exportar"
   - Guarde backups regularmente em local seguro
   - Importante: Sempre faça backup antes de limpar dados
   - Use o formato JSON para importar dados posteriormente no sistema

---

## 📁 Estrutura do Projeto

```
ZenfisioAutoGerenciamento/
├── index.html                          # Página principal (entry point)
├── server.bat                          # Script inicialização (Windows)
├── server-python.py                    # Script inicialização (Python)
│
├── assets/
│   └── logo.svg                        # Logo Zenfisio vetorial
│
├── css/                                # Estilos organizados
│   ├── styles.css                      # Estilos globais e base
│   ├── animations.css                  # Sistema de animações
│   ├── financial-module.css            # Estilos módulo financeiro
│   ├── evolucoes-tabs.css             # Estilos abas evoluções
│   ├── modal-styles.css               # Estilos modais
│   ├── filter-styles.css              # Estilos filtros
│   ├── floating-cards.css             # Cartões flutuantes
│   ├── date-filters.css               # Filtros de data
│   └── instructions-styles.css        # Estilos instruções
│
├── frontend/
│   ├── js/
│   │   ├── app.js                          # Inicialização aplicação
│   │   ├── financial-ui.js                # Interface financeira
│   │   ├── financial-analyzer.js          # Análise de dados financeiros
│   │   ├── financial-parser.js            # Parser dados financeiros
│   │   ├── parser.js                      # Parser geral
│   │   ├── parser-agendamentos.js         # Parser agendamentos
│   │   ├── analytics.js                   # Analytics evoluções
│   │   ├── analytics-financeiro.js        # Analytics financeiro
│   │   ├── evolucoes-integration.js       # Integração evoluções
│   │   ├── financial-integration.js       # Integração financeira
│   │   ├── data-manager.js                # Gerenciamento dados
│   │   ├── clear-data-manager.js          # Limpeza modular
│   │   ├── filter-modal.js                # Lógica filtros
│   │   ├── filter-modal-integration.js    # Integração filtros
│   │   ├── confirmation-modal.js          # Modal confirmação
│   │   ├── export-import-manager.js       # Exportação/importação
│   │   ├── transitions.js                 # Transições módulos
│   │   ├── app-transitions-integration.js # Integração transições
│   │   └── history.js                     # Histórico versões
│   │
│   └── css/                            # Estilos alternativos (organizados)
│
│
├── backend/                            # Suporte backend (em desenvolvimento)
│
├── data/                               # Dados persistidos
│   └── backup.json                     # Backup automático
│
├── .backups/                           # Histórico de backups
│
├── .env                                # Variáveis ambiente
│
├── CHANGELOG.md                        # Histórico mudanças
├── LICENSE                             # Licença proprietária
└── README.md                           # Este arquivo

```

---

## 🔧 Funcionalidades Detalhadas

### 📊 Análise Financeira Completa

A análise financeira oferece múltiplas perspectivas sobre os dados operacionais:

#### Visão Por Data
- Receita total por dia
- Quantidade de atendimentos
- Proporção pagantes vs. isentos
- Indicadores de performance diária

#### Visão Por Especialidade
- Performance de cada serviço
- Volume de atendimentos por especialidade
- Receita média por especialidade
- Comparativo de faturamento

#### Visão Por Profissional
- Contribuição de cada terapeuta
- Horas trabalhadas e receita gerada
- Taxa de atendimentos
- Comparativo de performance

#### Visão Por Paciente
- **Particulares**: Clientes pagantes
- **Isentos**: Clientes com redução/isenção
- Histórico de atendimentos
- Valor total gasto/investido

### 🎯 Processamento Inteligente

O sistema utiliza algoritmos sofisticados para:
- **Extração de Dados**: Identifica padrões em textos desstructurados
- **Normalização**: Padroniza formatos e entradas variadas
- **Validação**: Verifica integridade dos dados
- **Categorização**: Classifica automaticamente informações
- **Agregação**: Consolida dados de múltiplas fontes

### 💬 Modal de Confirmação Personalizado

Diálogos elegantes e responsivos que:
- Substituem alertas nativos do navegador
- Exibem detalhes da ação a ser realizada
- Animam suavemente
- Funcionam em todos os tamanhos de tela
- Suportam tema claro/escuro
- Incluem atalhos de teclado (ESC para cancelar)

### 💾 Sistema de Backup e Exportação v2

#### Formatos de Exportação

| Formato | Extensão | Uso Recomendado | Conteúdo |
|---------|----------|-----------------|----------|
| **JSON** | `.json` | Importação técnica | Dados estruturados em JSON completo |
| **TXT** | `.txt` | Consulta legível | Relatório formatado em texto simples |
| **Markdown** | `.md` | Documentação | Relatório profissional com formatação |

#### Como Usar Backup

1. **Exportar Dados**
   - Clique em "Exportar" no menu principal
   - Escolha o formato desejado na janela modal
   - Arquivo será baixado automaticamente com timestamp
   - Arquivo contém: evoluções, financeiro, metadados, resumo estatístico

2. **Importar Dados (apenas JSON)**
   - Clique em "Importar" no menu principal
   - Selecione arquivo `.json` previamente exportado
   - Sistema validará e restaurará todos os dados
   - Página recarregará automaticamente com dados restaurados
   - UI será sincronizada com dados importados

3. **Nomenclatura de Arquivos**
   - Formato: `zenfisio_backup_YYYY-MM-DD_HH-MM-SS.ext`
   - Exemplo: `zenfisio_backup_2025-11-15_14-30-45.json`
   - Timestamp permite rastreamento de backups múltiplos

#### Dados Capturados em Backup

**Módulo Evoluções:**
- Todos os registros de evoluções processados
- Análise geral e estatísticas
- Informações por paciente
- Informações por fisioterapeuta
- Cronologia completa
- Filtros ativos (se houver)

**Módulo Financeiro:**
- Todos os registros financeiros
- Resumo completo de análise
- Detalhamento por data, especialidade, profissional e paciente
- Filtros ativos (se houver)

**Metadados:**
- Data e hora de exportação
- Versão do sistema
- Navegador utilizado
- Resolução da tela
- Resumo estatístico completo

#### Segurança e Boas Práticas

- ✅ Arquivos salvos **localmente** em sua máquina
- ✅ Nenhum dado enviado para servidor externo
- ✅ Validação automática de integridade
- ✅ Faça backup regularmente (diariamente é recomendado)
- ✅ Sempre backup antes de limpar dados
- ✅ Guarde backups em pasta segura (Google Drive, OneDrive)
- ✅ Mantenha múltiplas cópias de backups importantes
- ✅ Use JSON para backups técnicos
- ✅ Use TXT/MD para consulta e documentação

---

## 📜 Termos de Uso

### 1. Licença Proprietária Exclusiva

Este software é propriedade intelectual da **Zenfisio - Clínica de Fisioterapia** e fornecido sob licença proprietária personalizada restritiva. 

**Usuários Autorizados:**
- ✅ Apenas funcionários da Zenfisio com autorização expressa
- ✅ Acesso limitado ao horário de funcionamento comercial
- ✅ Uso exclusivamente para operações internas da clínica

### 2. Direitos Concedidos

Os usuários autorizados têm direito de:
- ✅ Usar o software exclusivamente na clínica Zenfisio
- ✅ Processar e gerenciar dados de pacientes da clínica
- ✅ Fazer backup dos dados para recuperação
- ✅ Utilizar em ambiente local da clínica

### 3. Restrições Absolutas

**Terminantemente Proibido:**
- ❌ Copiar, clonar ou redistribuir o software
- ❌ Acessar, modificar ou visualizar o código-fonte sem autorização
- ❌ Utilizar em outras clínicas ou organizações
- ❌ Criar versões derivadas ou modificadas
- ❌ Vender, licenciar ou comercializar de qualquer forma
- ❌ Compartilhar acesso com pessoas não autorizadas
- ❌ Remover ou modificar avisos de copyright e propriedade
- ❌ Realizar engenharia reversa ou decomposição
- ❌ Utilizar para fins competitivos

### 4. Proteção de Dados

- 🔒 Todos os dados são armazenados **exclusivamente localmente** em sua máquina
- 🔒 Nenhuma informação é transmitida para servidores externos
- 🔒 Dados de pacientes são confidenciais e protegidos por LGPD
- 🔒 Responsabilidade total da clínica pela segurança dos dados
- 🔒 Backups devem ser realizados regularmente pela clínica

### 5. Conformidade Legal

- Este software está em conformidade com a LGPD (Lei Geral de Proteção de Dados)
- Dados pessoais de pacientes são tratados conforme legislação vigente
- A clínica é responsável pela privacidade e segurança dos dados
- Uso deve estar de acordo com normas do Conselho Federal de Fisioterapia

### 6. Suporte Técnico

- Suporte técnico disponível exclusivamente para usuários autorizados
- Reportar bugs através de canais internos autorizados
- Melhorias solicitadas pelos responsáveis da clínica

### 7. Limitação de Responsabilidade

Este software é fornecido "COMO ESTÁ". A Zenfisio não se responsabiliza por:
- Perda ou corrupção de dados (recomenda-se backup regular)
- Interrupções ou indisponibilidade do serviço
- Danos diretos, indiretos ou consequentes
- Uso indevido por pessoas não autorizadas
- Falhas de segurança causadas por negligência do usuário

### 8. Encerramento de Acesso

A Zenfisio reserva-se o direito de:
- Revogar acesso a qualquer momento
- Encerrar uso do software sem aviso prévio
- Alterar funcionalidades e termos conforme necessário
- Investigar violações de uso e tomar ações legais

---

## ©️ Direitos Autorais e Propriedade

```
© 2025 - Auto Gerenciamento Zenfisio
TODOS OS DIREITOS RESERVADOS

Zenfisio - Clínica de Fisioterapia
Desenvolvido por: GameDev Necromante96Official
Data de Criação: Novembro de 2025
Versão: 1.0.0.7
```

### Propriedade Intelectual Exclusiva

- **Logo e Marca Registrada**: Zenfisio™ é marca registrada e propriedade da clínica
- **Código-fonte**: Protegido por copyright © 2025 - Propriedade exclusiva da Zenfisio
- **Arquivos de Sistema**: Todos os direitos reservados
- **Documentação**: Propriedade intelectual da Zenfisio
- **Dados e Estruturas**: Desenvolvimento customizado para a clínica

### Avisos Legais Importantes

⚠️ **Este software é de propriedade exclusiva da Zenfisio e não pode ser:**

- Copiado ou duplicado de qualquer forma
- Compartilhado com terceiros
- Utilizado em outra organização
- Modificado ou adaptado sem autorização expressa
- Submetido a engenharia reversa
- Redistribuído ou vendido

### Conformidade Regulatória

- Sistema desenvolvido em conformidade com a **LGPD** (Lei Geral de Proteção de Dados)
- Atende normas do **Conselho Federal de Fisioterapia**
- Implementa segurança e privacidade de dados de pacientes
- Data: Novembro de 2025

### Proteção Legal

Qualquer violação dos direitos autorais ou termos de uso resultará em ações legais conforme previsto na legislação brasileira, incluindo:

- Ações civis por danos morais e materiais
- Ações criminais conforme Lei 9.610/98 (Lei de Direitos Autorais)
- Bloqueio de acesso ao software
- Multas e penalidades conforme legislação aplicável

---

## 🤝 Suporte Técnico

### Reportar Problemas

Para reportar problemas técnicos:

1. Entre em contato com a administração da clínica
2. Descreva claramente o problema encontrado
3. Forneça informações sobre quando ocorreu
4. Mencione qual módulo estava sendo utilizado

### Solicitações de Melhoria

Sugestões de melhorias são bem-vindas e devem ser:

- Reportadas para a administração da clínica
- Documentadas com descrição clara do benefício
- Analisadas pela equipe responsável
- Implementadas conforme prioridade da clínica

### Contato Responsável

- **Administração da Clínica**: Contatar diretamente
- **Desenvolvedor**: Lucas Tavares (autorizado apenas para assuntos técnicos)
- **Organização**: Zenfisio - Clínica de Fisioterapia

---

## 🗺️ Plano de Evolução

### Versão 1.1.0 (Prevista para Q1 2025)
- [ ] Integração com banco de dados seguro
- [ ] Autenticação multi-usuário com permissões
- [ ] Geração de relatórios em PDF
- [ ] Agendamento integrado de atendimentos
- [ ] Sincronização com Google Calendar

### Versão 1.2.0 (Prevista para Q2 2025)
- [ ] Aplicativo mobile para iOS/Android
- [ ] Notificações em tempo real
- [ ] Integração com WhatsApp Business
- [ ] SMS automático para confirmação
- [ ] Backup automático em nuvem segura

### Versão 2.0.0 (Futuro - 2025/2026)
- [ ] Analytics avançado com IA
- [ ] Dashboard executivo com KPIs
- [ ] Gestão de estoque e equipamentos
- [ ] Integração contábil
- [ ] API interna para sistemas parceiros

---

## 📈 Informações do Sistema

| Informação | Valor |
|-----------|-------|
| **Versão Atual** | 1.0.0.7 |
| **Data de Lançamento** | Novembro de 2025 |
| **Ano de Desenvolvimento** | 2025 |
| **Linhas de Código** | 15.000+ |
| **Módulos Principais** | 2 (Evoluções, Financeiro) |
| **Arquivos CSS** | 2.500+ linhas |
| **Dependências Externas** | Nenhuma (Vanilla Stack) |
| **Tamanho** | ~150 KB |
| **Performance** | 95+ (Lighthouse Score) |

---

## 🌟 Histórico de Versões

### Versão 1.0.0.7 (Novembro 2025) - ATUAL ✨

**🚀 Melhorias Implementadas:**
- ✅ **Exportação/Importação Completa v2** - Novo sistema com suporte a 3 formatos:
  - JSON (recomendado para importação/exportação estruturada)
  - TXT (formato legível para consulta e relatórios)
  - Markdown (documentação profissional)
- ✅ **Modal de Seleção de Formato** - Interface visual para escolher formato
- ✅ **Coleta Abrangente de Dados** - Captura todos os dados de todas as páginas e abas
- ✅ **Serialização Inteligente** - Suporta Maps, Dates e objetos complexos
- ✅ **Importação com Restauração Completa** - Restaura dados e recarrega UI automaticamente
- ✅ **Correção de Procedimentos** - Nome completo dos procedimentos exibido nas abas Especialidades, Registros e Pacientes
- ✅ **Sistema de Notificações Aprimorado** - Sem duplicação de ícones, mensagens limpas
- ✅ **Filtro Modal Funcional** - Aba flutuante de filtros operacional em análise financeira
- ✅ **Botões Responsivos** - Detecção correta de DOM readyState
- ✅ **Gravação de Dados Consolidada** - Auto-save a cada 10 segundos com sincronização perfeita

**🐛 Correções Implementadas:**
- ✅ Removido arquivo `export-import-manager.js` obsoleto
- ✅ Duplicação de ícones em notificações eliminada (5 instâncias corrigidas)
- ✅ Event listeners de botões agora funcionam corretamente
- ✅ Inicialização do export/import sincronizada com DOM
- ✅ Dados de procedimentos formatados corretamente
- ✅ Modal de filtros agora ativo e responsivo

**📊 Novo em v2:**
- Exportação em Markdown para relatórios profissionais
- Exportação em TXT legível para arquivamento
- Metadados completos em cada backup (data, versão, navegador, etc)
- Resumo quantitativo dos dados exportados
- Log detalhado de operações com timestamps
- Validação robusta de arquivos importados
- Sincronização automática UI após importação

**📝 Documentação:**
- ✅ README atualizado com novo sistema de export/import
- ✅ Histórico completo de versões documentado
- ✅ Instruções claras para todos os formatos
- ✅ Exemplos de uso para cada funcionalidade

### Versão 1.0.0.6 (Novembro 2025)

**✨ Características Implementadas:**
- ✅ Modal de confirmação personalizado
- ✅ Limpeza independente de dados por módulo
- ✅ Acumulação de dados sem limpeza automática
- ✅ Documentação completa (README.md)
- ✅ Estrutura modular e escalável
- ✅ Botões de filtro e limpeza posicionados corretamente
- ✅ Termos de uso específicos para Zenfisio

**🐛 Correções Implementadas:**
- ✅ Renderização correta de dados do Financeiro
- ✅ Botões funcionando adequadamente
- ✅ Validações de dados robustas
- ✅ Tratamento aprimorado de erros

**📚 Documentação Completa:**
- ✅ README.md com instruções de uso
- ✅ CHANGELOG.md com histórico
- ✅ Termos legais claros
- ✅ Estrutura de arquivos documentada

---

## 📞 Informações Importantes

### Avisos Críticos

⚠️ **LEITURA OBRIGATÓRIA:**

1. Este software é **propriedade exclusiva da Zenfisio**
2. **Acesso restrito** a funcionários autorizados apenas
3. **Proibido compartilhar** com qualquer pessoa fora da clínica
4. **Proibido copiar ou clonar** o código em qualquer circunstância
5. **Dados de pacientes são confidenciais** - LGPD compliance obrigatório
6. **Backup regular é essencial** para evitar perda de dados
7. **Suporte técnico exclusivo** para funcionários da clínica

### Contato para Dúvidas

Qualquer dúvida sobre uso, licença ou termos deve ser esclarecida com a administração da Clínica Zenfisio antes de utilizar o sistema.

---

<div align="center">
  
  **Auto Gerenciamento Zenfisio**
  
  Sistema Proprietário © 2025 - Zenfisio Clínica de Fisioterapia
  
  Todos os direitos reservados | LGPD Compliant | Versão 1.0.0.7
  
  *Desenvolvido com padrões profissionais e segurança de dados prioritária*
  
  [⬆ Voltar ao Topo](#auto-gerenciamento-zenfisio)
  
</div>
