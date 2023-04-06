import { AnswerRepository } from './data/repositories/answers'
import { GameRepository } from './data/repositories/games'
import { AnswersUseCase } from './domain/useCases/answers'
import { GamesUseCase } from './domain/useCases/games'

const gameRepository = GameRepository.getInstance()
const answerRepository = AnswerRepository.getInstance()

export const GamesUseCases = new GamesUseCase(gameRepository)
export const AnswersUseCases = new AnswersUseCase(answerRepository)