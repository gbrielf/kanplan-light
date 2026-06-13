import { taskService } from "@/services/task.service";

export async function GET() {
  const tasks = await taskService.findAll();

  return Response.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();

  const task = await taskService.create(body);

  return Response.json(task, { status: 201 });
}