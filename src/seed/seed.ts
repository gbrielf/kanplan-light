import {
  PrismaClient,
  Priority,
  ProjectStatus,
  TaskStatus,
} from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

const now = new Date();

function addDays(days: number) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.member.deleteMany();

  const members = await Promise.all([
    prisma.member.create({
      data: {
        name: 'Ricardo Almeida',
        email: 'ricardo@empresa.com',
        role: 'Gestor',
      },
    }),
    prisma.member.create({
      data: { name: 'Ana Costa', email: 'ana@empresa.com', role: 'Operações' },
    }),
    prisma.member.create({
      data: {
        name: 'João Santos',
        email: 'joao@empresa.com',
        role: 'Atendimento',
      },
    }),
    prisma.member.create({
      data: {
        name: 'Maria Silva',
        email: 'maria@empresa.com',
        role: 'Comercial',
      },
    }),
    prisma.member.create({
      data: {
        name: 'Pedro Lima',
        email: 'pedro@empresa.com',
        role: 'Financeiro',
      },
    }),
    prisma.member.create({
      data: {
        name: 'Juliana Rocha',
        email: 'juliana@empresa.com',
        role: 'Marketing',
      },
    }),
    prisma.member.create({
      data: {
        name: 'Carlos Souza',
        email: 'carlos@empresa.com',
        role: 'Suporte',
      },
    }),
    prisma.member.create({
      data: {
        name: 'Fernanda Alves',
        email: 'fernanda@empresa.com',
        role: 'Produto',
      },
    }),
    prisma.member.create({
      data: {
        name: 'Lucas Oliveira',
        email: 'lucas@empresa.com',
        role: 'Analista',
      },
    }),
    prisma.member.create({
      data: {
        name: 'Rafael Gomes',
        email: 'rafael@empresa.com',
        role: 'Design',
      },
    }),
  ]);

  const [
    ricardo,
    ana,
    joao,
    maria,
    pedro,
    juliana,
    carlos,
    fernanda,
    lucas,
    rafael,
  ] = members;

  const portalCliente = await prisma.project.create({
    data: {
      name: 'Portal do Cliente',
      description:
        'Centralização de solicitações e acompanhamento de clientes.',
      startDate: addDays(-10),
      dueDate: addDays(12),
      status: ProjectStatus.ACTIVE,
      priority: Priority.HIGH,
      members: {
        connect: [ana, joao, maria, carlos].map((member) => ({
          id: member.id,
        })),
      },
    },
  });

  const dashboardComercial = await prisma.project.create({
    data: {
      name: 'Dashboard Comercial',
      description: 'Painel para acompanhamento de vendas e metas comerciais.',
      startDate: addDays(-7),
      dueDate: addDays(6),
      status: ProjectStatus.ACTIVE,
      priority: Priority.MEDIUM,
      members: {
        connect: [maria, juliana, lucas].map((member) => ({ id: member.id })),
      },
    },
  });

  const sistemaFinanceiro = await prisma.project.create({
    data: {
      name: 'Sistema Financeiro',
      description:
        'Organização de contas, pagamentos e relatórios financeiros.',
      startDate: addDays(-14),
      dueDate: addDays(2),
      status: ProjectStatus.AT_RISK,
      priority: Priority.URGENT,
      members: {
        connect: [ricardo, pedro, ana, joao].map((member) => ({
          id: member.id,
        })),
      },
    },
  });

  const siteInstitucional = await prisma.project.create({
    data: {
      name: 'Site Institucional',
      description: 'Atualização do site público da empresa.',
      startDate: addDays(-20),
      dueDate: addDays(-2),
      status: ProjectStatus.COMPLETED,
      priority: Priority.LOW,
      members: {
        connect: [juliana, rafael, fernanda].map((member) => ({
          id: member.id,
        })),
      },
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Revisar contratos pendentes',
        description: 'Validar contratos antes do envio ao cliente.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.URGENT,
        dueDate: addDays(-1),
        projectId: sistemaFinanceiro.id,
        assigneeId: joao.id,
      },
      {
        title: 'Corrigir relatório de pagamentos',
        description: 'Ajustar inconsistências no relatório financeiro.',
        status: TaskStatus.VALIDATION,
        priority: Priority.URGENT,
        dueDate: addDays(1),
        projectId: sistemaFinanceiro.id,
        assigneeId: joao.id,
      },
      {
        title: 'Conferir notas fiscais',
        description: 'Verificar notas fiscais abertas do mês.',
        status: TaskStatus.REVIEW,
        priority: Priority.HIGH,
        dueDate: addDays(2),
        projectId: sistemaFinanceiro.id,
        assigneeId: joao.id,
      },
      {
        title: 'Atualizar fluxo de cobrança',
        description: 'Mapear etapas do processo de cobrança.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: addDays(-2),
        projectId: sistemaFinanceiro.id,
        assigneeId: joao.id,
      },

      {
        title: 'Cadastrar clientes piloto',
        description: 'Adicionar clientes para teste do portal.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.MEDIUM,
        dueDate: addDays(-2),
        projectId: portalCliente.id,
        assigneeId: ana.id,
      },
      {
        title: 'Validar tela de solicitações',
        description: 'Conferir se a tela atende ao fluxo real de atendimento.',
        status: TaskStatus.VALIDATION,
        priority: Priority.HIGH,
        dueDate: addDays(1),
        projectId: portalCliente.id,
        assigneeId: carlos.id,
      },
      {
        title: 'Organizar base de chamados',
        description: 'Separar chamados por categoria.',
        status: TaskStatus.TO_DO,
        priority: Priority.LOW,
        dueDate: addDays(7),
        projectId: portalCliente.id,
        assigneeId: maria.id,
      },

      {
        title: 'Definir métricas comerciais',
        description: 'Selecionar indicadores principais do dashboard.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.MEDIUM,
        dueDate: addDays(4),
        projectId: dashboardComercial.id,
        assigneeId: lucas.id,
      },
      {
        title: 'Revisar cards do dashboard',
        description: 'Validar se os cards ajudam a tomada de decisão.',
        status: TaskStatus.TO_DO,
        priority: Priority.LOW,
        dueDate: addDays(9),
        projectId: dashboardComercial.id,
        assigneeId: juliana.id,
      },
      {
        title: 'Levantar dados de vendas',
        description: 'Separar dados comerciais da última semana.',
        status: TaskStatus.TO_DO,
        priority: Priority.LOW,
        dueDate: addDays(8),
        projectId: dashboardComercial.id,
        assigneeId: maria.id,
      },
      {
        title: 'Revisar proposta de melhoria do produto',
        description: 'Analisar pontos de melhoria levantados pelo time.',
        status: TaskStatus.TO_DO,
        priority: Priority.LOW,
        dueDate: addDays(10),
        projectId: dashboardComercial.id,
        assigneeId: fernanda.id,
      },
      {
        title: 'Publicar página inicial',
        description: 'Finalizar publicação da home institucional.',
        status: TaskStatus.TO_DO,
        priority: Priority.LOW,
        dueDate: addDays(-6),
        projectId: siteInstitucional.id,
        assigneeId: pedro.id,
      },
      {
        title: 'Revisar textos institucionais',
        description: 'Ajustar textos finais do site.',
        status: TaskStatus.TO_DO,
        priority: Priority.LOW,
        dueDate: addDays(-5),
        projectId: siteInstitucional.id,
        assigneeId: ricardo.id,
      },
      {
        title: 'Ajustar formulário de contato',
        description: 'Corrigir envio do formulário.',
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        dueDate: addDays(-4),
        completedAt: addDays(-3),
        projectId: siteInstitucional.id,
        assigneeId: rafael.id,
      },
      {
        title: 'Validar versão mobile',
        description: 'Conferir responsividade das páginas principais.',
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        dueDate: addDays(-3),
        completedAt: addDays(-2),
        projectId: siteInstitucional.id,
        assigneeId: juliana.id,
      },
    ],
  });

  console.log('Seed executada com sucesso.');
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
