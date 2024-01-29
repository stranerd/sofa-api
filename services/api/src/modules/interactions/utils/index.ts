import { ConversationsUseCases } from '@modules/conversations'
import { CoursesUseCases, QuestionsUseCases, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { CommentsUseCases } from '../'
import { InteractionEntities } from '../domain/types'
import { BadRequestError } from 'equipped'

type Interactions = 'comments' | 'likes' | 'dislikes' | 'reports' | 'reviews' | 'views'

const finders = {
	[InteractionEntities.comments]: async (id: string) => {
		const comment = await CommentsUseCases.find(id)
		if (!comment || comment.entity.type === InteractionEntities.comments) return undefined
		return comment.user.id
	},
	[InteractionEntities.courses]: async (id: string) => {
		const course = await CoursesUseCases.find(id)
		return course?.user.id
	},
	[InteractionEntities.quizzes]: async (id: string) => {
		const quiz = await QuizzesUseCases.find(id)
		return quiz?.user.id
	},
	[InteractionEntities.conversations]: async (id: string) => {
		const conversation = await ConversationsUseCases.find(id)
		return conversation?.id
	},
	[InteractionEntities.users]: async (id: string) => {
		const user = await UsersUseCases.find(id)
		return user?.id
	},
	[InteractionEntities.quizQuestions]: async (id: string) => {
		const question = await QuestionsUseCases.find(id)
		return question?.id
	},
}

export const verifyInteractionAndGetUserId = async (type: InteractionEntities, id: string, interaction: Interactions) => {
	const types = (() => {
		if (interaction === 'comments') return [InteractionEntities.comments]
		if (interaction === 'views') return [InteractionEntities.courses, InteractionEntities.quizzes]
		if (interaction === 'reports')
			return [InteractionEntities.courses, InteractionEntities.quizzes, InteractionEntities.users, InteractionEntities.quizQuestions]
		if (interaction === 'reviews')
			return [
				InteractionEntities.courses,
				InteractionEntities.quizzes /* InteractionEntities.conversations // hidden so users cannot create this externally */,
			]
		return []
	})().reduce(
		(acc, cur) => {
			acc[cur] = finders[cur]
			return acc
		},
		{} as Record<InteractionEntities, (id: string) => Promise<string | undefined>>,
	)

	const finder = types[type]
	if (!finder) throw new BadRequestError(`${interaction} not supported for ${type}`)
	const res = await finder(id)
	if (!res) throw new BadRequestError(`no ${type} with id ${id} found`)
	return res
}
