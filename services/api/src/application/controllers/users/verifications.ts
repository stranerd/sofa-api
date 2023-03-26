import { VerificationSocials, VerificationsUseCases } from '@modules/users'
import {
	BadRequestError,
	NotAuthorizedError,
	QueryParams,
	Request,
	Schema, validate
} from 'equipped'

export class VerificationsController {
	static async find (req: Request) {
		const verification = await VerificationsUseCases.find(req.params.id)
		const isAdmin = req.authUser?.roles.isAdmin || req.authUser?.roles.isSuperAdmin
		if (!verification) return null
		if (verification.userId === req.authUser!.id || isAdmin) return verification
		return null
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		const isAdmin = req.authUser?.roles.isAdmin || req.authUser?.roles.isSuperAdmin
		if (!isAdmin) query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await VerificationsUseCases.get(query)
	}

	static async create (req: Request) {
		const authUser = req.authUser!
		if (authUser.roles.isVerified) throw new BadRequestError('User is already verified')

		const { socials, content } = validate({
			socials: Schema.object({
				[VerificationSocials.website]: Schema.string().default(''),
				[VerificationSocials.facebook]: Schema.string().default(''),
				[VerificationSocials.twitter]: Schema.string().default(''),
				[VerificationSocials.instagram]: Schema.string().default(''),
				[VerificationSocials.linkedIn]: Schema.string().default(''),
				[VerificationSocials.youtube]: Schema.string().default(''),
				[VerificationSocials.tiktok]: Schema.string().default(''),
			}),
			content: Schema.object({
				courses: Schema.array(Schema.string().min(1)).has(1),
				quizzes: Schema.array(Schema.string().min(1)).has(3),
			}),
		}, req.body)

		// TODO; verify ownership of contents and profile

		return await VerificationsUseCases.create({
			userId: authUser.id, socials, content,
			pending: true, accepted: false
		})
	}

	static async accept (req: Request) {
		const { accept } = validate({
			accept: Schema.boolean()
		}, req.body)
		const isUpdated = await VerificationsUseCases.accept({ id: req.params.id, accept })
		if (isUpdated) return isUpdated
		throw new NotAuthorizedError()
	}
}