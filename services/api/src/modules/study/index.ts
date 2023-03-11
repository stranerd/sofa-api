import { FolderRepository } from './data/repositories/folders'
import { QuizRepository } from './data/repositories/quizzes'
import { FoldersUseCase } from './domain/useCases/folders'
import { QuizzesUseCase } from './domain/useCases/quizzes'

const quizRepository = QuizRepository.getInstance()
const folderRepository = FolderRepository.getInstance()

export const QuizzesUseCases = new QuizzesUseCase(quizRepository)
export const FoldersUseCases = new FoldersUseCase(folderRepository)

export { DraftStatus, FolderSaved } from './domain/types'
