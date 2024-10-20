import { UploaderUseCases } from '@modules/storage'
import { DraftStatus, generateAiQuizAndQuestions, QuestionTypes, QuizModes, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { AuthRole, BadRequestError, Conditions, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'
import { verifyTags } from './tags'

const modesSchema = Object.values(QuizModes).reduce(
	(acc, cur) => {
		acc[cur] = Schema.boolean().default(true)
		return acc
	},
	{} as Record<QuizModes, ReturnType<typeof Schema.boolean>>,
)

const schema = (isAdmin: boolean) => ({
	title: Schema.string().min(1),
	description: Schema.string().min(1),
	photo: Schema.file().image().nullable(),
	topic: Schema.string().min(1),
	tags: Schema.array(Schema.string().min(1)).set(),
	isForTutors: Schema.boolean()
		.default(false)
		.custom((value) => (isAdmin ? true : value === false)),
	modes: Schema.object(modesSchema),
	timeLimit: Schema.number().gt(0).int().nullable(),
})

export class QuizController {
	static async find(req: Request) {
		const quiz = await QuizzesUseCases.find(req.params.id)
		return quiz
	}

	static async similar(req: Request) {
		const quiz = await QuizzesUseCases.find(req.params.id)
		if (!quiz) return []
		const { results } = await QuizzesUseCases.get({
			where: [{ field: 'id', value: quiz.id, condition: Conditions.ne }],
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
		const uploadedPhoto = req.body.photo?.at?.(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const {
			photo: _,
			topic,
			tags,
			...rest
		} = validate(schema(isAdmin), {
			...req.body,
			photo: uploadedPhoto,
		})

		const utags = await verifyTags(topic, tags)

		const photo = uploadedPhoto ? await UploaderUseCases.upload('study/quizzes', uploadedPhoto) : undefined

		const updatedQuiz = await QuizzesUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data: {
				...utags,
				...rest,
				...(changedPhoto ? { photo } : {}),
			},
		})
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async create(req: Request) {
		const isAdmin = !!(req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin])
		const data = validate(schema(isAdmin), { ...req.body, photo: req.body.photo?.at?.(0) ?? null })

		const tags = await verifyTags(data.topic, data.tags)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const photo = data.photo ? await UploaderUseCases.upload('study/quizzes', data.photo) : null

		return await QuizzesUseCases.add({
			...data,
			...tags,
			user: user.getEmbedded(),
			photo,
			status: DraftStatus.draft,
		})
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

	static async aiGen(req: Request) {
		const data = validate(
			{
				content: Schema.string(),
				amount: Schema.number().int().gt(0).lte(5),
				questionType: Schema.in(Object.values(QuestionTypes)),
			},
			req.body,
		)

		const response = await generateAiQuizAndQuestions({
			finalPrompt: data.content,
			questionAmount: data.amount,
			questionType: data.questionType,
		})

		return response
	}
}
