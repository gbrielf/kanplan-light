"use client";

import { useEffect, useMemo, useState } from "react";

type TaskStatus = "TO_DO" | "IN_PROGRESS" | "VALIDATION" | "REVIEW" | "DONE";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

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

const columns: { status: TaskStatus; title: string }[] = [
  { status: "TO_DO", title: "A iniciar" },
  { status: "IN_PROGRESS", title: "Em andamento" },
  { status: "VALIDATION", title: "Validação" },
  { status: "REVIEW", title: "Revisão" },
  { status: "DONE", title: "Concluído" },
];

const nextStatus: Record<TaskStatus, TaskStatus | null> = {
  TO_DO: "IN_PROGRESS",
  IN_PROGRESS: "VALIDATION",
  VALIDATION: "REVIEW",
  REVIEW: "DONE",
  DONE: null,
};

const priorityLabel: Record<Priority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    const response = await fetch("/api/tasks");
    const data = await response.json();

    setTasks(data);
    setLoading(false);
  }

  async function moveTask(task: Task) {
    const status = nextStatus[task.status];

    if (!status) return;

    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
  }, []);

  const tasksByStatus = useMemo(() => {
    return columns.reduce<Record<TaskStatus, Task[]>>(
      (acc, column) => {
        acc[column.status] = tasks.filter(
          (task) => task.status === column.status
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
          <h1 className="text-xl font-bold">Kanplan Light</h1>
          <p className="mt-1 text-sm text-slate-400">Gestão para PMEs</p>

          <nav className="mt-8 space-y-2 text-sm">
            <a className="block rounded-lg bg-slate-800 px-3 py-2 text-white">
              Kanban
            </a>
            <a className="block rounded-lg px-3 py-2 text-slate-400">
              Dashboard
            </a>

            <div className="my-4 border-t border-slate-800" />

            {["Projetos", "Equipe", "Relatórios", "Configurações"].map(
              (item) => (
                <div
                  key={item}
                  className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-slate-600"
                >
                  <span>{item}</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">
                    Light
                  </span>
                </div>
              )
            )}
          </nav>
        </aside>

        <section className="flex-1 p-8">
          <header className="mb-8">
            <p className="text-sm text-slate-400">Quadro de atividades</p>
            <h2 className="text-3xl font-bold">Kanban da Equipe</h2>
            <p className="mt-2 max-w-2xl text-slate-400">
              Acompanhe o fluxo de trabalho, responsáveis, prioridades e prazos
              das atividades do time.
            </p>
          </header>

          {loading ? (
            <p className="text-slate-400">Carregando tarefas...</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
              {columns.map((column) => (
                <div
                  key={column.status}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">{column.title}</h3>
                    <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                      {tasksByStatus[column.status].length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {tasksByStatus[column.status].map((task) => (
                      <article
                        key={task.id}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                            {priorityLabel[task.priority]}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                          </span>
                        </div>

                        <h4 className="font-semibold leading-snug">
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                            {task.description}
                          </p>
                        )}

                        <div className="mt-4 space-y-1 text-xs text-slate-400">
                          <p>
                            <span className="text-slate-500">Projeto:</span>{" "}
                            {task.project.name}
                          </p>
                          <p>
                            <span className="text-slate-500">Responsável:</span>{" "}
                            {task.assignee.name}
                          </p>
                        </div>

                        {nextStatus[task.status] && (
                          <button
                            onClick={() => moveTask(task)}
                            className="mt-4 w-full rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-white"
                          >
                            Avançar
                          </button>
                        )}
                      </article>
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
          )}
        </section>
      </div>
    </main>
  );
}