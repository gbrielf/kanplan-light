import { TaskStatus } from '@prisma/client';
import { taskService } from '@/services/task.service';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateTaskBody = {
  status?: TaskStatus;
  assigneeId?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body: UpdateTaskBody = await request.json();

  const task = await taskService.update(id, {
    status: body.status,
    assigneeId: body.assigneeId,
  });

  return Response.json(task);
}
