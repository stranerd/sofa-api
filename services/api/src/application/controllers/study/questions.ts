import { UploaderUseCases } from '@modules/storage'
import { canAccessCoursable, Coursable, QuestionsUseCases, QuestionTypes } from '@modules/study'
import { NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class QuestionController {
	private static schema = (body: Record<string, any>) => ({
		question: Schema.string()
			.min(1, true)
			.custom((val) => {
				const value = val as string
				const types = [QuestionTypes.fillInBlanks, QuestionTypes.dragAnswers]
				if (!types.includes(body?.data?.type ?? '')) return true
				return value.includes(body?.data?.indicator ?? '')
			}, 'must contain the indicator'),
		explanation: Schema.string(),
		questionMedia: Schema.file().image().nullable(),
		timeLimit: Schema.number().gt(0).lte(300).int(),
		data: Schema.discriminate((d) => d.type, {
			[QuestionTypes.multipleChoice]: Schema.object({
				type: Schema.is(QuestionTypes.multipleChoice as const),
				options: Schema.array(Schema.string().min(1, true)).min(2).max(6),
				answers: Schema.array(Schema.number().gte(0).int()).min(1).set(),
			}).custom((value) => {
				const length = value?.options?.length ?? 1
				return Schema.array(Schema.number().lt(length)).max(length).parse(value.answers).valid
			}),
			[QuestionTypes.trueOrFalse]: Schema.object({
				type: Schema.is(QuestionTypes.trueOrFalse as const),
				answer: Schema.boolean(),
			}),
			[QuestionTypes.writeAnswer]: Schema.object({
				type: Schema.is(QuestionTypes.writeAnswer as const),
				answers: Schema.array(Schema.string().min(1, true)).min(1).max(6),
			}),
			[QuestionTypes.fillInBlanks]: Schema.object({
				type: Schema.is(QuestionTypes.fillInBlanks as const),
				indicator: Schema.string().min(1),
				answers: Schema.array(Schema.string().min(1, true)).min(1),
			}).custom((value) => {
				const length = body?.question?.split(value.indicator).length ?? 1
				return Schema.array(Schema.any())
					.has(length - 1)
					.parse(value.answers).valid
			}),
			[QuestionTypes.dragAnswers]: Schema.object({
				type: Schema.is(QuestionTypes.dragAnswers as const),
				indicator: Schema.string().min(1),
				answers: Schema.array(Schema.string().min(1, true)).min(1),
			}).custom((value) => {
				const length = body?.question?.split(value.indicator).length ?? 1
				return Schema.array(Schema.any())
					.has(length - 1)
					.parse(value.answers).valid
			}),
			[QuestionTypes.sequence]: Schema.object({
				type: Schema.is(QuestionTypes.sequence as const),
				answers: Schema.array(Schema.string().min(1, true)).min(2).max(6),
			}),
			[QuestionTypes.match]: Schema.object({
				type: Schema.is(QuestionTypes.match as const),
				set: Schema.array(
					Schema.object({
						q: Schema.string().min(1, true),
						a: Schema.string().min(1, true),
					}),
				)
					.min(2)
					.max(10),
			}),
		}),
	})

	static async find(req: Request) {
		const hasAccess = await canAccessCoursable(Coursable.quiz, req.params.quizId, req.authUser!, req.query.access)
		if (!hasAccess) throw new NotAuthorizedError('cannot access the questions for this quiz')
		const question = await QuestionsUseCases.find(req.params.id)
		if (!question || question.quizId !== req.params.quizId) return null
		return question
	}

	static async get(req: Request) {
		const hasAccess = await canAccessCoursable(Coursable.quiz, req.params.quizId, req.authUser!, req.query.access)
		if (!hasAccess) throw new NotAuthorizedError('cannot access the questions for this quiz')
		const query = req.query as QueryParams
		query.auth = [{ field: 'quizId', value: req.params.quizId }]
		return await QuestionsUseCases.get(query)
	}

	static async update(req: Request) {
		const uploadedMedia = req.body.questionMedia?.at(0) ?? null
		const changedMedia = !!uploadedMedia || req.body.photo === null

		const { questionMedia: _, ...rest } = validate(this.schema(req.body ?? {}), {
			...req.body,
			questionMedia: uploadedMedia,
		})

		const media = uploadedMedia ? await UploaderUseCases.upload('study/questions', uploadedMedia) : undefined

		const updatedQuestion = await QuestionsUseCases.update({
			quizId: req.params.quizId,
			id: req.params.id,
			userId: req.authUser!.id,
			data: {
				...rest,
				...(changedMedia ? { questionMedia: media } : {}),
			},
		})
		if (updatedQuestion) return updatedQuestion
		throw new NotAuthorizedError()
	}

	static async create(req: Request) {
		const data = validate(
			{
				...this.schema(req.body),
				quizId: Schema.string().min(1),
			},
			{ ...req.body, quizId: req.params.quizId, questionMedia: req.body.photo?.at(0) ?? null },
		)

		const hasAccess = await canAccessCoursable(Coursable.quiz, req.params.quizId, req.authUser!)
		if (!hasAccess) throw new NotAuthorizedError()

		const questionMedia = data.questionMedia ? await UploaderUseCases.upload('study/questions', data.questionMedia) : null

		return await QuestionsUseCases.add({ ...data, questionMedia, userId: hasAccess.user.id, quizId: hasAccess.id })
	}

	static async delete(req: Request) {
		const isDeleted = await QuestionsUseCases.delete({ quizId: req.params.quizId, id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
