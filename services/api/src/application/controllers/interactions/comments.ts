import type { QueryParams, Request } from 'equipped'
import { BadRequestError, NotAuthorizedError, Schema, validate } from 'equipped'

import { CommentsUseCases, InteractionEntities, verifyInteraction } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'

const schema = () => ({
	body: Schema.string().min(1),
})

export class CommentsController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		return await CommentsUseCases.get(query)
	}

	static async find(req: Request) {
		return await CommentsUseCases.find(req.params.id)
	}

	static async create(req: Request) {
		const data = validate(
			{
				...schema(),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const entity = await verifyInteraction(data.entity, 'comments')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await CommentsUseCases.create({
			...data,
			entity,
			user: user.getEmbedded(),
		})
	}

	static async update(req: Request) {
		const data = validate(schema(), req.body)

		const updated = await CommentsUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async delete(req: Request) {
		const isDeleted = await CommentsUseCases.delete({
			id: req.params.id,
			userId: req.authUser!.id,
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
