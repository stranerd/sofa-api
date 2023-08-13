import { TutorRequestsUseCases } from '@modules/conversations'
import { UsersUseCases } from '@modules/users'
import { AuthRole, BadRequestError, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class TutorRequestController {
	static async find (req: Request) {
		const tutorRequest = await TutorRequestsUseCases.find(req.params.id)
		if (!tutorRequest) return null
		if (![tutorRequest.userId, tutorRequest.tutor.id].includes(req.authUser!.id)) return null
		return tutorRequest
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.or
		query.auth = [{ field: 'userId', value: req.authUser!.id }, { field: 'tutor.id', value: req.authUser!.id }]
		return await TutorRequestsUseCases.get(query)
	}

	static async create (req: Request) {
		const { conversationId, tutorId } = validate({
			conversationId: Schema.string().min(1),
			tutorId: Schema.string().min(1),
		}, req.body)

		const tutor = await UsersUseCases.find(tutorId)
		if (!tutor || tutor.isDeleted() || !tutor.roles[AuthRole.isTutor]) throw new BadRequestError('tutor not found')

		return await TutorRequestsUseCases.create({ userId: req.authUser!.id, conversationId, tutor: tutor.getEmbedded() })
	}

	static async delete (req: Request) {
		const isDeleted = await TutorRequestsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async accept (req: Request) {
		const { accept } = validate({
			accept: Schema.boolean()
		}, req.body)
		const isUpdated = await TutorRequestsUseCases.accept({ id: req.params.id, accept, tutorId: req.authUser!.id })
		if (isUpdated) return isUpdated
		throw new NotAuthorizedError()
	}
}