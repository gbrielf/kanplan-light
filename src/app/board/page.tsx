'use client';
import { TaskCard } from '@/components/kanban/task-card';
import { KpiCard } from '@/components/kanban/kpi-card';
import { Sidebar } from '@/components/kanban/side-bar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useEffect, useMemo, useState } from 'react';
import { TaskIcon } from '@/components/icons/task-icon';

type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'VALIDATION' | 'REVIEW' | 'DONE';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  createdAt: string;
  dueDate: string;
  project: {
    name: string;
  };
  assignee: {
    id: string;
    name: string;
  };
};

type Project = {
  id: string;
  name: string;
};

type Member = {
  id: string;
  name: string;
};

type CreateTaskForm = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  projectId: string;
  assigneeId: string;
};

type DashboardData = {
  kpis: {
    overdueTasks: number;
    tasksAtRisk: number;
    overloadedMembers: number;
    idleMembers: number;
    completedThisWeek: number;
  };
};

const columns: { status: TaskStatus; title: string }[] = [
  { status: 'TO_DO', title: 'A iniciar' },
  { status: 'IN_PROGRESS', title: 'Em andamento' },
  { status: 'VALIDATION', title: 'Validação' },
  { status: 'REVIEW', title: 'Revisão' },
  { status: 'DONE', title: 'Concluído' },
];

const nextStatus: Record<TaskStatus, TaskStatus | null> = {
  TO_DO: 'IN_PROGRESS',
  IN_PROGRESS: 'VALIDATION',
  VALIDATION: 'REVIEW',
  REVIEW: 'DONE',
  DONE: null,
};

const priorityLabel: Record<Priority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

const priorityWeight: Record<Priority, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

