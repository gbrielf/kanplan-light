import { prisma } from '@/lib/prisma';

export const memberRepository = {
  findAll() {
    return prisma.member.findMany({
      include: {
        tasks: true,
        projects: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  },
};
