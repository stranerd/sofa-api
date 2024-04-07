import { InteractionEntities, LikesUseCases, verifyInteractionAndGetUserId } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, QueryParams, Request, Schema, validate } from 'equipped'

export class LikesController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		return await LikesUseCases.get(query)
	}

	static async find(req: Request) {
		return await LikesUseCases.find(req.params.id)
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

		const userId = await verifyInteractionAndGetUserId(data.entity.type, data.entity.id, data.value ? 'likes' : 'dislikes')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await LikesUseCases.like({
			...data,
			entity: { ...data.entity, userId },
			user: user.getEmbedded(),
		})
	}
}
