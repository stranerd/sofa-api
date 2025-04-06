import type { QueryParams, Request } from 'equipped'
import { BadRequestError, Schema, validate } from 'equipped'

import { InteractionEntities, ReviewsUseCases, verifyInteraction } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'

export class ReviewsController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		return await ReviewsUseCases.get(query)
	}

	static async find(req: Request) {
		return await ReviewsUseCases.find(req.params.id)
	}

	static async add(req: Request) {
		const data = validate(
			{
				rating: Schema.number().round(0).gte(0).lte(5),
				message: Schema.string(),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const entity = await verifyInteraction(data.entity, 'reviews')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await ReviewsUseCases.add({
			...data,
			entity,
			user: user.getEmbedded(),
		})
	}
}
