import { ConnectRepository } from './data/repositories/connects'
import { UserRepository } from './data/repositories/users'
import { VerificationRepository } from './data/repositories/verifications'
import { TutorRequestRepository } from './data/repositories/tutorRequests'
import { ConnectsUseCase } from './domain/useCases/connects'
import { UsersUseCase } from './domain/useCases/users'
import { VerificationsUseCase } from './domain/useCases/verifications'
import { TutorRequestsUseCase } from './domain/useCases/tutorRequests'

const userRepository = UserRepository.getInstance()
const connectRepository = ConnectRepository.getInstance()
const verificationRepository = VerificationRepository.getInstance()
const tutorRequestRepository = TutorRequestRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const ConnectsUseCases = new ConnectsUseCase(connectRepository)
export const VerificationsUseCases = new VerificationsUseCase(verificationRepository)
export const TutorRequestsUseCases = new TutorRequestsUseCase(tutorRequestRepository)

export { generateDefaultUser, UserEntity } from './domain/entities/users'
export { EmbeddedUser, ScoreRewards, UserMeta, UserRankings, UserSchoolType, UserType, UserSocials } from './domain/types'
