import { ClassRepository } from './data/repositories/classes'
import { MemberRepository } from './data/repositories/members'
import { ClassesUseCase } from './domain/useCases/classes'
import { MembersUseCase } from './domain/useCases/members'

const classRepository = ClassRepository.getInstance()
const memberRepository = MemberRepository.getInstance()

export const ClassesUseCases = new ClassesUseCase(classRepository)
export const MembersUseCases = new MembersUseCase(memberRepository)

export { MemberTypes } from './domain/types'

export { canAccessOrg } from './utils'
