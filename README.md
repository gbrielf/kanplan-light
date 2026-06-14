# Kanplan Light

## 📌 Sobre o Projeto

O **Kanplan Light** é uma ferramenta simplificada de gestão de atividades desenvolvida para apoiar pequenas e médias empresas na organização do trabalho em equipe.

A solução foi construída considerando o contexto de um gestor que precisa acompanhar entregas, distribuir demandas, identificar riscos de atraso e tomar decisões baseadas em dados, sem a complexidade de ferramentas corporativas maiores.

O foco do produto é oferecer uma experiência simples, visual e orientada à tomada de decisão.

---

## 🎯 Objetivo

Permitir que gestores consigam:

* Centralizar o trabalho da equipe;
* Acompanhar atividades e projetos;
* Identificar riscos de atraso antecipadamente;
* Monitorar a capacidade operacional dos membros;
* Reatribuir tarefas entre responsáveis;
* Tomar decisões baseadas em indicadores.

---

## 🧠 Metodologia Escolhida

O projeto foi inspirado principalmente na metodologia **Kanban**, complementada por indicadores de desempenho e gestão simplificada da capacidade da equipe.

A escolha por uma abordagem baseada em Kanban foi motivada pela necessidade de simplicidade operacional, visibilidade rápida e facilidade de adoção.

Ao invés de implementar um framework ágil completo, a solução busca resolver problemas reais de gestão com o menor nível possível de complexidade.

### Princípios adotados

* Visualização clara do trabalho;
* Fluxo contínuo de atividades;
* Gestão baseada em indicadores;
* Identificação antecipada de riscos;
* Simplicidade de uso.

---

## 🚨 Problemas Atendidos

### Problema 1

> "O trabalho do time vive espalhado em planilha, papel e grupo de WhatsApp. Eu nunca sei o que está em andamento de verdade."

**Solução:** centralização de projetos e tarefas em uma única plataforma com quadro Kanban.

---

### Problema 2

> "Tem gente afogada de tarefa e gente ociosa — e eu só descubro quando alguém reclama ou quando algo não sai."

**Solução:** dashboard de capacidade da equipe, identificação de membros sobrecarregados ou ociosos e possibilidade de reatribuir tarefas.

---

### Problema 3

> "Prazo combinado com cliente estoura e eu só fico sabendo depois que estourou. Ninguém me avisa antes."

**Solução:** indicadores de tarefas atrasadas e tarefas em risco de vencimento.

---

### Problema 4

> "Na reunião de segunda-feira ninguém tem número nenhum. A conversa é toda baseada em ‘acho que foi uma boa semana’."

**Solução:** dashboard gerencial com KPIs operacionais para apoiar a tomada de decisão.

---

## ⚙️ Funcionalidades do MVP

## Dashboard Gerencial

Tela voltada para o acompanhamento da operação e apoio à decisão do gestor.

![alt text](<Screenshot from 2026-06-14 13-48-38.png>)
>imagem do dashboard gerencial com KPIs e cards de membros da equipe

### KPIs disponíveis

* Tarefas atrasadas;
* Tarefas próximas do vencimento;
* Membros sobrecarregados;
* Membros ociosos;
* Tarefas concluídas na semana;
* Total de projetos e tarefas na base.

---

## Capacidade da Equipe

O dashboard apresenta uma visão consolidada de cada membro da equipe, incluindo:

* Nome;
* Função;
* Quantidade de tarefas ativas;
* Quantidade de tarefas atrasadas;
* Score de carga;
* Status operacional.

### Status de capacidade

* Ocioso;
* Saudável;
* Atenção;
* Sobrecarregado.

Além disso, cada card de membro pode ser expandido para exibir as tarefas atribuídas naquele momento.

---

## Reatribuição de Tarefas

O sistema permite reatribuir tarefas para outro membro da equipe.

Essa funcionalidade está disponível:

* Na tela de Dashboard, dentro da visão expandida de cada membro;
* No quadro Kanban, diretamente nos cards de tarefa.

O objetivo é permitir que o gestor identifique uma sobrecarga e consiga agir imediatamente, sem precisar sair da tela atual.

---

## Quadro Kanban

Tela operacional para acompanhamento do fluxo das tarefas.

![alt text](<Screenshot from 2026-06-14 13-48-31.png>)
>imagem do quadro kanban com colunas: A iniciar, Em andamento, Validação, Revisão e Concluído

### Fluxo das tarefas

```txt
A iniciar → Em andamento → Validação → Revisão → Concluído
```

Cada tarefa pode avançar entre as colunas do fluxo.

---

## Gestão de Tarefas

O sistema permite cadastrar, acompanhar, atualizar status e reatribuir tarefas.

Cada tarefa possui:

* Título;
* Descrição;
* Responsável;
* Prioridade;
* Status;
* Prazo;
* Projeto associado;
* Data de criação.

### Prioridades disponíveis

* Baixa;
* Média;
* Alta;
* Urgente.

A prioridade é utilizada tanto para organização visual quanto para apoiar o cálculo da capacidade da equipe.

---

## Gestão de Projetos

As tarefas são organizadas por projeto.

Cada projeto possui:

* Nome;
* Descrição;
* Data de início;
* Data prevista de conclusão;
* Status;
* Prioridade.

### Status disponíveis

* Planejamento;
* Ativo;
* Em risco;
* Concluído.

---

## Sistema de Alertas

O sistema apresenta alertas visuais e indicadores para apoiar ação preventiva.

Exemplos:

* Tarefas atrasadas;
* Tarefas próximas do vencimento;
* Projetos em risco;
* Membros sobrecarregados;
* Membros com baixa carga.

