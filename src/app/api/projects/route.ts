import { projectService } from '@/services/project.service';

export async function GET() {
  const projects = await projectService.findAll();

  return Response.json(projects);
}
