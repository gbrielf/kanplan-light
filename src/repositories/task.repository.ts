import { prisma } from "@/lib/prisma";

export const taskRepository = {
  findAll() {
    return prisma.task.findMany({
      include: {
        project: true,
        assignee: true,
      },
      orderBy: {
        dueDate: "asc",
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
        dueDate: "asc",
      },
    });
  },
};