import { Priority, TaskStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type CreateTaskData = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority: Priority;
  dueDate: Date;
  projectId: string;
  assigneeId: string;
};

export const taskRepository = {
  findAll() {
    return prisma.task.findMany({
      include: {
        project: true,
        assignee: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  },

  findByProject(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
      include: {
        project: true,
        assignee: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  },

  create(data: CreateTaskData) {
    return prisma.task.create({
      data,
      include: {
        project: true,
        assignee: true,
      },
    });
  },

  updateStatus(id: string, status: TaskStatus) {
    return prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt: status === TaskStatus.DONE ? new Date() : null,
      },
      include: {
        project: true,
        assignee: true,
      },
    });
  },
};
