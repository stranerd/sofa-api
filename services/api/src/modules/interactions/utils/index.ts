import { ConversationsUseCases } from '@modules/conversations'
import { CoursesUseCases, QuestionsUseCases, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, Schema } from 'equipped'
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

const finders: {
	[K in InteractionEntities]: (
		data: Omit<Extract<InteractionEntity, { type: K }>, 'userId'>,
	) => Promise<Extract<InteractionEntity, { type: K }> | undefined>
} = {
	[InteractionEntities.comments]: async ({ id, relations }) => {
		const comment = await CommentsUseCases.find(id)
		if (!comment || comment.entity.type === InteractionEntities.comments) return undefined
		return {
			type: InteractionEntities.comments,
			id: comment.id,
			userId: comment.user.id,
			relations,
		}
	},
	[InteractionEntities.courses]: async ({ id, relations }) => {
		const course = await CoursesUseCases.find(id)
		if (!course) return undefined
		return {
			type: InteractionEntities.courses,
			id: course.id,
			userId: course.user.id,
			relations,
		}
	},
	[InteractionEntities.quizzes]: async ({ id, relations }) => {
		const quiz = await QuizzesUseCases.find(id)
		if (!quiz) return undefined
		return {
			type: InteractionEntities.quizzes,
			id: quiz.id,
			userId: quiz.user.id,
			relations,
		}
	},
	[InteractionEntities.conversations]: async ({ id, relations }) => {
		const conversation = await ConversationsUseCases.find(id)
		if (!conversation) return undefined
		return {
			type: InteractionEntities.conversations,
			id: conversation.id,
			userId: conversation.user.id,
			relations,
		}
	},
	[InteractionEntities.users]: async ({ id, relations }) => {
		const user = await UsersUseCases.find(id)
		if (!user) return undefined
		return {
			type: InteractionEntities.users,
			id: user.id,
			userId: user.id,
			relations,
		}
	},
	[InteractionEntities.quizQuestions]: async ({ id, relations }) => {
		const question = await QuestionsUseCases.find(id)
		if (!question) return undefined
		return {
			type: InteractionEntities.quizQuestions,
			id: question.id,
			userId: question.userId,
			relations,
		}
	},
}

export const verifyInteraction = async (
	baseEntity: Omit<InteractionEntity, 'userId'>,
	interaction: Interactions,
): Promise<InteractionEntity> => {
	const supported = InteractionsMappings[interaction]?.includes(baseEntity.type)
	const finder = finders[baseEntity.type]
	if (!supported || !finder) throw new BadRequestError(`${interaction} not supported for ${baseEntity.type}`)
	const entity = await finder(baseEntity as any)
	if (!entity) throw new BadRequestError(`no ${baseEntity.type} with id ${baseEntity.id} found`)
	return entity
}

export const EntitySchema = () =>
	Schema.discriminate((entity) => entity.type, {
		[InteractionEntities.comments]: Schema.object({
			id: Schema.string(),
			type: Schema.is(InteractionEntities.comments as const),
			relations: Schema.object({}).default({}),
		}),
		[InteractionEntities.courses]: Schema.object({
			id: Schema.string(),
			type: Schema.is(InteractionEntities.courses as const),
			relations: Schema.object({}).default({}),
		}),
		[InteractionEntities.quizzes]: Schema.object({
			id: Schema.string(),
			type: Schema.is(InteractionEntities.quizzes as const),
			relations: Schema.object({}).default({}),
		}),
		[InteractionEntities.conversations]: Schema.object({
			id: Schema.string(),
			type: Schema.is(InteractionEntities.conversations as const),
			relations: Schema.object({}).default({}),
		}),
		[InteractionEntities.users]: Schema.object({
			id: Schema.string(),
			type: Schema.is(InteractionEntities.users as const),
			relations: Schema.object({}).default({}),
		}),
		[InteractionEntities.quizQuestions]: Schema.object({
			id: Schema.string(),
			type: Schema.is(InteractionEntities.quizQuestions as const),
			relations: Schema.object({}).default({}),
		}),
	})
