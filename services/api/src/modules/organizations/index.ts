import { AnnouncementRepository } from './data/repositories/announcements'
import { ClassRepository } from './data/repositories/classes'
import { MemberRepository } from './data/repositories/members'
import { ScheduleRepository } from './data/repositories/schedules'
import { AnnouncementsUseCase } from './domain/useCases/announcements'
import { ClassesUseCase } from './domain/useCases/classes'
import { MembersUseCase } from './domain/useCases/members'
import { SchedulesUseCase } from './domain/useCases/schedules'

const announcementRepository = AnnouncementRepository.getInstance()
const classRepository = ClassRepository.getInstance()
const memberRepository = MemberRepository.getInstance()
const scheduleRepository = ScheduleRepository.getInstance()

export const AnnouncementsUseCases = new AnnouncementsUseCase(announcementRepository)
export const ClassesUseCases = new ClassesUseCase(classRepository)
export const MembersUseCases = new MembersUseCase(memberRepository)
export const SchedulesUseCases = new SchedulesUseCase(scheduleRepository)

export { MemberTypes } from './domain/types'

export { canAccessOrgClasses, canAccessOrgMembers, canModOrgs } from './utils'
