import { Priority, TaskStatus } from "@prisma/client";
import { taskRepository } from "@/repositories/task.repository";
import { memberRepository } from "@/repositories/member.repository";
import { projectRepository } from "@/repositories/project.repository";

const PRIORITY_WEIGHT: Record<Priority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 5,
};

const ACTIVE_STATUSES: TaskStatus[] = [
  TaskStatus.TO_DO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.VALIDATION,
  TaskStatus.REVIEW,
];

// tarefas atrasadas
function isTaskOverdue(task: { dueDate: Date; status: TaskStatus }) {
  const now = new Date();

  return task.dueDate < now && task.status !== TaskStatus.DONE;
}

// tarefas com risco de atraso, estão a 48h da meta
function isTaskAtRisk(task: { dueDate: Date; status: TaskStatus }) {
  const now = new Date();
  const limit = new Date(now);
  limit.setHours(limit.getHours() + 48);

  return (
    task.dueDate >= now &&
    task.dueDate <= limit &&
    task.status !== TaskStatus.DONE
  );
}

// atribui um peso para cada tarefa, com a intenção de saber quais membros estão sobrecarregados ou ociosos
function getTaskWeight(task: { priority: Priority }) {
  return PRIORITY_WEIGHT[task.priority];
}

// funcao para apresentar o numero de tarefas com risco de atraso, membros sobrecarregados, membros ociosos, tarefas concluídas na última semana e tempo médio de conclusão das tarefas
export const dashboardService = {
  async getDashboardData() {
    const [tasks, members, projects] = await Promise.all([
      taskRepository.findAll(),
      memberRepository.findAll(),
      projectRepository.findAll(),
    ]);

    const overdueTasks = tasks.filter(isTaskOverdue);
    const tasksAtRisk = tasks.filter(isTaskAtRisk);

    const completedThisWeek = tasks.filter((task) => {
      if (!task.completedAt) return false;

      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return task.completedAt >= sevenDaysAgo && task.completedAt <= now;
    });

    const membersCapacity = members.map((member) => {
      const activeTasks = member.tasks.filter((task) =>
        ACTIVE_STATUSES.includes(task.status)
      );

      const capacityScore = activeTasks.reduce(
        (total, task) => total + getTaskWeight(task),
        0
      );

      const overdueCount = activeTasks.filter(isTaskOverdue).length;

      return {
        id: member.id,
        name: member.name,
        role: member.role,
        activeTasks: activeTasks.length,
        overdueTasks: overdueCount,
        capacityScore,
        status:
          capacityScore >= 9
            ? "OVERLOADED"
            : capacityScore === 0
              ? "IDLE"
              : capacityScore <= 4
                ? "HEALTHY"
                : "ATTENTION",
      };
    });

    const overloadedMembers = membersCapacity.filter(
      (member) => member.status === "OVERLOADED"
    );

    const idleMembers = membersCapacity.filter(
      (member) => member.status === "IDLE"
    );

    const completedTasksWithDuration = tasks.filter(
      (task) => task.completedAt !== null
    );

    const averageCompletionTimeInDays =
      completedTasksWithDuration.length === 0
        ? 0
        : completedTasksWithDuration.reduce((total, task) => {
            const createdAt = task.createdAt.getTime();
            const completedAt = task.completedAt!.getTime();

            const durationInDays =
              (completedAt - createdAt) / (1000 * 60 * 60 * 24);

            return total + durationInDays;
          }, 0) / completedTasksWithDuration.length;

    return {
      kpis: {
        totalProjects: projects.length,
        totalTasks: tasks.length,
        overdueTasks: overdueTasks.length,
        tasksAtRisk: tasksAtRisk.length,
        overloadedMembers: overloadedMembers.length,
        idleMembers: idleMembers.length,
        completedThisWeek: completedThisWeek.length,
        averageCompletionTimeInDays: Number(
          averageCompletionTimeInDays.toFixed(1)
        ),
      },
      health: {
        overdueTasks,
        tasksAtRisk,
        overloadedMembers,
        idleMembers,
      },
      membersCapacity,
      projects,
      tasks,
    };
  },
};