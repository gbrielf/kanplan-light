'use client';
import { TaskCard } from '@/components/kanban/task-card';
import { KpiCard } from '@/components/kanban/kpi-card';
import { Sidebar } from '@/components/kanban/side-bar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
      headers: {
        'Content-Type': 'application/json',
      },
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
    loadTasks();
    loadFormData();
    loadDashboardData();
  }, []);

  const tasksByStatus = useMemo(() => {
    return columns.reduce<Record<TaskStatus, Task[]>>(
      (acc, column) => {
        acc[column.status] = sortTasksByPriorityAndDueDate(
          tasks.filter((task) => task.status === column.status)
        );

        return acc;
      },
      {
        TO_DO: [],
        IN_PROGRESS: [],
        VALIDATION: [],
        REVIEW: [],
        DONE: [],
      }
    );
  }, [tasks]);

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  <main className="h-screen overflow-hidden bg-[#0B0B0B] text-slate-100">
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden p-8">
        <header className="mb-6 shrink-0 overflow-hidden rounded-2xl border border-[#2B2B2B] bg-[#181919]">
          <div className="border-b border-[#2B2B2B] bg-[#0F1010] px-6 py-5">
            <p className="text-sm text-slate-400">Quadro de atividades</p>

            <h1 className="mt-1 text-3xl font-semibold text-white">
              Kanban da Equipe
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Acompanhe o fluxo de trabalho, responsáveis, prioridades e prazos das
              atividades do time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 px-6 py-4">
            <button
              onClick={() => setIsCreating(true)}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              + Criar tarefa
            </button>

            <div className="flex h-10 w-72 items-center rounded-xl border border-[#2C2C2C] bg-[#111111] px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4 text-slate-500"
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
                className="w-full bg-transparent text-sm text-slate-500 outline-none"
              />
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[#2B2B2B] bg-[#181919] p-6">
          {dashboardData && (
            <section className="mb-6 grid shrink-0 gap-4 md:grid-cols-2 xl:grid-cols-5">
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

          {loading ? (
            <p className="text-slate-400">Carregando tarefas...</p>
          ) : (
            <div className="custom-scrollbar min-h-0 flex-1 overflow-auto pb-4">
              <div className="flex min-h-full w-max gap-4">
                {columns.map((column) => (
                  <div
                    key={column.status}
                    className="flex min-h-full w-80 shrink-0 flex-col rounded-2xl border border-white/70 bg-[#0B0B0B] p-4"
                  >
                    <div className="mb-4 flex shrink-0 items-center justify-between border-b border-white/70 pb-3">
                      <h3 className="font-semibold text-sm text-[#696969]">{column.title}</h3>
                    </div>

                    <div className="min-h-0 flex-1 space-y-3  pr-1">
                      {tasksByStatus[column.status].map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onAdvance={moveTask}
                        />
                      ))}

                      {tasksByStatus[column.status].length === 0 && (
                        <p className="rounded-xl border border-dashed border-slate-800 p-4 text-center text-sm text-slate-500">
                          Nenhuma tarefa aqui.
                        </p>
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

    {isCreating && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#2B2B2B] bg-[#181919] p-6 shadow-2xl">
          <div className="mb-6 flex items-center gap-4">
            <TaskIcon/>
            <div className="mb-6">
              <p className="text-sm text-slate-400">Registro de atividade</p>
              <h2 className="text-3xl font-medium">Criar Tarefa</h2>
            </div>
          </div>

          <form onSubmit={createTask} className="space-y-4">
            <div>
              <input
                required
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Título da tarefa"
                className="mt-1 w-full border-b border-blue-500 bg-transparent px-1 py-3 text-base outline-none placeholder:text-[#696969] "
              />
            </div>

            <div>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Descreva rapidamente o que precisa ser feito..."
                className="mt-1  w-full text-base resize-none border-b border-[#2C2C2C] bg-transparent px-1 py-3 outline-none placeholder:text-[#696969] focus:border-white"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="w-full">
                <label className="text-sm text-[#696969]">Projeto</label>
                <Select
                  value={form.projectId}
                  onValueChange={(value) =>
                    setForm({ ...form, projectId: value })
                  }
                >
                  <SelectTrigger className="mt-1 h-11 w-full rounded-lg border border-[#2C2C2C] bg-transparent px-3 text-sm text-white outline-none focus:border-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>

                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id}
                      >
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="w-full">
                  <label className="text-sm text-[#696969]">Responsável</label>

                  <Select
                    value={form.assigneeId}
                    onValueChange={(value) =>
                      setForm({ ...form, assigneeId: value })
                    }
                  >
                    <SelectTrigger className="mt-1 h-11 w-full rounded-lg border border-[#2C2C2C] bg-transparent px-3 text-sm text-white outline-none focus:border-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>

                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem
                          key={member.id}
                          value={member.id}
                        >
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="w-full">
                  <label className="text-sm text-[#696969]">Prioridade</label>

                  <Select
                    value={form.priority}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        priority: value as Priority,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1 h-11 w-full rounded-lg border border-[#2C2C2C] bg-transparent px-3 text-sm text-white outline-none focus:border-white">
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
              </div>

              <div>
                <label className="text-sm text-[#696969]">Prazo</label>
                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm({ ...form, dueDate: event.target.value })
                  }
                   className="mt-1 flex h-11 w-full items-center rounded-lg border border-[#2C2C2C] bg-transparent px-3 text-sm leading-none text-white outline-none transition focus:border-white [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:invert"
   
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
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