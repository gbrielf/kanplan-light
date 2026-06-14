'use client';
import { TaskCard } from '@/components/kanban/task-card';
import { KpiCard } from '@/components/kanban/kpi-card';
import { Sidebar } from '@/components/kanban/side-bar';

import { useEffect, useMemo, useState } from 'react';

type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'VALIDATION' | 'REVIEW' | 'DONE';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
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
    <main className="min-h-screen bg-[#0B0B0B] text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <section className="flex-1 p-8">
          <header className="mb-8">
            <p className="text-sm text-slate-400">Quadro de atividades</p>
            <h2 className="text-3xl font-bold">Kanban da Equipe</h2>
            <p className="mt-2 max-w-2xl text-slate-400">
              Acompanhe o fluxo de trabalho, responsáveis, prioridades e prazos
              das atividades do time.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              + Nova tarefa
            </button>
          </header>

          {dashboardData && (
            <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
            <div className="w-full overflow-x-auto pb-4">
              <div className="grid w-max grid-cols-5 gap-4">
                {columns.map((column) => (
                  <div
                    key={column.status}
                    className="flex min-h-[650px] w-80 flex-col rounded-2xl border border-white bg-black-10 p-4 backdrop-blur-sm"
                  >
                    <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="font-semibold">{column.title}</h3>
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                        {tasksByStatus[column.status].length}
                      </span>
                    </div>
                    <div className="space-y-3">
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
        </section>
      </div>
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-6">
              <p className="text-sm text-slate-400">Registro de atividade</p>
              <h2 className="text-2xl font-bold">Criar Tarefa</h2>
            </div>

            <form onSubmit={createTask} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Título</label>
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="Ex.: Revisar proposta do cliente"
                  className="mt-1 w-full border-b border-slate-700 bg-transparent px-1 py-3 text-lg outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Descreva rapidamente o que precisa ser feito..."
                  className="mt-1 min-h-24 w-full resize-none border-b border-slate-700 bg-transparent px-1 py-3 outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-slate-400">Projeto</label>
                  <select
                    required
                    value={form.projectId}
                    onChange={(event) =>
                      setForm({ ...form, projectId: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Responsável</label>
                  <select
                    required
                    value={form.assigneeId}
                    onChange={(event) =>
                      setForm({ ...form, assigneeId: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Prioridade</label>
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        priority: event.target.value as Priority,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Prazo</label>
                  <input
                    required
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      setForm({ ...form, dueDate: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm outline-none focus:border-blue-500"
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
