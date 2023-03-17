import { BadRequestError } from 'equipped'
import { CommentsUseCases } from '../'
import { InteractionEntities } from '../domain/types'

type Interactions = 'comments' | 'likes' | 'dislikes' | 'views'

const finders = {
	[InteractionEntities.comments]: async (id: string) => {
		const comment = await CommentsUseCases.find(id)
		if (!comment || comment.entity.type === InteractionEntities.comments) return undefined
		return comment.user.id
	},
}

export const verifyInteractionAndGetUserId = async (type: InteractionEntities, id: string, interaction: Interactions) => {
	const types = (() => {
		if (interaction === 'comments') return [InteractionEntities.comments]
		if (interaction === 'views') return []
		return []
	})().reduce((acc, cur) => {
		acc[cur] = finders[cur]
		return acc
	}, {} as Record<InteractionEntities, (id: string) => Promise<string | undefined>>)

	const finder = types[type]
	if (!finder) throw new BadRequestError(`${interaction} not supported for ${type}`)
	const res = await finder(id)
	if (!res) throw new BadRequestError(`no ${type} with id ${id} found`)
	return res
}