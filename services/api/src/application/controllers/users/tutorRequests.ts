import { TutorRequestsUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class TutorRequestsController {
	static async find (req: Request) {
		return await TutorRequestsUseCases.find(req.params.id)
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await TutorRequestsUseCases.get(query)
	}

	static async create (req: Request) {
		const authUser = req.authUser!
		if (authUser.roles.isTutor) throw new BadRequestError('User is already a tutor')

		return await TutorRequestsUseCases.create({
			userId: authUser.id,
			pending: true, accepted: false
		})
	}

	static async accept (req: Request) {
		const { accept } = validate({
			accept: Schema.boolean()
		}, req.body)
		const isUpdated = await TutorRequestsUseCases.accept({ id: req.params.id, accept })
		if (isUpdated) return isUpdated
		throw new NotAuthorizedError()
	}
}