import { AnswerRepository } from './data/repositories/answers'
import { GameRepository } from './data/repositories/games'
import { TestRepository } from './data/repositories/tests'
import { AnswersUseCase } from './domain/useCases/answers'
import { GamesUseCase } from './domain/useCases/games'
import { TestsUseCase } from './domain/useCases/tests'

const gameRepository = GameRepository.getInstance()
const testRepository = TestRepository.getInstance()
const answerRepository = AnswerRepository.getInstance()

export const GamesUseCases = new GamesUseCase(gameRepository)
export const TestsUseCases = new TestsUseCase(testRepository)
export const AnswersUseCases = new AnswersUseCase(answerRepository)

export { PlayTypes } from './domain/types'
export { endPlay } from './utils/plays'
export { createTest } from './utils/tests'