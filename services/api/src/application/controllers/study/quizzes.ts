import { UploaderUseCases } from '@modules/storage'
import { Coursable, CoursesUseCases, DraftStatus, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { AuthRole, BadRequestError, Conditions, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'
import { verifyTags } from './tags'

export class QuizController {
	private static schema = (isAdmin: boolean) => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		photo: Schema.file().image().nullable(),
		topic: Schema.string().min(1),
		tags: Schema.array(Schema.string().min(1)).set(),
		isForTutors: Schema.boolean()
			.default(false)
			.custom((value) => (isAdmin ? true : value === false)),
	})

	static async find(req: Request) {
		const quiz = await QuizzesUseCases.find(req.params.id)
		return quiz
	}

	static async similar(req: Request) {
		const quiz = await QuizzesUseCases.find(req.params.id)
		if (!quiz) return []
		const { results } = await QuizzesUseCases.get({
			authType: QueryKeys.or,
			auth: [
				{ field: 'topicId', value: quiz.topicId },
				{ field: 'status', value: DraftStatus.published },
				{ field: 'tagIds', condition: Conditions.in, value: quiz.tagIds },
			],
			limit: 10,
		})
		return results
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.and
		query.auth = [{ field: 'isForTutors', value: false }]
		return await QuizzesUseCases.get(query)
	}

	static async getForTutors(req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.and
		query.auth = [{ field: 'isForTutors', value: true }]
		return await QuizzesUseCases.get(query)
	}

	static async update(req: Request) {
		const isAdmin = !!(req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin])
		const uploadedPhoto = req.files.photo?.at(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { title, description, topic, tags, isForTutors } = validate(this.schema(isAdmin), { ...req.body, photo: uploadedPhoto })

		const utags = await verifyTags(topic, tags)

		const photo = uploadedPhoto ? await UploaderUseCases.upload('study/quizzes', uploadedPhoto) : undefined

		const updatedQuiz = await QuizzesUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data: {
				...utags,
				title,
				description,
				isForTutors,
				...(changedPhoto ? { photo } : {}),
			},
		})
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async create(req: Request) {
		const isAdmin = !!(req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin])
		const data = validate(
			{
				...this.schema(isAdmin),
				courseId: Schema.string().min(1).nullable().default(null),
			},
			{ ...req.body, photo: req.files.photo?.at(0) ?? null },
		)

		const tags = await verifyTags(data.topic, data.tags)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const photo = data.photo ? await UploaderUseCases.upload('study/quizzes', data.photo) : null

		const quiz = await QuizzesUseCases.add({
			...data,
			...tags,
			user: user.getEmbedded(),
			photo,
			status: DraftStatus.draft,
			courseId: null,
		})

		if (data.courseId)
			await CoursesUseCases.move({
				id: data.courseId,
				userId: quiz.user.id,
				coursableId: quiz.id,
				type: Coursable.file,
				add: true,
			}).catch()

		return quiz
	}

	static async delete(req: Request) {
		const isAdmin = !!(req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin])
		const isDeleted = await QuizzesUseCases.delete({ id: req.params.id, userId: req.authUser!.id, isAdmin })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async publish(req: Request) {
		const updatedQuiz = await QuizzesUseCases.publish({ id: req.params.id, userId: req.authUser!.id })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async reorder(req: Request) {
		const { questions } = validate(
			{
				questions: Schema.array(Schema.string().min(1)).min(1),
			},
			req.body,
		)

		const updatedQuiz = await QuizzesUseCases.reorder({ id: req.params.id, userId: req.authUser!.id, questionIds: questions })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async requestAccess(req: Request) {
		const { add } = validate({ add: Schema.boolean() }, req.body)

		const updatedQuiz = await QuizzesUseCases.requestAccess({ id: req.params.id, userId: req.authUser!.id, add })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async grantAccess(req: Request) {
		const { userId, grant } = validate(
			{
				userId: Schema.string().min(1),
				grant: Schema.boolean(),
			},
			req.body,
		)

		const updatedQuiz = await QuizzesUseCases.grantAccess({ id: req.params.id, ownerId: req.authUser!.id, userId, grant })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async addMembers(req: Request) {
		const { userIds, grant } = validate(
			{
				userIds: Schema.array(Schema.string().min(1)).min(1),
				grant: Schema.boolean(),
			},
			req.body,
		)

		if (grant) {
			const users = await UsersUseCases.get({
				where: [{ field: 'id', value: userIds, condition: Conditions.in }],
			})
			const activeUsers = users.results.filter((u) => !u.isDeleted())
			if (userIds.length !== activeUsers.length) throw new BadRequestError('some users not found')
		}

		const updatedQuiz = await QuizzesUseCases.addMembers({ id: req.params.id, ownerId: req.authUser!.id, userIds, grant })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}
}