function sortTasksByPriorityAndDueDate(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    const priorityDiff =
      priorityWeight[b.priority] - priorityWeight[a.priority];

    if (priorityDiff !== 0) return priorityDiff;

    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  const [form, setForm] = useState<CreateTaskForm>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    projectId: '',
    assigneeId: '',
  });

  async function loadFormData() {
    const [projectsResponse, membersResponse] = await Promise.all([
      fetch('/api/projects'),
      fetch('/api/members'),
    ]);

    const projectsData = await projectsResponse.json();
    const membersData = await membersResponse.json();

    setProjects(projectsData);
    setMembers(membersData);

    setForm((current) => ({
      ...current,
      projectId: projectsData[0]?.id ?? '',
      assigneeId: membersData[0]?.id ?? '',
    }));
  }

  async function moveTask(task: Task) {
    const status = nextStatus[task.status];

    if (!status) return;

    const response = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const updatedTask = await response.json();

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === updatedTask.id ? updatedTask : item
      )
    );
  }

  useEffect(() => {
    async function loadInitialData() {
      await Promise.all([loadTasks(), loadFormData(), loadDashboardData()]);
    }

    loadInitialData();
  }, []);

  async function loadDashboardData() {
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    setDashboardData(data);
  }

  async function loadTasks() {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
    setLoading(false);
  }

  async function reassignTask(taskId: string, assigneeId: string) {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigneeId }),
    });

    await loadTasks();
    await loadDashboardData();
  }

  const tasksByStatus = useMemo(() => {
    return columns.reduce<Record<TaskStatus, Task[]>>(
      (acc, column) => {
        acc[column.status] = sortTasksByPriorityAndDueDate(
          tasks.filter((task) => task.status === column.status)
        );
        return acc;
      },
      { TO_DO: [], IN_PROGRESS: [], VALIDATION: [], REVIEW: [], DONE: [] }
    );
  }, [tasks]);

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      projectId: projects[0]?.id ?? '',
      assigneeId: members[0]?.id ?? '',
    });

    setIsCreating(false);
    await loadTasks();
    await loadDashboardData();
  }

  return (
    <main className="h-screen overflow-hidden bg-[#080808] text-white">
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="shrink-0 border-b border-white/5 bg-[#0C0C0C] px-8 py-6">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-600">
              Quadro de atividades
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Kanban da Equipe
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
              Acompanhe o fluxo de trabalho, responsáveis, prioridades e prazos
              das atividades do time.
            </p>
          </header>

          <div className="flex shrink-0 items-center gap-3 px-8 py-3">
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              <TaskIcon className="h-6 w-6" />
              Criar tarefa
            </button>

            <div className="flex h-9 w-64 items-center rounded-lg border border-white/8 bg-[#141414] px-3 transition hover:border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-3.5 w-3.5 text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                disabled
                placeholder="Buscar tarefa..."
                className="w-full bg-transparent text-xs text-zinc-600 outline-none placeholder:text-zinc-700"
              />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
            {/* KPIs */}
            {dashboardData && (
              <section className="mb-5 grid shrink-0 gap-3 md:grid-cols-2 xl:grid-cols-5">
                <KpiCard
                  title="Tarefas atrasadas"
                  value={dashboardData.kpis.overdueTasks}
                  description="exigem ação imediata"
                  variant="danger"
                />
                <KpiCard
                  title="Prazos em risco"
                  value={dashboardData.kpis.tasksAtRisk}
                  description="vencem em até 48h"
                  variant="warning"
                />
                <KpiCard
                  title="Sobrecarga"
                  value={dashboardData.kpis.overloadedMembers}
                  description="membros com alta carga"
                  variant="info"
                />
                <KpiCard
                  title="Ociosos"
                  value={dashboardData.kpis.idleMembers}
                  description="capacidade disponível"
                  variant="neutral"
                />
                <KpiCard
                  title="Concluídas"
                  value={dashboardData.kpis.completedThisWeek}
                  description="na semana"
                  variant="success"
                />
              </section>
            )}

            {/* Board */}
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                <div className="h-1 w-1 animate-pulse rounded-full bg-zinc-600" />
                Carregando tarefas…
              </div>
            ) : (
              <div className="custom-scrollbar min-h-0 flex-1 overflow-auto pb-2">
                <div className="flex min-h-full w-max gap-3">
                  {columns.map((column) => (
                    <div
                      key={column.status}
                      className="flex min-h-full w-72 shrink-0 flex-col rounded-2xl border border-white/5 bg-[#0F0F0F] p-4"
                    >
                      <div className="mb-4 flex shrink-0 items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="text-xs font-medium uppercase tracking-wider text-white font-semibold">
                          {column.title}
                        </h3>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
                          {tasksByStatus[column.status].length}
                        </span>
                      </div>

                      <div className="min-h-0 flex-1 space-y-2.5 pr-0.5">
                        {tasksByStatus[column.status].map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            members={members}
                            onAdvance={moveTask}
                            onReassign={reassignTask}
                          />
                        ))}

                        {tasksByStatus[column.status].length === 0 && (
                          <div className="rounded-xl border border-dashed border-white/5 p-4 text-center">
                            <p className="text-xs text-zinc-700">
                              Nenhuma tarefa aqui.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Create task modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/8 bg-[#0F0F0F] p-6 shadow-2xl">
            <div className="mb-6 flex items-center gap-3">
              <TaskIcon />
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                  Registro de atividade
                </p>
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Criar Tarefa
                </h2>
              </div>
            </div>

            <form onSubmit={createTask} className="space-y-5">
              <div>
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="Título da tarefa"
                  className="w-full border-b border-white/10 bg-transparent px-1 py-3 text-base text-white outline-none placeholder:text-zinc-700 focus:border-white/30 transition"
                />
              </div>

              <div>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Descreva rapidamente o que precisa ser feito..."
                  className="w-full resize-none border-b border-white/5 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/20 transition"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                    Projeto
                  </label>
                  <Select
                    value={form.projectId}
                    onValueChange={(value) =>
                      setForm({ ...form, projectId: value })
                    }
                  >
                    <SelectTrigger className="h-10 w-full rounded-lg border border-white/8 bg-[#141414] px-3 text-sm text-white outline-none hover:border-white/20 transition">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                    Responsável
                  </label>
                  <Select
                    value={form.assigneeId}
                    onValueChange={(value) =>
                      setForm({ ...form, assigneeId: value })
                    }
                  >
                    <SelectTrigger className="h-10 w-full rounded-lg border border-white/8 bg-[#141414] px-3 text-sm text-white outline-none hover:border-white/20 transition">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                    Prioridade
                  </label>
                  <Select
                    value={form.priority}
                    onValueChange={(value) =>
                      setForm({ ...form, priority: value as Priority })
                    }
                  >
                    <SelectTrigger className="h-10 w-full rounded-lg border border-white/8 bg-[#141414] px-3 text-sm text-white outline-none hover:border-white/20 transition">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Baixa</SelectItem>
                      <SelectItem value="MEDIUM">Média</SelectItem>
                      <SelectItem value="HIGH">Alta</SelectItem>
                      <SelectItem value="URGENT">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                    Prazo
                  </label>
                  <input
                    required
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      setForm({ ...form, dueDate: event.target.value })
                    }
                    className="flex h-10 w-full items-center rounded-lg border border-white/8 bg-[#141414] px-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-white/30 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-40 [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 border-t border-white/5 pt-5">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-lg border border-white/8 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:border-white/20 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-blue-600"
                >
                  Criar tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
