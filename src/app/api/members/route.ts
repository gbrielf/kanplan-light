import { memberService } from '@/services/member.service';

export async function GET() {
  const members = await memberService.findAll();

  return Response.json(members);
}
