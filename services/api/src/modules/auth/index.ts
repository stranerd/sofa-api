import { AuthRepository } from './data/repositories/auth'
import { UserRepository } from './data/repositories/users'
import { AuthUseCase } from './domain/useCases/auth'
import { AuthUsersUseCase } from './domain/useCases/users'

const authRepository = AuthRepository.getInstance()
const userRepository = UserRepository.getInstance()

export const AuthUseCases = new AuthUseCase(authRepository)
export const AuthUsersUseCases = new AuthUsersUseCase(userRepository)

export type { Phone } from './domain/types'
export { deleteUnverifiedUsers, generateAuthOutput, getNewTokens, signOutUser } from './utils/auth'
