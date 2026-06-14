import { Priority, TaskStatus } from '@prisma/client';
import { taskRepository } from '@/repositories/task.repository';

type CreateTaskInput = {
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string;
  projectId: string;
  assigneeId: string;
};

export const taskService = {
  findAll() {
    return taskRepository.findAll();
  },

  findByProject(projectId: string) {
    return taskRepository.findByProject(projectId);
  },

  create(data: CreateTaskInput) {
    return taskRepository.create({
      ...data,
      status: TaskStatus.TO_DO,
      dueDate: new Date(data.dueDate),
    });
  },

  updateStatus(id: string, status: TaskStatus) {
    return taskRepository.updateStatus(id, status);
  },
};
