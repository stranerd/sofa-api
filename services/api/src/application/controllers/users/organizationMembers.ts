import { OrganizationMembersUseCases } from '@modules/users'
import { QueryParams, Request } from 'equipped'

export class OrganizationMembersController {
	static async find (req: Request) {
		const { results: users } = await OrganizationMembersUseCases.get({
			auth: [
				{ field: 'organizationId', value: req.params.organizationId },
				{ field: 'email', value: req.params.email }
			]
		})
		return users.at(0) ?? null
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [
			{ field: 'organizationId', value: req.params.organizationId }
		]
		return await OrganizationMembersUseCases.get(query)
	}
}