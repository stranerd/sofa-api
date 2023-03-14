import { UploaderUseCases } from '@modules/storage'
import { canAccessCoursable, Coursable, QuestionsUseCases, QuestionTypes, QuizzesUseCases } from '@modules/study'
import { NotAuthorizedError, QueryParams, Request, Schema, validate, Validation } from 'equipped'

export class QuestionController {
	private static schema = (body: Record<string, any>) => ({
		question: Schema.string().min(1).addRule((val) => {
			const value = val as string
			const types = [QuestionTypes.fillInBlanks, QuestionTypes.dragAnswers]
			if (!types.includes(body?.data?.type ?? '')) return Validation.isValid(value)
			return value.includes(body?.data?.indicator ?? '') ? Validation.isValid(value) : Validation.isInvalid(['must contain the indicator'], value)
		}),
		questionMedia: Schema.or([Schema.file().image(), Schema.file().audio(), Schema.file().video()]).nullable(),
		timeLimit: Schema.number().gt(0).lte(300).round(),
		data: Schema.or([
			Schema.object({
				type: Schema.is(QuestionTypes.multipleChoice as const),
				answers: Schema.array(Schema.string().min(1)).min(2).max(6),
				correct: Schema.array(Schema.number().gte(0).round()).min(1).set()
			}).custom((value) => {
				const length = value?.answers?.length ?? 1
				return Schema.array(Schema.number().lt(length)).max(length).parse(value.correct).valid
			}),
			Schema.object({
				type: Schema.is(QuestionTypes.trueOrFalse as const),
				answer: Schema.boolean()
			}),
			Schema.object({
				type: Schema.is(QuestionTypes.writeAnswer as const),
				answers: Schema.array(Schema.string().min(1)).min(1).max(6)
			}),
			Schema.object({
				type: Schema.in([QuestionTypes.fillInBlanks, QuestionTypes.dragAnswers] as const),
				indicator: Schema.string().min(1),
				answers: Schema.array(Schema.string().min(1)).min(1)
			}).custom((value) => {
				const length = body?.question?.split(value.indicator).length ?? 1
				return Schema.array(Schema.any()).max(length - 1).parse(value.answers).valid
			}),
			Schema.object({
				type: Schema.is(QuestionTypes.sequence as const),
				answers: Schema.array(Schema.string().min(1)).min(2).max(6)
			}),
			Schema.object({
				type: Schema.is(QuestionTypes.match as const),
				set: Schema.array(Schema.object({
					q: Schema.string().min(1),
					a: Schema.string().min(1)
				})).min(2).max(10)
			})
		])
	})

	static async find (req: Request) {
		const hasAccess = await canAccessCoursable(Coursable.quiz, req.params.quizId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError('cannot access the questions for this quiz')
		const question = await QuestionsUseCases.find(req.params.id)
		if (!question || question.quizId !== req.params.quizId) return null
		return question
	}

	static async get (req: Request) {
		const hasAccess = await canAccessCoursable(Coursable.quiz, req.params.quizId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError('cannot access the questions for this quiz')
		const query = req.query as QueryParams
		query.auth = [{ field: 'quizId', value: req.params.quizId }]
		return await QuestionsUseCases.get(query)
	}

	static async update (req: Request) {
		const uploadedMedia = req.files.questionMedia?.[0] ?? null
		const changedMedia = !!uploadedMedia || req.body.photo === null

		const { question, timeLimit, data } = validate(this.schema(req.body ?? {}), { ...req.body, questionMedia: uploadedMedia })

		const media = uploadedMedia ? await UploaderUseCases.upload('study/questions', uploadedMedia) : undefined

		const updatedQuestion = await QuestionsUseCases.update({
			quizId: req.params.quizId, id: req.params.id, userId: req.authUser!.id,
			data: {
				question, timeLimit, data,
				...(changedMedia ? { questionMedia: media } : {})
			}
		})
		if (updatedQuestion) return updatedQuestion
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const data = validate({
			...this.schema(req.body),
			quizId: Schema.string().min(1)
		}, { ...req.body, quizId: req.params.quizId, questionMedia: req.files.photo?.[0] ?? null })

		const quiz = await QuizzesUseCases.find(data.quizId)
		if (!quiz || quiz.user.id !== req.authUser!.id) throw new NotAuthorizedError()

		const questionMedia = data.questionMedia ? await UploaderUseCases.upload('study/questions', data.questionMedia) : null

		return await QuestionsUseCases.add({ ...data, questionMedia, userId: quiz.user.id, quizId: quiz.id })
	}

	static async delete (req: Request) {
		const isDeleted = await QuestionsUseCases.delete({ quizId: req.params.quizId, id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}