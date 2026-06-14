import { prisma } from '@/lib/prisma';

export const projectRepository = {
  findAll() {
    return prisma.project.findMany({
      include: {
        tasks: true,
        members: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  },
};
