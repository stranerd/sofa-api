import { InteractionEntities, LikesUseCases, verifyInteraction } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class LikesController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		const userId = req.authUser!.id
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'entity.userId', value: userId },
			{ field: 'user.id', value: userId },
		]
		return await LikesUseCases.get(query)
	}

	static async find(req: Request) {
		const like = await LikesUseCases.find(req.params.id)
		const userId = req.authUser!.id
		if (!like) return null
		if (like.user.id !== userId && like.entity.userId !== userId) return null
		return like
	}

	static async create(req: Request) {
		const data = validate(
			{
				value: Schema.boolean(),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const entity = await verifyInteraction(data.entity, data.value ? 'likes' : 'dislikes')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await LikesUseCases.like({
			...data,
			entity,
			user: user.getEmbedded(),
		})
	}
}
