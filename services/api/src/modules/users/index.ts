import { ConnectRepository } from './data/repositories/connects'
import { TutorRequestRepository } from './data/repositories/tutorRequests'
import { UserRepository } from './data/repositories/users'
import { VerificationRepository } from './data/repositories/verifications'
import { ConnectsUseCase } from './domain/useCases/connects'
import { TutorRequestsUseCase } from './domain/useCases/tutorRequests'
import { UsersUseCase } from './domain/useCases/users'
import { VerificationsUseCase } from './domain/useCases/verifications'

const userRepository = UserRepository.getInstance()
const connectRepository = ConnectRepository.getInstance()
const verificationRepository = VerificationRepository.getInstance()
const tutorRequestRepository = TutorRequestRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const ConnectsUseCases = new ConnectsUseCase(connectRepository)
export const VerificationsUseCases = new VerificationsUseCase(verificationRepository)
export const TutorRequestsUseCases = new TutorRequestsUseCase(tutorRequestRepository)

export { UserEntity, generateDefaultUser } from './domain/entities/users'
export type { EmbeddedUser, UserSchool } from './domain/types'
export { ScoreRewards, UserMeta, UserRankings, UserSchoolType, UserSocials, UserType } from './domain/types'
