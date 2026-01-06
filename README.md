Razonete Pro | Auditoria & Controladoria Visual

Acesse a aplicação: razonete.app.br

O Razonete Pro é uma plataforma Cloud-Native desenvolvida para modernizar a visualização, auditoria e simulação de lançamentos contábeis. A ferramenta digitaliza a metáfora visual clássica dos Razonetes (T-Accounts), adicionando uma camada de inteligência de dados, validação em tempo real e persistência na nuvem.

Projeto concebido e desenvolvido com foco na intersecção entre Controladoria, Ciência de Dados e UX Corporativa.

🎯 O Problema & A Solução

O Desafio: Profissionais de contabilidade e estudantes operam frequentemente em dois extremos ineficientes: ERPs rígidos ("caixa-preta") onde a visualização do fluxo é difícil, ou folhas de cálculo frágeis e propensas a erros manuais. A simulação de cenários complexos (como ajustes de auditoria ou fusões) carece de agilidade e rastreabilidade.

A Solução: Um ambiente SaaS seguro e responsivo onde é possível:

Simular lançamentos com validação imediata do método das Partidas Dobradas.

Organizar visualmente as contas através de uma interface "Drag & Drop".

Gerir Múltiplos Livros (Multitenancy Lógico) para diferentes clientes ou exercícios.

Extrair Inteligência via exportação estruturada para ferramentas de BI e Data Science.

🚀 Funcionalidades Implementadas

Core Contábil & Auditoria

Motor de Partidas Dobradas: Algoritmo reativo que monitoriza a equação ∑ Débitos = ∑ Créditos em tempo real, alertando sobre divergências no milissegundo em que ocorrem.

Balancete Interativo: Geração automática de relatório com cross-footing (soma cruzada) dos saldos.

Filtros de Competência: Capacidade de filtrar o balancete por período (Data Inicial / Data Final), essencial para análises temporais.

Gestão & Organização

Gestão de Livros/Empresas: Sistema que permite criar múltiplos cenários isolados (ex: "Cliente A", "Simulação Fusão").

Interface Drag & Drop: Organização visual das contas (Ativo, Passivo, PL) através de arrastar e soltar, utilizando API nativa do navegador para máxima performance.

Audit Trail (Arquivamento): Funcionalidade de soft delete que oculta contas da visão operacional sem destruir o histórico do lançamento.

Arquitetura de Dados & Nuvem

Sincronização Híbrida (Offline-First): O sistema funciona localmente (localStorage) para utilizadores anónimos e sincroniza com a nuvem (Firestore) assim que o utilizador faz login.

Autenticação Segura: Integração com Google Auth (OAuth 2.0) para gestão de identidade.

Telemetria (GA4): Monitorização avançada de eventos de conversão e uso da ferramenta.

📊 Para Cientistas de Dados

A ferramenta foi arquitetada para funcionar como um ETL Visual. Ao contrário de um ERP tradicional, o Razonete Pro foca na extração de datasets normalizados para ingestão em Python (Pandas/Scikit-Learn) ou Power BI.

Estrutura de Exportação (CSV):

Projeto;ID_Conta;Conta;Status;Natureza;Tipo;Valor;Ref;Data;Nota
"Auditoria Q4";"uuid-1";"Caixa";"Ativo";"Débito";"Debito";15000.00;"Aporte";"2024-12-01";"Integralização Capital"


Casos de Uso de IA:

Deteção de anomalias em lançamentos manuais (Lei de Benford).

Previsão de fluxo de caixa baseada em séries temporais de simulação.

Clustering de contas para revisão analítica automatizada.

🛠️ Stack Tecnológica

O projeto segue princípios de Clean Architecture e Serverless, minimizando dependências externas para garantir longevidade e segurança.

Frontend: React 18 + Vite.

Linguagem: JavaScript (ES6+).

Estilização: Tailwind CSS (Design System responsivo).

Backend as a Service (BaaS): Firebase (Authentication & Firestore).

Analytics: Google Analytics 4 (Event-based tracking).

CI/CD: GitHub Actions (Deploy automático).

💻 Como Rodar Localmente

Para clonar e contribuir com o projeto:

# 1. Clone o repositório
git clone [https://github.com/tiagotdas/razonete.app.git](https://github.com/tiagotdas/razonete.app.git)

# 2. Instale as dependências
npm install

# 3. Configure o Firebase
# Adicione as suas chaves API no código ou variáveis de ambiente

# 4. Inicie o servidor de desenvolvimento
npm run dev


👨‍💻 Autor

Tiago de Amorim Silva Contador & Cientista de Dados | MBA FGV

Desenvolvido como um ativo de portfólio que une o rigor da Controladoria com a inovação da Inteligência Artificial.
