import { Conditions, QueryParams } from 'equipped'
import { QuizzesUseCases, CoursesUseCases, FilesUseCases } from '..'
import { QuizEntity } from '../domain/entities/quizzes'
import { FolderSaved } from '../domain/types'

export const verifyToBeSaved = async (type: FolderSaved, propIds: string[]) => {
	const query: QueryParams = { where: [{ field: 'id', condition: Conditions.in, value: propIds }], all: true }
	const { results } =
		type === FolderSaved.quizzes
			? await QuizzesUseCases.get(query)
			: type === FolderSaved.courses
				? await CoursesUseCases.get(query)
				: type === FolderSaved.files
					? await FilesUseCases.get(query)
					: { results: [] }
	if (results.length !== propIds.length) return false
	if (type === FolderSaved.quizzes) {
		const isForTutors = results.some((quiz) => quiz instanceof QuizEntity && quiz.isForTutors)
		if (isForTutors) return false
	}
	return true
}
