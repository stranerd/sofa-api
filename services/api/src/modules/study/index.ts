import { CourseRepository } from './data/repositories/courses'
import { FolderRepository } from './data/repositories/folders'
import { QuestionRepository } from './data/repositories/questions'
import { QuizRepository } from './data/repositories/quizzes'
import { CoursesUseCase } from './domain/useCases/courses'
import { FoldersUseCase } from './domain/useCases/folders'
import { QuestionsUseCase } from './domain/useCases/questions'
import { QuizzesUseCase } from './domain/useCases/quizzes'

const folderRepository = FolderRepository.getInstance()
const quizRepository = QuizRepository.getInstance()
const questionRepository = QuestionRepository.getInstance()
const courseRepository = CourseRepository.getInstance()

export const FoldersUseCases = new FoldersUseCase(folderRepository)
export const QuizzesUseCases = new QuizzesUseCase(quizRepository)
export const QuestionsUseCases = new QuestionsUseCase(questionRepository)
export const CoursesUseCases = new CoursesUseCase(courseRepository)

export { Coursable, DraftStatus, FolderSaved, QuestionTypes } from './domain/types'
export { canAccessCoursable } from './utils/courses'
