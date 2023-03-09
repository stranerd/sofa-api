import { CommentsUseCases, InteractionEntities, verifyInteractionEntity } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import {
	BadRequestError,
	NotAuthorizedError,
	QueryParams,
	Request,
	Schema,
	validateReq
} from 'equipped'

export class CommentsController {
	static async getComments (req: Request) {
		const query = req.query as QueryParams
		return await CommentsUseCases.get(query)
	}

	static async findComment (req: Request) {
		return await CommentsUseCases.find(req.params.id)
	}

	static async createComment (req: Request) {
		const { body, entity } = validateReq(
			{
				body: Schema.string().min(1),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.any<InteractionEntities>().in(Object.values(InteractionEntities))
				})
			},
			req.body
		)

		const userId = await verifyInteractionEntity(entity.type, entity.id, 'comments')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await CommentsUseCases.create({
			body,
			entity: { ...entity, userId },
			user: user.getEmbedded()
		})
	}

	static async updateComment (req: Request) {
		const { body } = validateReq(
			{
				body: Schema.string().min(1)
			},
			req.body
		)

		const updated = await CommentsUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data: { body }
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async deleteComment (req: Request) {
		const isDeleted = await CommentsUseCases.delete({
			id: req.params.id,
			userId: req.authUser!.id
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}