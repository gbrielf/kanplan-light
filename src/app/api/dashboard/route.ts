import { dashboardService } from '@/services/dashboard.service';

export async function GET() {
  const dashboardData = await dashboardService.getDashboardData();

  return Response.json(dashboardData);
}
