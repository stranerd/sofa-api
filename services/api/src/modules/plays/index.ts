import { AnswerRepository } from './data/repositories/answers'
import { PlayRepository } from './data/repositories/plays'
import { AnswersUseCase } from './domain/useCases/answers'
import { PlaysUseCase } from './domain/useCases/plays'

const answerRepository = AnswerRepository.getInstance()
const playRepository = PlayRepository.getInstance()

export const AnswersUseCases = new AnswersUseCase(answerRepository)
export const PlaysUseCases = new PlaysUseCase(playRepository)

export { PlayEntity } from './domain/entities/plays'
export { PlayStatus, PlayTypes } from './domain/types'
export { createPlay } from './utils'
