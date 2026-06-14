import { projectRepository } from '@/repositories/project.repository';

export const projectService = {
  findAll() {
    return projectRepository.findAll();
  },
};
