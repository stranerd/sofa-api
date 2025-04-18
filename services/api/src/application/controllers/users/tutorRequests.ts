import type { QueryParams, Request } from 'equipped'
import { BadRequestError, NotAuthorizedError, Schema, Validation, validate } from 'equipped'

import { TagsUseCases } from '@modules/interactions'
import { PlayTypes, createPlay } from '@modules/plays'
import { UploaderUseCases } from '@modules/storage'
import { DraftStatus, QuizzesUseCases } from '@modules/study'
import { TutorRequestsUseCases, UsersUseCases } from '@modules/users'

export class TutorRequestsController {
	static async find(req: Request) {
		return await TutorRequestsUseCases.find(req.params.id)
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await TutorRequestsUseCases.get(query)
	}

	static async create(req: Request) {
		const { topicId, verification, qualification } = validate(
			{
				topicId: Schema.string().min(1),
				verification: Schema.file().image(),
				qualification: Schema.array(
					Schema.or([Schema.file().image(), Schema.file().custom((file) => file?.type === 'application/pdf')]),
					'should be image or pdf',
				),
			},
			{
				...req.body,
				verification: req.body.verification?.at?.(0) ?? null,
				qualification: req.body.qualification ?? [],
			},
		)

		const topic = await TagsUseCases.find(topicId)
		if (!topic || !topic.isTopic()) throw new BadRequestError('topic not found')

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('User not found')
		if (!user.isTeacher()) throw new BadRequestError('Only teachers can apply for tutorship')
		if (user.tutor.topics.includes(topicId)) throw new BadRequestError('You are already a tutor for this topic')
		if (!user.isBioComplete()) throw new BadRequestError('Complete your bio before applying for tutoring')
		if (!user.location) throw new BadRequestError('Update your location before applying for tutoring')

		const { results: pendingRequests } = await TutorRequestsUseCases.get({
			where: [
				{ field: 'userId', value: user.id },
				{ field: 'topicId', value: topicId },
				{ field: 'pending', value: true },
			],
			all: true,
		})
		const request = pendingRequests.at?.(0)
		if (request) return request

		const { results: quizzes } = await QuizzesUseCases.get({
			where: [
				{ field: 'topicId', value: topicId },
				{ field: 'isForTutors', value: true },
				{ field: 'status', value: DraftStatus.published },
			],
			all: true,
		})
		const quiz = Validation.getRandomSample(quizzes, 1).at(0)
		if (!quiz) throw new BadRequestError('Quiz not found for chosen topic')

		const verificationUploaded = await UploaderUseCases.upload('tutorRequests/verification', verification)
		const qualificationUploaded = await UploaderUseCases.uploadMany('tutorRequests/qualification', qualification)
		const test = await createPlay(
			user.id,
			quiz,
			{ title: `Tutor verification test for ${topic.title} on ${quiz.title}` },
			{ type: PlayTypes.tests, forTutors: true },
		)

		return await TutorRequestsUseCases.create({
			userId: user.id,
			topicId,
			testId: test.id,
			verification: verificationUploaded,
			qualification: qualificationUploaded,
		})
	}

	static async accept(req: Request) {
		const { accept, message } = validate(
			{
				accept: Schema.boolean(),
				message: Schema.string(),
			},
			req.body,
		)
		const isUpdated = await TutorRequestsUseCases.accept({ id: req.params.id, data: { accept, message } })
		if (isUpdated) return isUpdated
		throw new NotAuthorizedError()
	}
}
