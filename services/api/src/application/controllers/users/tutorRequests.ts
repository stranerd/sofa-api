import { TagsUseCases } from '@modules/interactions'
import { UploaderUseCases } from '@modules/storage'
import { TutorRequestsUseCases, UsersUseCases } from '@modules/users'
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
		const { topicId, verification, qualification } = validate({
			topicId: Schema.string().min(1),
			verification: Schema.file().image(),
			qualification: Schema.array(
				Schema.or([
					Schema.file().image(),
					Schema.file().custom((file) => file?.type === 'application/pdf')
				]),
				'should be image or pdf'
			),
		}, {
			...req.body,
			verification: req.files.verification?.at(0) ?? null,
			qualification: req.files.qualification ?? []
		})

		const topic = await TagsUseCases.find(topicId)
		if (!topic || !topic.isTopic()) throw new BadRequestError('topic not found')

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('User not found')
		if (!user.isBioComplete()) throw new BadRequestError('Complete your bio before applying for tutorship')
		if (!user.location) throw new BadRequestError('Update your location before applying for tutorship')

		const verificationUploaded = await UploaderUseCases.upload('tutorRequests/verification', verification)
		const qualificationUploaded = await UploaderUseCases.uploadMany('tutorRequests/qualification', qualification)

		return await TutorRequestsUseCases.create({
			userId: user.id, topicId,
			verification: verificationUploaded, qualification: qualificationUploaded,
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