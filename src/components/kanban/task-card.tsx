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

type TaskCardProps = {
  task: Task;
  onAdvance: (task: Task) => void;
};

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

const priorityStyles: Record<Priority, string> = {
  LOW: "bg-slate-800 text-slate-300",
  MEDIUM: "bg-yellow-950 text-yellow-300",
  HIGH: "bg-orange-950 text-orange-300",
  URGENT: "bg-red-950 text-red-300",
};

export function TaskCard({ task, onAdvance }: TaskCardProps) {
  const isOverdue =
    task.status !== "DONE" && new Date(task.dueDate) < new Date();

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-sm transition hover:border-slate-700">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}
        >
          {priorityLabel[task.priority]}
        </span>

        <span className="text-xs text-slate-500">
          📅 {new Date(task.dueDate).toLocaleDateString("pt-BR")}
        </span>
      </div>

      <h4 className="font-semibold leading-snug">{task.title}</h4>

      {isOverdue && (
        <p className="mt-2 text-xs font-medium text-red-400">
          ⚠ Prazo vencido
        </p>
      )}

      {task.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-400">
          {task.description}
        </p>
      )}

      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400">
        <p>
          <span className="text-slate-500">Projeto:</span> {task.project.name}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-200">
            {task.assignee.name.charAt(0)}
          </div>

          <div>
            <p className="text-slate-500">Responsável</p>
            <p className="text-sm text-slate-200">{task.assignee.name}</p>
          </div>
        </div>
      </div>

      {nextStatus[task.status] && (
        <button
          onClick={() => onAdvance(task)}
          className="mt-4 w-full rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-white"
        >
          Avançar
        </button>
      )}
    </article>
  );
}