import { TagsUseCases } from '@modules/interactions'
import { UploaderUseCases } from '@modules/storage'
import { CoursesUseCases, DraftStatus, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class QuizController {
	private static schema = () => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		photo: Schema.file().image().nullable(),
		isPublic: Schema.boolean()
	})

	static async find (req: Request) {
		return await QuizzesUseCases.find(req.params.id)
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await QuizzesUseCases.get(query)
	}

	static async update (req: Request) {
		const uploadedPhoto = req.files.photo?.[0] ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { title, description, isPublic } = validateReq(this.schema(), { ...req.body, photo: uploadedPhoto })

		const photo = uploadedPhoto ? await UploaderUseCases.upload('study/quizzes', uploadedPhoto) : undefined

		const updatedQuiz = await QuizzesUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data: {
				title, description, isPublic,
				...(changedPhoto ? { photo } : {})
			}
		})
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const data = validateReq({
			...this.schema(),
			tagId: Schema.string().min(1),
			courseId: Schema.string().min(1).nullable()
		}, { ...req.body, photo: req.files.photo?.[0] ?? null })

		const tag = await TagsUseCases.find(data.tagId)
		if (!tag) throw new BadRequestError('tag not found')

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const photo = data.photo ? await UploaderUseCases.upload('study/quizzes', data.photo) : null

		const course = data.courseId ? await CoursesUseCases.find(data.courseId) : null
		if (data.courseId && !course) throw new BadRequestError('course not found')
		if (course && course.user.id !== user.id) throw new NotAuthorizedError()
		if (course && course!.status !== DraftStatus.draft) throw new BadRequestError('course cannot be updated')

		return await QuizzesUseCases.add({
			...data, user: user.getEmbedded(),
			photo, status: DraftStatus.draft,
			...(data.courseId && course ? {
				courseId: course.id,
				status: course.status,
				tagId: course.tagId,
				isPublic: course.isPublic
			} : {})
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
		const { questions } = validateReq({
			questions: Schema.array(Schema.string().min(1)).min(1)
		}, req.body)

		const updatedQuiz = await QuizzesUseCases.reorder({ id: req.params.id, userId: req.authUser!.id, questionIds: questions })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}
}