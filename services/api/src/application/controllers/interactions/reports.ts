import type { QueryParams, Request } from 'equipped'
import { AuthRole, BadRequestError, QueryKeys, Schema, validate } from 'equipped'

import { InteractionEntities, ReportsUseCases, verifyInteraction } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'

export class ReportController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		const userId = req.authUser!.id
		const isAdmin = req.authUser!.roles[AuthRole.isAdmin]
		if (!isAdmin) {
			query.authType = QueryKeys.or
			query.auth = [
				{ field: 'entity.userId', value: userId },
				{ field: 'user.id', value: userId },
			]
		}
		return await ReportsUseCases.get(query)
	}

	static async find(req: Request) {
		const report = await ReportsUseCases.find(req.params.id)
		const userId = req.authUser!.id
		const isAdmin = req.authUser!.roles[AuthRole.isAdmin]
		if (!report) return null
		if (!isAdmin && report.user.id !== userId && report.entity.userId !== userId) return null
		return report
	}

	static async delete(req: Request) {
		return await ReportsUseCases.delete(req.params.id)
	}

	static async create(req: Request) {
		const data = validate(
			{
				message: Schema.string().min(1),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const entity = await verifyInteraction(data.entity, 'reports')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await ReportsUseCases.create({
			...data,
			entity,
			user: user.getEmbedded(),
		})
	}
}
