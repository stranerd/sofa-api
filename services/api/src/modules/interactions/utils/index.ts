import { TutorRequestsUseCases } from '@modules/conversations'
import { CoursesUseCases, QuizzesUseCases } from '@modules/study'
import { CommentsUseCases } from '../'
import { InteractionEntities } from '../domain/types'

type Interactions = 'comments' | 'likes' | 'dislikes' | 'reviews' | 'views'

const finders = {
	[InteractionEntities.comments]: async (id: string) => {
		const comment = await CommentsUseCases.find(id)
		if (!comment || comment.entity.type === InteractionEntities.comments) return undefined
		return comment.user.id
	},
	[InteractionEntities.courses]: async (id: string) => {
		const course = await CoursesUseCases.find(id)
		return course?.user.id ?? undefined
	},
	[InteractionEntities.quizzes]: async (id: string) => {
		const quiz = await QuizzesUseCases.find(id)
		return quiz?.user.id ?? undefined
	},
	[InteractionEntities.tutorConversations]: async (id: string) => {
		const request = await TutorRequestsUseCases.find(id)
		return request?.tutor.id ?? undefined
	}
}

export const verifyInteractionAndGetUserId = async (type: InteractionEntities, id: string, interaction: Interactions) => {
	const types = (() => {
		if (interaction === 'comments') return [InteractionEntities.comments]
		if (interaction === 'views') return [InteractionEntities.courses, InteractionEntities.quizzes]
		if (interaction === 'reviews') return [InteractionEntities.courses, InteractionEntities.quizzes, InteractionEntities.tutorConversations]
		return []
	})().reduce((acc, cur) => {
		acc[cur] = finders[cur]
		return acc
	}, {} as Record<InteractionEntities, (id: string) => Promise<string | undefined>>)

	const finder = types[type]
	if (!finder) throw new Error(`${interaction} not supported for ${type}`)
	const res = await finder(id)
	if (!res) throw new Error(`no ${type} with id ${id} found`)
	return res
}