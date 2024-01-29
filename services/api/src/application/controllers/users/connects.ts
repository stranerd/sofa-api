import { ConnectsUseCases, UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class ConnectsController {
	static async find(req: Request) {
		const connect = await ConnectsUseCases.find(req.params.id)
		if (!connect || ![connect.from.id, connect.to.id].includes(req.authUser!.id)) return null
		return connect
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		const authUserId = req.authUser!.id
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'from.id', value: authUserId },
			{ field: 'to.id', value: authUserId },
		]
		return await ConnectsUseCases.get(query)
	}

	static async delete(req: Request) {
		const isDeleted = await ConnectsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async create(req: Request) {
		const { to } = validate(
			{
				to: Schema.string(),
			},
			req.body,
		)
		const fromUser = await UsersUseCases.find(req.authUser!.id)
		if (!fromUser || fromUser.isDeleted()) throw new BadRequestError('profile not found')
		const toUser = await UsersUseCases.find(to)
		if (!toUser || toUser.isDeleted()) throw new BadRequestError('to not found')

		return await ConnectsUseCases.create({
			from: fromUser.getEmbedded(),
			to: toUser.getEmbedded(),
			pending: true,
			accepted: false,
		})
	}

	static async accept(req: Request) {
		const { accept } = validate(
			{
				accept: Schema.boolean(),
			},
			req.body,
		)
		const isUpdated = await ConnectsUseCases.accept({
			id: req.params.id,
			userId: req.authUser!.id,
			accept,
		})
		if (isUpdated) return isUpdated
		throw new NotAuthorizedError()
	}
}
