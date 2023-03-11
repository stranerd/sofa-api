import { UploaderUseCases } from '@modules/storage'
import { canAccessQuiz, QuestionsUseCases, QuizzesUseCases } from '@modules/study'
import { BadRequestError, NotAuthorizedError, Request, Schema, validateReq } from 'equipped'

export class QuestionController {
	private static schema = () => ({
		question: Schema.string().min(1),
		questionMedia: Schema.or([Schema.file().image(), Schema.file().audio(), Schema.file().video()]).nullable()
	})

	static async find (req: Request) {
		const hasAccess = await canAccessQuiz(req.params.quizId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError('cannot access the questions for this quiz')
		const question = await QuestionsUseCases.find(req.params.id)
		if (!question || question.quizId !== req.params.quizId) return null
		return question
	}

	static async get (req: Request) {
		const hasAccess = await canAccessQuiz(req.params.quizId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError('cannot access the questions for this quiz')
		return await QuestionsUseCases.get({
			where: [{ field: 'quizId', value: req.params.quizId }],
			all: true
		})
	}

	static async update (req: Request) {
		const uploadedMedia = req.files.questionMedia?.[0] ?? null
		const changedMedia = !!uploadedMedia || req.body.photo === null

		const { question } = validateReq(this.schema(), { ...req.body, questionMedia: uploadedMedia })

		const media = uploadedMedia ? await UploaderUseCases.upload('study/questions', uploadedMedia) : undefined

		const updatedQuestion = await QuestionsUseCases.update({
			quizId: req.params.quizId, id: req.params.id, userId: req.authUser!.id,
			data: {
				question,
				...(changedMedia ? { questionMedia: media } : {})
			}
		})
		if (updatedQuestion) return updatedQuestion
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const data = validateReq({
			...this.schema(),
			quizId: Schema.string().min(1)
		}, { ...req.body, quizId: req.params.quizId, questionMedia: req.files.photo?.[0] ?? null })

		const quiz = await QuizzesUseCases.find(data.quizId)
		if (!quiz) throw new BadRequestError('quiz not found')
		if (quiz.user.id !== req.authUser!.id) throw new NotAuthorizedError()

		const questionMedia = data.questionMedia ? await UploaderUseCases.upload('study/questions', data.questionMedia) : null

		return await QuestionsUseCases.add({ ...data, questionMedia, userId: quiz.user.id, quizId: quiz.id })
	}

	static async delete (req: Request) {
		const isDeleted = await QuestionsUseCases.delete({ quizId: req.params.quizId, id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}