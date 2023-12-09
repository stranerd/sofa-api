import { AnnouncementRepository } from './data/repositories/announcements'
import { ClassRepository } from './data/repositories/classes'
import { MemberRepository } from './data/repositories/members'
import { AnnouncementsUseCase } from './domain/useCases/announcements'
import { ClassesUseCase } from './domain/useCases/classes'
import { MembersUseCase } from './domain/useCases/members'

const announcementRepository = AnnouncementRepository.getInstance()
const classRepository = ClassRepository.getInstance()
const memberRepository = MemberRepository.getInstance()

export const AnnouncementsUseCases = new AnnouncementsUseCase(announcementRepository)
export const ClassesUseCases = new ClassesUseCase(classRepository)
export const MembersUseCases = new MembersUseCase(memberRepository)

export { MemberTypes } from './domain/types'

export { canAccessOrgClasses, canAccessOrgMembers, canModOrgs } from './utils'
