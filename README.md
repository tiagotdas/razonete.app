Razonete Pro | Auditoria & Controladoria Visual

Acesse a aplicação: razonete.app.br

O Razonete Pro é uma plataforma Cloud-Native desenvolvida para modernizar a visualização, auditoria e simulação de lançamentos contábeis. Combina a metáfora visual clássica dos Razonetes (T-Accounts) com a robustez de uma arquitetura de dados moderna, garantindo integridade e conformidade em tempo real.

Projeto desenvolvido com foco em Controladoria, Ciência de Dados e UX Corporativa.

🎯 O Problema & A Solução

O Desafio: Auditores e Controllers operam frequentemente em dois extremos ineficientes: ERPs rígidos ("caixa-preta") ou folhas de cálculo frágeis e sem controlo de versão. A simulação de cenários complexos (fusões, ajustes de auditoria) carece de agilidade e rastreabilidade.

A Solução: Um ambiente SaaS seguro onde o profissional pode:

Simular lançamentos com validação imediata de Partidas Dobradas.

Gerir Múltiplos Cenários (Multitenancy Lógico) para diferentes clientes ou exercícios.

Persistir Dados na Nuvem (Firebase) para acesso multidispositivo e segurança.

Extrair Inteligência via exportação estruturada para ferramentas de BI e Data Science.

🚀 Funcionalidades Implementadas

Core Contábil

Motor de Partidas Dobradas: Algoritmo reativo que monitoriza a equação ∑ Débitos = ∑ Créditos em tempo real, alertando sobre divergências.

Balancete Interativo: Relatório de verificação com cross-footing automático.

Filtros Temporais: Capacidade de gerar balancetes por período (Data Inicial / Data Final), respeitando o regime de competência.

Gestão & Auditoria

Multitenancy Lógico (Projetos): Criação e gestão de múltiplos cenários ("Cliente A", "Simulação Fusão") isolados dentro da mesma conta.

Audit Trail (Arquivamento): Sistema de soft delete que permite ocultar contas da visão operacional sem destruir o histórico do lançamento.

Modelo "Donationware": Integração de interface para apoio voluntário via Pix (QR Code dinâmico).

Arquitetura de Dados & Nuvem

Sincronização Híbrida: O sistema funciona Offline (LocalStorage) e sincroniza com a Nuvem (Firestore) assim que o utilizador faz login.

Autenticação Segura: Integração com Google Auth (OAuth 2.0).

Feedback Visual: Indicadores de estado de gravação (Salvando, Salvo, Erro).

Engenharia & UX

Internacionalização (i18n): Suporte nativo e troca instantânea entre Português (BRL), Inglês (USD) e Espanhol (EUR).

Telemetria (GA4): Monitorização de eventos de conversão, engajamento e funil de utilização.

Responsividade: Interface adaptativa utilizando CSS Grid avançado para uso em Desktop e Mobile.

📊 Para Cientistas de Dados & Auditores

A ferramenta foi desenhada como um ETL Visual. Ao contrário de um ERP tradicional, o Razonete Pro permite a extração de datasets normalizados para ingestão em Python (Pandas/Scikit-Learn).

Estrutura de Exportação (CSV):

Projeto;ID_Conta;Conta;Status;Natureza;Tipo;Valor;Ref;Data;Nota
"Auditoria Q4";"uuid-1";"Caixa";"Ativo";"Débito";"Debito";15000.00;"Aporte";"2024-12-01";"Integralização Capital"


Casos de Uso de IA:

Deteção de anomalias em lançamentos manuais (Benford's Law).

Previsão de fluxo de caixa baseada em séries temporais de simulação.

Clustering de contas para revisão analítica.

🛠️ Stack Tecnológica

O projeto segue princípios de Clean Architecture e Serverless:

Frontend: React 18 + Vite.

Estilização: Tailwind CSS + Lucide React Icons.

Backend as a Service (BaaS): Firebase (Authentication & Firestore).

Analytics: Google Analytics 4 (Event-based tracking).

Deploy: CI/CD via GitHub Actions e infraestrutura GitHub Pages.

💻 Como Rodar Localmente

Caso queira clonar e contribuir com o projeto:

# 1. Clone o repositório
git clone [https://github.com/tiagotdas/razonete-app.git](https://github.com/tiagotdas/razonete-app.git)

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (Firebase)
# Crie um arquivo .env na raiz com as suas chaves API

# 4. Rode o servidor de desenvolvimento
npm run dev


👨‍💻 Autor

Tiago de Amorim Silva
Contador & Cientista de Dados | MBA FGV

Desenvolvido como um ativo de portfólio que une o rigor da Controladoria com a inovação da Inteligência Artificial.
