import { ConnectRepository } from './data/repositories/connects'
import { UserRepository } from './data/repositories/users'
import { ConnectsUseCase } from './domain/useCases/connects'
import { UsersUseCase } from './domain/useCases/users'

const userRepository = UserRepository.getInstance()
const connectRepository = ConnectRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const ConnectsUseCases = new ConnectsUseCase(connectRepository)

export { generateDefaultUser, UserEntity } from './domain/entities/users'
export { EmbeddedUser, ScoreRewards, UserMeta, UserRankings, UserSchoolType } from './domain/types'
