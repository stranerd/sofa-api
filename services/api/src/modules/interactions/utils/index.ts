import { ConversationsUseCases } from '@modules/conversations'
import { CoursesUseCases, QuestionsUseCases, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError } from 'equipped'
import { CommentsUseCases } from '../'
import { InteractionEntities, InteractionEntity } from '../domain/types'

type Interactions = 'comments' | 'likes' | 'dislikes' | 'reports' | 'reviews' | 'views'

const InteractionsMappings: Record<Interactions, InteractionEntities[]> = {
	comments: [InteractionEntities.comments],
	reviews: [
		InteractionEntities.courses,
		InteractionEntities.quizzes,
		/* InteractionEntities.conversations // hidden so users cannot create this externally */
	],
	likes: [],
	dislikes: [],
	reports: [InteractionEntities.courses, InteractionEntities.quizzes, InteractionEntities.users, InteractionEntities.quizQuestions],
	views: [InteractionEntities.courses, InteractionEntities.quizzes],
}

const finders: { [K in InteractionEntities]: (id: string) => Promise<InteractionEntity | undefined> } = {
	[InteractionEntities.comments]: async (id: string) => {
		const comment = await CommentsUseCases.find(id)
		if (!comment || comment.entity.type === InteractionEntities.comments) return undefined
		return {
			type: InteractionEntities.comments,
			id: comment.id,
			userId: comment.user.id,
		}
	},
	[InteractionEntities.courses]: async (id: string) => {
		const course = await CoursesUseCases.find(id)
		if (!course) return undefined
		return {
			type: InteractionEntities.courses,
			id: course.id,
			userId: course.user.id,
		}
	},
	[InteractionEntities.quizzes]: async (id: string) => {
		const quiz = await QuizzesUseCases.find(id)
		if (!quiz) return undefined
		return {
			type: InteractionEntities.quizzes,
			id: quiz.id,
			userId: quiz.user.id,
		}
	},
	[InteractionEntities.conversations]: async (id: string) => {
		const conversation = await ConversationsUseCases.find(id)
		if (!conversation) return undefined
		return {
			type: InteractionEntities.conversations,
			id: conversation.id,
			userId: conversation.user.id,
		}
	},
	[InteractionEntities.users]: async (id: string) => {
		const user = await UsersUseCases.find(id)
		if (!user) return undefined
		return {
			type: InteractionEntities.users,
			id: user.id,
			userId: user.id,
		}
	},
	[InteractionEntities.quizQuestions]: async (id: string) => {
		const question = await QuestionsUseCases.find(id)
		if (!question) return undefined
		return {
			type: InteractionEntities.quizQuestions,
			id: question.id,
			userId: question.userId,
		}
	},
}

export const verifyInteraction = async ({ type, id }: { type: InteractionEntities; id: string }, interaction: Interactions) => {
	const supported = InteractionsMappings[interaction]?.includes(type)
	const finder = finders[type]
	if (!supported || !finder) throw new BadRequestError(`${interaction} not supported for ${type}`)
	const entity = await finder(id)
	if (!entity) throw new BadRequestError(`no ${type} with id ${id} found`)
	return entity
}
