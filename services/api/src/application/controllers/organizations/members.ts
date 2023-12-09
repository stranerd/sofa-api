import { MemberTypes, MembersUseCases, canAccessOrg } from '@modules/organizations'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, Conditions, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class MembersController {
	static async find (req: Request) {
		const { results: members } = await MembersUseCases.get({
			auth: [
				{ field: 'organizationId', value: req.params.organizationId },
				{ field: 'email', value: req.params.email }
			]
		})
		const member = members.at(0) ?? null
		if (!member) return null
		if (member.email === req.authUser!.email || member.organizationId === req.authUser!.id) return member
		return null
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [
			{ field: 'organizationId', value: req.params.organizationId },
			...(req.authUser!.id === req.params.organizationId ? [] : [{ field: 'email', value: req.authUser!.email }])
		]
		return await MembersUseCases.get(query)
	}

	static async add (req: Request) {
		const { emails, type } = validate({
			emails: Schema.array(Schema.string().email()),
			type: Schema.in(Object.values(MemberTypes))
		}, req.body)

		const { results: users } = await UsersUseCases.get({
			where: [{ field: 'bio.email', value: emails, condition: Conditions.in }],
			all: true
		})

		return await MembersUseCases.add({
			organizationId: req.params.organizationId,
			members: emails.map((email) => ({
				email, type,
				user: users.find((u) => u.bio.email === email && !u.isDeleted())?.getEmbedded() ?? null,
			}))
		})
	}

	static async request (req: Request) {
		const organization = await UsersUseCases.find(req.params.organizationId)
		if (!organization || !organization.isOrg() || organization.isDeleted()) throw new BadRequestError('organization not found')
		const orgCode = organization.getOrgCode()

		const { code, type } = validate({
			code: Schema.force.string().nullish().custom((val) => orgCode ? val === orgCode : true, 'doesn\'t match'),
			type: Schema.in(Object.values(MemberTypes))
		}, req.body)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await MembersUseCases.request({
			email: req.authUser!.email, organizationId: req.params.organizationId,
			withCode: !!code, user: user.getEmbedded(), type
		})
	}

	static async accept (req: Request) {
		const { email, type, accept } = validate({
			email: Schema.string().email(),
			accept: Schema.boolean(),
			type: Schema.in(Object.values(MemberTypes))
		}, req.body)

		const hasAccess = await canAccessOrg(req.authUser!.id, req.params.organizationId)
		if (!hasAccess) throw new NotAuthorizedError()

		return await MembersUseCases.accept({ organizationId: hasAccess.id, email, accept, type })
	}

	static async leave (req: Request) {
		const { type } = validate({
			type: Schema.in(Object.values(MemberTypes))
		}, req.body)

		const deleted = await MembersUseCases.remove({ email: req.authUser!.email, type, organizationId: req.params.organizationId })
		if (deleted) return deleted
		throw new NotAuthorizedError()
	}

	static async remove (req: Request) {
		const { email, type } = validate({
			email: Schema.string().email(),
			type: Schema.in(Object.values(MemberTypes))
		}, req.body)

		const hasAccess = await canAccessOrg(req.authUser!.id, req.params.organizationId)
		if (!hasAccess) throw new NotAuthorizedError()

		const deleted = await MembersUseCases.remove({ email, type, organizationId: hasAccess.id })

		if (deleted) return deleted
		throw new NotAuthorizedError()
	}
}