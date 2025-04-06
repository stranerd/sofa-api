import type { QueryParams, Request } from 'equipped'
import { BadRequestError, NotAuthorizedError, QueryKeys, Schema, validate } from 'equipped'

import { InteractionEntities, verifyInteraction, ViewsUseCases } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'

export class ViewsController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		const userId = req.authUser!.id
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'entity.userId', value: userId },
			{ field: 'user.id', value: userId },
		]
		return await ViewsUseCases.get(query)
	}

	static async find(req: Request) {
		const view = await ViewsUseCases.find(req.params.id)
		const userId = req.authUser!.id
		if (!view) return null
		if (view.user.id !== userId && view.entity.userId !== userId) return null
		return view
	}

	static async create(req: Request) {
		const data = validate(
			{
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const entity = await verifyInteraction(data.entity, 'views')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await ViewsUseCases.create({
			entity,
			user: user.getEmbedded(),
		})
	}

	static async delete(req: Request) {
		const isDeleted = await ViewsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
