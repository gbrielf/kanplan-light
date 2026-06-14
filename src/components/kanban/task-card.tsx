import { TaskIcon } from '@/components/icons/task-icon';
import { PriorityBars } from '@/components/icons/priority-bars';

type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'VALIDATION' | 'REVIEW' | 'DONE';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

const priorityColor = {
  LOW: 'text-slate-400',
  MEDIUM: 'text-yellow-400',
  HIGH: 'text-orange-400',
  URGENT: 'text-red-500',
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  project: {
    name: string;
  };
  assignee: {
    id: string;
    name: string;
  };
};

type Member = {
  id: string;
  name: string;
};

type TaskCardProps = {
  task: Task;
  members: Member[];
  onAdvance: (task: Task) => void;
  onReassign: (taskId: string, assigneeId: string) => void;
};

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

 export function TaskCard({
    task,
    members,
    onAdvance,
    onReassign,
  }: TaskCardProps) {
  const isOverdue =
    task.status !== 'DONE' && new Date(task.dueDate) < new Date();

 
  return (
    <article className="w-72 rounded-2xl border border-[#2B2B2B] bg-[#0D0D0D] p-4 text-white shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <TaskIcon className="text-red-500" />

          <div>
            <h4 className="text-lg font-semibold leading-tight">
              {task.title}
            </h4>

            <p className="text-sm text-slate-400">
              {priorityLabel[task.priority]}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          {nextStatus[task.status] && (
            <button
              onClick={() => onAdvance(task)}
              title="Avançar tarefa"
              className="rounded-lg border border-white/20 px-2 py-1 text-xs text-slate-300 transition hover:border-white hover:text-white"
            >
              Avançar
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <p>
          <span className="text-slate-300">Data de criação</span>{' '}
          <span className="text-slate-500">
            {new Date(task.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </p>

        <p>
          <span className="text-slate-300">Prazo</span>{' '}
          <span className={isOverdue ? 'text-red-400' : 'text-slate-400'}>
            {new Date(task.dueDate).toLocaleDateString('pt-BR')}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <span className="text-slate-300">Prioridade</span>
          <PriorityBars priority={task.priority} />
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-2 inline-block border-b border-white text-sm font-medium">
          Contexto
        </p>

        <p className="line-clamp-4 text-sm leading-6 text-slate-100">
          {task.description || 'Sem descrição informada para esta tarefa.'}
        </p>
        </div>
        <div className="mt-4 border-t border-white/10 pt-3 text-xs text-slate-400">
              <p>{task.project.name}</p>
              <div className="mt-2">
                <label className="mb-1 block text-xs text-slate-500">
                  Responsável
                </label>

                  <select
                    value={task.assignee.id}
                    onChange={(event) => onReassign(task.id, event.target.value)}
                    className="w-full rounded-lg border border-[#2B2B2B] bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                  >
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
      </div>
      </div>
    </article>
  );
}
