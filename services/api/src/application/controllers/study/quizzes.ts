import { UploaderUseCases } from '@modules/storage'
import { DraftStatus, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { AuthRole, BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'
import { verifyTags } from '.'

export class QuizController {
	private static schema = (isAdmin: boolean) => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		photo: Schema.file().image().nullable(),
		topicId: Schema.string().min(1),
		tagIds: Schema.array(Schema.string().min(1)).set(),
		isForTutors: Schema.boolean().default(false).custom((value) => isAdmin ? true : value === false)
	})

	static async find (req: Request) {
		const quiz = await QuizzesUseCases.find(req.params.id)
		if (!quiz) return null
		const isAdmin = req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin]
		if (!isAdmin && quiz.isForTutors) return null
		return quiz
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'isForTutors', value: false }]
		return await QuizzesUseCases.get(query)
	}

	static async getForTutors (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'isForTutors', value: true }]
		return await QuizzesUseCases.get(query)
	}

	static async update (req: Request) {
		const isAdmin = !!(req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin])
		const uploadedPhoto = req.files.photo?.at(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { title, description, topicId, tagIds } = validate(this.schema(isAdmin), { ...req.body, photo: uploadedPhoto })

		const utags = await verifyTags(topicId, tagIds)

		const photo = uploadedPhoto ? await UploaderUseCases.upload('study/quizzes', uploadedPhoto) : undefined

		const updatedQuiz = await QuizzesUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data: {
				...utags, title, description,
				...(changedPhoto ? { photo } : {})
			}
		})
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const isAdmin = !!(req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin])
		const data = validate(this.schema(isAdmin),
			{ ...req.body, photo: req.files.photo?.at(0) ?? null })

		const tags = await verifyTags(data.topicId, data.tagIds)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const photo = data.photo ? await UploaderUseCases.upload('study/quizzes', data.photo) : null

		return await QuizzesUseCases.add({
			...data, ...tags, user: user.getEmbedded(),
			photo, status: DraftStatus.draft,
			courseId: null
		})
	}

	static async delete (req: Request) {
		const isAdmin = !!(req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin])
		const isDeleted = await QuizzesUseCases.delete({ id: req.params.id, userId: req.authUser!.id, isAdmin })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async publish (req: Request) {
		const updatedQuiz = await QuizzesUseCases.publish({ id: req.params.id, userId: req.authUser!.id })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async reorder (req: Request) {
		const { questions } = validate({
			questions: Schema.array(Schema.string().min(1)).min(1)
		}, req.body)

		const updatedQuiz = await QuizzesUseCases.reorder({ id: req.params.id, userId: req.authUser!.id, questionIds: questions })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}
}