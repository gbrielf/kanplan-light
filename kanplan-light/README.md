# Kanplan Light

## 📌 Sobre o Projeto

O Kanplan Light é uma ferramenta simplificada de gestão de atividades desenvolvida para resolver problemas comuns enfrentados por pequenas e médias empresas na organização do trabalho em equipe.

A solução foi criada considerando o contexto de um gestor que precisa acompanhar entregas, distribuir demandas, identificar riscos de atraso e tomar decisões baseadas em dados, sem a complexidade encontrada em ferramentas corporativas maiores.

O foco do produto é oferecer uma experiência simples, intuitiva e orientada à tomada de decisão.

---

# 🎯 Objetivo

Permitir que gestores:

* Centralizem o trabalho da equipe
* Acompanhem atividades e projetos
* Identifiquem riscos de atraso antecipadamente
* Monitorem a capacidade operacional da equipe
* Tomem decisões baseadas em indicadores

---

# 🧠 Metodologia Escolhida

O projeto foi inspirado principalmente na metodologia Kanban, complementada por indicadores de desempenho e gestão simplificada da capacidade da equipe.

A escolha por uma abordagem baseada em Kanban foi motivada pela necessidade de simplicidade operacional, visibilidade rápida e facilidade de adoção.

Ao invés de implementar um framework ágil completo, a solução busca resolver problemas reais de gestão com o menor nível possível de complexidade.

Princípios adotados:

* Visualização clara do trabalho
* Fluxo contínuo de atividades
* Gestão baseada em indicadores
* Identificação antecipada de riscos
* Simplicidade de uso

---

# 🚨 Problemas Atendidos

## Problema 1

> "O trabalho do time vive espalhado em planilha, papel e grupo de WhatsApp."

### Solução

Centralização de projetos e tarefas em uma única plataforma.

---

## Problema 2

> "Tem gente afogada de tarefa e gente ociosa."

### Solução

Indicadores de capacidade da equipe e visão consolidada dos responsáveis.

---

## Problema 3

> "Prazo combinado com cliente estoura e eu só fico sabendo depois."

### Solução

Sistema de alertas preventivos e identificação de projetos em risco.

---

## Problema 4

> "Na reunião ninguém tem número nenhum."

### Solução

Dashboard com indicadores operacionais e métricas de acompanhamento.

---

# ⚙️ Funcionalidades do MVP

## Dashboard Gerencial

Tela principal da aplicação contendo visão consolidada da operação.

### KPIs

* Tarefas atrasadas
* Tarefas próximas do vencimento
* Capacidade comprometida da equipe
* Pessoas ociosas
* Tarefas concluídas na semana
* Tempo médio de conclusão

---

## Saúde do Time

Painel contendo:

* Quantidade de tarefas atrasadas
* Quantidade de tarefas em risco
* Capacidade comprometida
* Produtividade semanal

---

## Evolução do Trabalho

Visualizações gráficas para acompanhamento do andamento da equipe.

### Indicadores

* Evolução de tarefas concluídas
* Quantidade de tarefas restantes

Esses gráficos foram inspirados em práticas ágeis de acompanhamento de fluxo de trabalho, porém adaptados para um contexto simplificado de gestão.

---

## Gestão de Projetos

Permite organizar tarefas por contexto de entrega.

Cada projeto possui:

* Nome
* Descrição
* Data de início
* Data prevista de conclusão
* Status

Status disponíveis:

* Planejamento
* Ativo
* Em risco
* Concluído

---

## Gestão de Tarefas

Permite cadastrar, acompanhar e atualizar atividades da equipe.

Cada tarefa possui:

* Título
* Descrição
* Responsável
* Prioridade
* Status
* Prazo
* Projeto associado
* Data de criação

### Fluxo Kanban

```txt
A iniciar → Em andamento → Validação → Revisão → Concluído
```

### Prioridades

* Baixa
* Média
* Alta
* Urgente

A prioridade é utilizada para apoiar a organização visual das atividades e o cálculo dos indicadores de capacidade.

---

## Gestão Simplificada da Equipe

Cada membro possui uma visão resumida contendo:

* Tarefas concluídas
* Tarefas em andamento
* Tarefas atrasadas
* Indicadores de capacidade

---

## Sistema de Alertas

O sistema gera alertas preventivos para apoiar a tomada de decisão.

Exemplos:

* Tarefas atrasadas
* Tarefas urgentes próximas do vencimento
* Projetos em risco
* Capacidade comprometida da equipe

O objetivo é permitir ação preventiva antes que os problemas impactem clientes ou entregas.

---

# 📊 Indicadores e Justificativas

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

Identificar capacidade disponível.

### Decisão

Permite redistribuir atividades entre membros da equipe.

---

## Tarefas concluídas na semana

### Objetivo

Monitorar o ritmo de entrega da equipe.

### Decisão

Permite acompanhar produtividade e evolução operacional.

---

## Tempo médio de conclusão

### Objetivo

Medir quanto tempo as atividades levam para serem concluídas.

### Decisão

Permite melhorar previsibilidade e planejamento futuro.

---

# 🏗️ Arquitetura

O projeto segue uma arquitetura inspirada na separação de responsabilidades utilizada em aplicações backend modernas.

```txt
src/
│
├── app/
│   ├── api/
│   ├── dashboard/
│   └── board/
│
├── models/
├── services/
├── repositories/
├── dto/
├── components/
├── lib/
├── utils/
├── constants/
└── seed/
```

---

# 🗄️ Modelo de Domínio

Entidades principais:

* Project
* Member
* Task

Relacionamentos:

```txt
Project
 └── Tasks

Member
 └── Tasks
```

---

# 🛠️ Tecnologias Utilizadas

* Next.js
* TypeScript
* TailwindCSS
* shadcn/ui
* Prisma ORM
* SQLite
* Recharts
* Zod

---

# 🧪 Dados de Exemplo

A aplicação será entregue com dados previamente carregados.

Serão disponibilizados:

* Projetos fictícios
* Equipe fictícia
* Tarefas distribuídas
* Cenários de atraso
* Cenários de sobrecarga
* Cenários de ociosidade
* Projetos em risco

O objetivo é permitir a avaliação completa da solução sem necessidade de cadastro manual.

---

# ❌ Escopo Não Implementado

Por restrição de prazo, algumas funcionalidades foram propositalmente removidas:

* Scrum completo
* Sprint Planning
* User Stories
* Backlog estruturado
* Integração com Google Agenda
* Autenticação Google
* Notificações em tempo real
* Gestão avançada de permissões
* Multi-organização
* Integrações externas

A prioridade foi entregar uma solução funcional e alinhada às necessidades centrais do problema proposto.

---

# 🚀 Como Executar

## Instalar dependências

```bash
npm install
```

## Executar migrations

```bash
npx prisma migrate dev
```

## Iniciar aplicação

```bash
npm run dev
```

Aplicação disponível em:

```txt
http://localhost:3000
```

---

# 🔮 Evoluções Futuras

* Drag and Drop completo no quadro Kanban
* Comentários em tarefas
* Etiquetas
* Histórico de atividades
* Dashboard avançado por projeto
* Integração com calendário
* Sistema de notificações
* Autenticação
* Permissões por perfil