O objetivo é permitir que o gestor aja antes que os problemas impactem clientes ou entregas.

---

## 📊 Indicadores e Justificativas

## Tarefas atrasadas

### Objetivo

Identificar rapidamente atividades que já ultrapassaram o prazo previsto.

### Decisão

Permite ao gestor agir imediatamente para reduzir impactos na entrega.

---

## Tarefas próximas do vencimento

### Objetivo

Antecipar possíveis atrasos.

### Decisão

Permite redistribuir trabalho ou redefinir prioridades antes do vencimento.

---

## Capacidade comprometida

### Objetivo

Identificar membros da equipe que estão concentrando atividades de maior criticidade.

### Decisão

Permite balancear a distribuição de trabalho.

### Observação

A capacidade não é calculada apenas pela quantidade de tarefas atribuídas.

O sistema considera também o peso relativo da prioridade das atividades, evitando conclusões incorretas em cenários onde poucas tarefas urgentes representam maior carga operacional do que diversas tarefas de baixa prioridade.

---

## Pessoas ociosas

### Objetivo

Identificar capacidade disponível na equipe.

### Decisão

Permite redistribuir atividades entre membros com menor carga.

---

## Tarefas concluídas na semana

### Objetivo

Monitorar o ritmo de entrega da equipe.

### Decisão

Permite acompanhar produtividade e evolução operacional.

---

## 🏗️ Arquitetura

O projeto segue uma organização baseada em separação de responsabilidades.

```txt
src/
│
├── app/
│   ├── api/
│   │   ├── dashboard/
│   │   ├── members/
│   │   ├── projects/
│   │   └── tasks/
│   │
│   ├── board/
│   ├── dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── icons/
│   ├── kanban/
│   └── ui/
│
├── lib/
├── repositories/
├── seed/
└── services/
```

### Camadas principais

* **app/api:** rotas HTTP da aplicação;
* **repositories:** comunicação com o banco de dados via Prisma;
* **services:** regras de negócio e cálculos da aplicação;
* **components:** componentes visuais reutilizáveis;
* **seed:** dados iniciais para demonstração.

---

## 🗄️ Modelo de Domínio

Entidades principais:

* Project;
* Member;
* Task.

Relacionamentos:

```txt
Project
 └── Tasks

Member
 └── Tasks
```

Uma tarefa pertence a um projeto e possui um membro responsável.

---

## 🛠️ Tecnologias Utilizadas

* Next.js;
* TypeScript;
* Tailwind CSS;
* shadcn/ui;
* Prisma ORM;
* SQLite.

---

## 🧪 Dados de Exemplo

A aplicação é entregue com dados previamente carregados por seed.

Os dados incluem:

* Projetos fictícios;
* Equipe fictícia;
* Tarefas distribuídas;
* Cenários de atraso;
* Cenários de sobrecarga;
* Cenários de ociosidade;
* Projetos em risco.

O objetivo é permitir a avaliação completa da solução sem necessidade de cadastro manual.

---

## 🚀 Como Executar

## Requisitos

* Node.js;
* npm;
* Prisma;
* SQLite.

---

## Instalar dependências

```bash
npm install
```

---

## Gerar cliente Prisma

```bash
npx prisma generate
```

---

## Executar migrations

```bash
npx prisma migrate dev
```

---

## Carregar dados de exemplo

```bash
npx prisma db seed
```

---

## Iniciar aplicação

```bash
npm run dev
```

Aplicação disponível em:

```txt
http://localhost:3000
```

---

## Rotas principais

```txt
/           → redireciona para /board
/board      → quadro Kanban
/dashboard  → dashboard gerencial
```

---

## 🐳 Dev Container

O projeto possui configuração de Dev Container para facilitar a execução em ambiente padronizado.

Para utilizar:

1. Abra o projeto no VS Code;
2. Execute o comando:

```txt
Dev Containers: Reopen in Container
```

3. Aguarde a instalação das dependências;
4. Execute a aplicação normalmente:

```bash
npm run dev
```

---

## ❌ Escopo Não Implementado

Por restrição de prazo, algumas funcionalidades foram propositalmente deixadas fora do MVP:

* Scrum completo;
* Sprint Planning funcional;
* User Stories;
* Backlog estruturado;
* Autenticação;
* Gestão avançada de permissões;
* Notificações em tempo real;
* Comentários em tarefas;
* Histórico de atividades;
* Drag and Drop no Kanban;
* Multi-organização;
* Integrações externas;
* Dashboard avançado por projeto.

A prioridade foi entregar uma solução funcional, apresentável e alinhada às necessidades centrais do problema proposto.

---

## 🔮 Evoluções Futuras

* Drag and Drop completo no quadro Kanban;
* Comentários em tarefas;
* Etiquetas personalizadas;
* Histórico de movimentação;
* Dashboard por projeto;
* Filtros avançados por responsável, projeto e prioridade;
* Autenticação;
* Permissões por perfil;
* Notificações;
* Integração com calendário;
* Relatórios exportáveis;
* Métricas históricas de produtividade.

---

## ✅ Status do MVP

O MVP entregue permite:

* Visualizar tarefas em quadro Kanban;
* Criar novas tarefas;
* Avançar tarefas no fluxo;
* Reatribuir tarefas;
* Visualizar KPIs gerenciais;
* Identificar atrasos e riscos;
* Identificar sobrecarga e ociosidade;
* Acompanhar saúde dos projetos;
* Utilizar dados de demonstração via seed.

O Kanplan Light entrega uma base funcional para gestão visual do trabalho, com foco em simplicidade, clareza e tomada de decisão.
