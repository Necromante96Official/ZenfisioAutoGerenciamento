<div align="center">
  <img src="assets/logo.svg" alt="Zenfisio Logo" width="150">
  
  # Auto Gerenciamento Zenfisio
  
  **Sistema Inteligente de Gerenciamento de Dados e Análise Financeira para Clínicas de Fisioterapia**
  
  [![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0.6-brightgreen)](https://github.com/Necromante96Official/ZenfisioAutoGerenciamento)
  [![Licença](https://img.shields.io/badge/licen%C3%A7a-Proprietária-blue)](LICENSE)
  [![Status](https://img.shields.io/badge/status-Em%20Desenvolvimento-yellow)](https://github.com/Necromante96Official/ZenfisioAutoGerenciamento)
  
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

**Auto Gerenciamento Zenfisio** é uma solução web moderna e intuitiva desenvolvida especificamente para clínicas de fisioterapia. O sistema automatiza o processamento de dados de pacientes, análise de evoluções pendentes e fornece insights financeiros detalhados através de uma interface responsiva e amigável.

Desenvolvido com tecnologias vanilla JavaScript, HTML5 e CSS3, o projeto oferece uma experiência leve, rápida e confiável, sem dependências externas complexas.

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
- **Exportação de Dados**: Backup e compartilhamento de informações

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
- **Armazenamento Local**: Dados persistidos em LocalStorage
- **Auto-save**: Salvamento automático a cada 10 segundos
- **Backup Inteligente**: Exportação e importação de dados em JSON
- **Limpeza Modular**: Remova dados de forma independente por módulo
- **Histórico de Versões**: Rastreamento completo de atualizações

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

## 🚀 Instalação e Configuração

### Pré-requisitos
- Navegador moderno com suporte a ES6+ (Chrome 51+, Firefox 54+, Safari 10+, Edge 15+)
- Servidor web local (para servir arquivos estáticos)

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/Necromante96Official/ZenfisioAutoGerenciamento.git
cd ZenfisioAutoGerenciamento
```

### Passo 2: Iniciar Servidor Local

**Opção A: Python 3**
```bash
python -m http.server 8000
```

**Opção B: Node.js**
```bash
npx http-server
```

**Opção C: PowerShell Windows (Incluído)**
```batch
server.bat
```

### Passo 3: Acessar a Aplicação

Abra seu navegador e acesse:
```
http://localhost:8000
```

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

4. **Limpeza**
   - Use "Limpar Financeiro" para remover dados deste módulo
   - Dados de Evoluções **não serão afetados**

5. **Exportação**
   - Clique em "Exportar" para baixar dados em JSON
   - Guarde como backup ou para compartilhamento

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
├── js/                                 # Versão antiga (legado)
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

---

## 📜 Termos de Uso

### 1. Licença de Uso

Este software é fornecido sob uma **Licença Proprietária Personalizada**. Você tem direito de:
- ✅ Usar o software em sua clínica
- ✅ Fazer backup e restauração
- ✅ Usar em ambiente local/privado
- ✅ Customizar para sua operação específica

### 2. Restrições

Você **NÃO** pode:
- ❌ Redistribuir o software sem autorização
- ❌ Vender ou ofertar comercialmente
- ❌ Remover ou modificar avisos de copyright
- ❌ Usar em terceiros sem consentimento
- ❌ Criar versões derivadas para revenda

### 3. Dados Pessoais

- Todos os dados são armazenados **localmente** em sua máquina
- Nenhuma informação é enviada para servidores externos
- Você mantém controle total sobre seus dados
- Recomenda-se fazer backup regularmente

### 4. Suporte

- Suporte técnico disponível através do repositório GitHub
- Reportar bugs através de Issues
- Sugestões e melhorias bem-vindas

### 5. Limitação de Responsabilidade

Este software é fornecido "COMO ESTÁ", sem garantias. O desenvolvedor não se responsabiliza por:
- Perda de dados
- Interrupções de serviço
- Danos diretos ou indiretos
- Uso indevido ou negligência

---

## ©️ Direitos Autorais

```
© 2024-2025 Auto Gerenciamento Zenfisio
Todos os direitos reservados.

Desenvolvido por: Lucas Tavares
Zenfisio - Clínica de Fisioterapia
```

### Propriedade Intelectual

- **Logo e Marca**: Zenfisio™ é marca registrada
- **Código-fonte**: Protegido por copyright © 2024-2025
- **Documentação**: Todos os direitos reservados
- **Versão**: 1.0.0.6

### Exceções de Copyright

Você pode usar este software:
- Para fins internos da sua clínica
- Para backup e recuperação
- Para customização local
- Conforme permitido pelos termos de uso acima

### Atribuição

Ao usar este software, você concorda em:
- Manter avisos de copyright e licença
- Reconhecer o trabalho desenvolvido
- Informar bugs e sugestões aos desenvolvedores

---

## 🤝 Suporte e Contribuição

### Reportar Bugs

1. Acesse o repositório GitHub
2. Clique em "Issues"
3. Crie um novo issue com:
   - Título descritivo
   - Descrição detalhada
   - Passos para reproduzir
   - Screenshots se aplicável
   - Versão do navegador

### Sugerir Melhorias

- Contribuições e sugestões são bem-vindas
- Descreva claramente sua sugestão
- Explique o benefício para o projeto
- Exemplos de uso são apreciados

### Contato

- **GitHub**: [Necromante96Official](https://github.com/Necromante96Official)
- **Email**: Disponível no perfil GitHub
- **Organização**: Zenfisio - Clínica de Fisioterapia

---

## 🗺️ Roadmap

### Versão 1.1.0 (Próxima)
- [ ] Integração com banco de dados backend
- [ ] Autenticação e multi-usuário
- [ ] Relatórios em PDF
- [ ] Agendamento de atendimentos
- [ ] Integração com calendário (Google Calendar)

### Versão 1.2.0 (Futuro)
- [ ] App mobile (React Native/Flutter)
- [ ] Notificações push
- [ ] Integração com WhatsApp
- [ ] SMS confirmação de agendamentos
- [ ] Sync em nuvem

### Versão 2.0.0 (Longo Prazo)
- [ ] Inteligência Artificial para previsão
- [ ] Dashboard executivo com BI
- [ ] Gestão de estoque e equipamentos
- [ ] Integração com sistemas contábeis
- [ ] API para terceiros

---

## 📈 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| **Versão Atual** | 1.0.0.6 |
| **Linha de Código** | 15.000+ |
| **Módulos** | 2 (Evoluções, Financeiro) |
| **Estilos CSS** | 2.500+ linhas |
| **Sem Dependências Externas** | ✅ Sim |
| **Tamanho (Minificado)** | ~150 KB |
| **Performance (Lighthouse)** | 95+ |

---

## 🌟 Destaques da Versão 1.0.0.6

### ✨ Novidades
- ✅ Modal de confirmação personalizado
- ✅ Limpeza independente por módulo
- ✅ Acumulação de dados (sem auto-limpeza)
- ✅ Documentação completa
- ✅ Estrutura modular melhorada

### 🐛 Correções
- ✅ Renderização de dados Financeiro
- ✅ Botões de filtro funcionando corretamente
- ✅ Validações de dados robustas
- ✅ Tratamento de erros aprimorado

### 📚 Documentação
- ✅ README.md detalhado
- ✅ CHANGELOG.md completo
- ✅ Histórico de versões
- ✅ Exemplos de uso

---

## 📞 Precisa de Ajuda?

1. **Leia a Documentação**: Comece pelo README
2. **Verifique Exemplos**: Consulte o histórico do projeto
3. **Abra uma Issue**: Descreva seu problema em detalhes
4. **Procure na Internet**: Muitos problemas têm soluções conhecidas

---

## 📄 Licença

Este projeto está licenciado sob uma **Licença Proprietária Personalizada**.

Veja o arquivo [LICENSE](LICENSE) para detalhes completos.

---

<div align="center">
  
  **Desenvolvido com ❤️ para Zenfisio - Clínica de Fisioterapia**
  
  © 2024-2025 • Todos os direitos reservados • Versão 1.0.0.6
  
  [⬆ Voltar ao Topo](#auto-gerenciamento-zenfisio)
  
</div>
