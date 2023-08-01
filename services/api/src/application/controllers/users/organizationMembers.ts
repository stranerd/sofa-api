import { OrganizationMembersUseCases, UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

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

	static async add (req: Request) {
		const organization = await UsersUseCases.find(req.params.organizationId)
		if (!organization || !organization.isOrg()) throw new BadRequestError('organization not found')

		const { emails } = validate({
			emails: Schema.array(Schema.string().email())
		}, req.body)

		return await OrganizationMembersUseCases.add({
			emails, userId: req.authUser!.id, organizationId: req.params.organizationId
		})
	}

	static async request (req: Request) {
		const organization = await UsersUseCases.find(req.params.organizationId)
		if (!organization || !organization.isOrg()) throw new BadRequestError('organization not found')
		const orgCode = organization.getOrgCode()

		const { code } = validate({
			code: Schema.force.string().nullish().custom((val) => orgCode ? val === orgCode : true, 'doesn\'t match')
		}, req.body)

		return await OrganizationMembersUseCases.request({
			email: req.authUser!.email, organizationId: req.params.organizationId,
			withCode: !!code
		})
	}

	static async accept (req: Request) {
		const { email, accept } = validate({
			email: Schema.string().email(),
			accept: Schema.boolean()
		}, req.body)

		return await OrganizationMembersUseCases.accept({
			userId: req.authUser!.id, organizationId: req.params.organizationId,
			email, accept
		})
	}

	static async leave (req: Request) {
		const deleted = await OrganizationMembersUseCases.remove({
			email: req.authUser!.email, userId: null,
			organizationId: req.params.organizationId
		})
		if (deleted) return deleted
		throw new NotAuthorizedError()
	}

	static async remove (req: Request) {
		const { email } = validate({
			email: Schema.string().email()
		}, req.body)

		const deleted = await OrganizationMembersUseCases.remove({
			email, userId: req.authUser!.id,
			organizationId: req.params.organizationId
		})

		if (deleted) return deleted
		throw new NotAuthorizedError()
	}
}