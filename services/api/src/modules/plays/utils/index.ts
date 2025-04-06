import { BadRequestError, Conditions } from 'equipped'

import { InteractionEntities, ViewsUseCases } from '@modules/interactions'
import type { QuizEntity } from '@modules/study'
import { QuestionsUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'

import { PlaysUseCases } from '..'
import type { PlayToModel } from '../data/models/plays'
import { PlayTiming } from '../domain/types'

export const createPlay = async (
	userId: string,
	quiz: QuizEntity,
	otherData: { title: string },
	data: PlayToModel['data'],
	view = false,
) => {
	const user = await UsersUseCases.find(userId)
	if (!user || user.isDeleted()) throw new BadRequestError('user not found')
	const { results: questions } = await QuestionsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: quiz.questions }],
		all: true,
	})
	const sources = quiz.questions.map((id) => questions.find((q) => q.id === id)!).filter(Boolean)
	const totalTimeInSec = quiz.timeLimit ?? questions.reduce((acc, q) => acc + q.timeLimit, 0)
	const play = await PlaysUseCases.add({
		title: otherData.title ?? quiz.title,
		quizId: quiz.id,
		user: user.getEmbedded(),
		totalTimeInSec,
		timing: quiz.timeLimit ? PlayTiming.general : PlayTiming.perQuestion,
		data,
		sources,
	})
	if (view)
		await ViewsUseCases.create({
			user: user.getEmbedded(),
			entity: { id: quiz.id, type: InteractionEntities.quizzes, userId: quiz.user.id },
		})
	return play
}
