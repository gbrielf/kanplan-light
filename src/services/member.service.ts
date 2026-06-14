import { memberRepository } from "@/repositories/member.repository";

export const memberService = {
  findAll() {
    return memberRepository.findAll();
  },
};