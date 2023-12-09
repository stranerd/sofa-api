import { MemberRepository } from './data/repositories/members'
import { MembersUseCase } from './domain/useCases/members'

const memberRepository = MemberRepository.getInstance()

export const MembersUseCases = new MembersUseCase(memberRepository)

export { MemberTypes } from './domain/types'
