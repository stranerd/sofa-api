import { ConnectRepository } from './data/repositories/connects'
import { UserRepository } from './data/repositories/users'
import { VerificationRepository } from './data/repositories/verifications'
import { ConnectsUseCase } from './domain/useCases/connects'
import { UsersUseCase } from './domain/useCases/users'
import { VerificationsUseCase } from './domain/useCases/verifications'

const userRepository = UserRepository.getInstance()
const connectRepository = ConnectRepository.getInstance()
const verificationRepository = VerificationRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const ConnectsUseCases = new ConnectsUseCase(connectRepository)
export const VerificationsUseCases = new VerificationsUseCase(verificationRepository)

export { generateDefaultUser, UserEntity } from './domain/entities/users'
export { EmbeddedUser, ScoreRewards, UserMeta, UserRankings, UserSchoolType, UserType, VerificationSocials } from './domain/types'
