import { taskRepository } from "@/repositories/task.repository";

export const taskService = {
  findAll() {
    return taskRepository.findAll();
  },

  findByProject(projectId: string) {
    return taskRepository.findByProject(projectId);
  },
};