Razonete Pro | Auditoria & Controladoria Visual

Acesse a aplicação: razonete.app.br

O Razonete Pro é uma aplicação SaaS (Software as a Service) desenvolvida para modernizar a visualização e auditoria de lançamentos contábeis. Diferente de planilhas frágeis ou ERPs "caixa-preta", esta ferramenta utiliza a metáfora visual dos Razonetes (T-Accounts) combinada com validação algorítmica em tempo real.

Projeto desenvolvido com foco em Integridade de Dados, UX/UI Corporativa e Preparação para Data Science.

🎯 O Problema & A Solução

O Desafio: Auditores, Controllers e Estudantes frequentemente lutam para visualizar o impacto de ajustes contábeis complexos. O Excel carece de estrutura relacional e os ERPs carecem de agilidade visual.

A Solução: Um "Sandbox Contábil" onde o profissional pode:

Simular lançamentos de débito e crédito com feedback visual imediato.

Garantir o princípio das Partidas Dobradas (Double-Entry Bookkeeping) automaticamente.

Gerar dados estruturados (CSV) prontos para ingestão em pipelines de Data Science (Pandas/Python).

🚀 Funcionalidades Chave

Core Contábil

Motor de Partidas Dobradas: Algoritmo que monitora em tempo real a equação ∑ Débitos = ∑ Créditos, alertando sobre divergências no milissegundo em que ocorrem.

Balancete de Verificação (Trial Balance): Geração automática de relatório com cross-footing (soma cruzada) dos saldos.

Audit Trail (Soft Delete): Sistema de arquivamento que permite ocultar contas da visão operacional sem destruir o histórico do lançamento (fundamental para rastreabilidade).

Arquitetura de Dados

Multitenancy Lógico: Capacidade de gerenciar múltiplos cenários ou clientes ("Cliente A", "Simulação Fusão") de forma isolada no mesmo navegador.

Exportação Estruturada: Geração de ficheiros CSV normalizados e Excel-friendly, segregados por ID, Natureza e Projeto.

Validação Temporal: Filtro de Balancete por período ("De/Até") respeitando o regime de competência.

Engenharia & UX

Internacionalização (i18n): Suporte nativo e instantâneo para Português (BRL), Inglês (USD) e Espanhol (EUR).

Grid Responsivo Inteligente: Layout adaptativo que utiliza minmax e auto-fill para garantir a legibilidade dos T's em qualquer dispositivo.

Telemetria (GA4): Monitoramento de eventos de conversão e engajamento.

🛠️ Tech Stack & Arquitetura

Este projeto foi construído seguindo os princípios de Clean Code e Component-Based Architecture.

Frontend: React 18 (Hooks avançados: useMemo para cálculos pesados, useEffect para persistência).

Estilização: Tailwind CSS (Design System responsivo).

Build Tool: Vite (Performance otimizada).

Icons: Lucide React.

Analytics: Google Analytics 4 (Event-based tracking).

Deployment: CI/CD automatizado via GitHub Actions, hospedado em infraestrutura GitHub Pages com domínio personalizado e SSL.

📊 Para Cientistas de Dados & Auditores

A ferramenta foi desenhada para ser o "Elo Perdido" na extração de dados. Ao exportar o CSV, você obtém um dataset limpo:

Projeto;ID_Conta;Conta;Status;Natureza;Tipo;Valor;Ref;Data;Nota
"Auditoria 2024";"uuid-1";"Caixa";"Ativo";"Débito";"Debito";1000.00;"Aporte";"2024-01-01";"Integralização"


Isso permite ingestão direta em Python (Pandas) para análises de:

Detecção de anomalias (Benford's Law).

Análise de liquidez preditiva.

Clustering de lançamentos atípicos.

👨‍💻 Autor

Tiago de Amorim Silva Contador & Cientista de Dados | MBA FGV

Desenvolvido como parte de um portfólio que une o rigor da Controladoria com a inovação da Inteligência Artificial.
