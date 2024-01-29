import { QuestionsUseCases, QuizEntity } from '@modules/study'
import { Conditions } from 'equipped'
import { TestsUseCases } from '..'

export const createTest = async (userId: string, quiz: QuizEntity) => {
	const { results: questions } = await QuestionsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: quiz.questions }],
		all: true,
	})
	const questionIds = quiz.questions.map((id) => questions.find((q) => q.id === id)?.id).filter((q) => !!q) as string[]
	const totalTimeInSec = questions.reduce((acc, q) => acc + q.timeLimit, 0)
	return await TestsUseCases.add({
		quizId: quiz.id,
		questions: questionIds,
		userId,
		totalTimeInSec,
	})
}
