import { TagsUseCases } from '@modules/interactions'
import { UploaderUseCases } from '@modules/storage'
import { DraftStatus, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class QuizController {
	private static schema = () => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		photo: Schema.file().image().nullable()
	})

	static async find (req: Request) {
		return await QuizzesUseCases.find(req.params.id)
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await QuizzesUseCases.get(query)
	}

	static async update (req: Request) {
		const uploadedPhoto = req.files.photo?.at(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { title, description } = validate(this.schema(), { ...req.body, photo: uploadedPhoto })

		const photo = uploadedPhoto ? await UploaderUseCases.upload('study/quizzes', uploadedPhoto) : undefined

		const updatedQuiz = await QuizzesUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data: {
				title, description,
				...(changedPhoto ? { photo } : {})
			}
		})
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const data = validate({
			...this.schema(),
			tagId: Schema.string().min(1),
		}, { ...req.body, photo: req.files.photo?.at(0) ?? null })

		const tag = await TagsUseCases.find(data.tagId)
		if (!tag) throw new BadRequestError('tag not found')

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const photo = data.photo ? await UploaderUseCases.upload('study/quizzes', data.photo) : null

		return await QuizzesUseCases.add({
			...data, user: user.getEmbedded(),
			photo, status: DraftStatus.draft,
			courseId: null
		})
	}

	static async delete (req: Request) {
		const isDeleted = await QuizzesUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
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