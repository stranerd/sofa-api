import { CourseRepository } from './data/repositories/courses'
import { FolderRepository } from './data/repositories/folders'
import { GameRepository } from './data/repositories/games'
import { QuestionRepository } from './data/repositories/questions'
import { QuizRepository } from './data/repositories/quizzes'
import { CoursesUseCase } from './domain/useCases/courses'
import { FoldersUseCase } from './domain/useCases/folders'
import { GamesUseCase } from './domain/useCases/games'
import { QuestionsUseCase } from './domain/useCases/questions'
import { QuizzesUseCase } from './domain/useCases/quizzes'

const folderRepository = FolderRepository.getInstance()
const quizRepository = QuizRepository.getInstance()
const questionRepository = QuestionRepository.getInstance()
const courseRepository = CourseRepository.getInstance()
const gameRepository = GameRepository.getInstance()

export const FoldersUseCases = new FoldersUseCase(folderRepository)
export const QuizzesUseCases = new QuizzesUseCase(quizRepository)
export const QuestionsUseCases = new QuestionsUseCase(questionRepository)
export const CoursesUseCases = new CoursesUseCase(courseRepository)
export const GamesUseCases = new GamesUseCase(gameRepository)

export { Coursable, DraftStatus, FolderSaved, QuestionTypes } from './domain/types'
export { canAccessCoursable } from './utils/courses'
