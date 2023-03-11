import { FolderRepository } from './data/repositories/folders'
import { QuestionRepository } from './data/repositories/questions'
import { QuizRepository } from './data/repositories/quizzes'
import { FoldersUseCase } from './domain/useCases/folders'
import { QuestionsUseCase } from './domain/useCases/questions'
import { QuizzesUseCase } from './domain/useCases/quizzes'

const folderRepository = FolderRepository.getInstance()
const quizRepository = QuizRepository.getInstance()
const questionRepository = QuestionRepository.getInstance()

export const FoldersUseCases = new FoldersUseCase(folderRepository)
export const QuizzesUseCases = new QuizzesUseCase(quizRepository)
export const QuestionsUseCases = new QuestionsUseCase(questionRepository)

export { DraftStatus, FolderSaved } from './domain/types'
