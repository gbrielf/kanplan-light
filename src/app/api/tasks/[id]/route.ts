import { TaskStatus } from "@prisma/client";
import { taskService } from "@/services/task.service";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const task = await taskService.updateStatus(id, body.status as TaskStatus);

  return Response.json(task);
}