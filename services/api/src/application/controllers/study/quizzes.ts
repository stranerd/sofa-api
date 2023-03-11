import { TagsUseCases } from '@modules/interactions'
import { Currencies } from '@modules/payment'
import { DraftStatus, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class QuizController {
	static async find (req: Request) {
		return await QuizzesUseCases.find(req.params.id)
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await QuizzesUseCases.get(query)
	}

	static async update (req: Request) {
		const data = validateReq({
			title: Schema.string().min(1),
			price: Schema.object({
				amount: Schema.number().gte(0).default(0),
				currency: Schema.any<Currencies>().in(Object.values(Currencies)).default(Currencies.NGN)
			})
		}, req.body)

		const authUserId = req.authUser!.id

		const updatedQuiz = await QuizzesUseCases.update({ id: req.params.id, userId: authUserId, data })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const data = validateReq({
			title: Schema.string().min(1),
			tagId: Schema.string().min(1),
			price: Schema.object({
				amount: Schema.number().gte(0).default(0),
				currency: Schema.any<Currencies>().in(Object.values(Currencies)).default(Currencies.NGN)
			})
		}, req.body)

		const tag = await TagsUseCases.find(data.tagId)
		if (!tag) throw new BadRequestError('tag not found')

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')
		return await QuizzesUseCases.add({
			...data, user: user.getEmbedded(),
			status: DraftStatus.draft
		})
	}

	static async delete (req: Request) {
		const authUserId = req.authUser!.id
		const isDeleted = await QuizzesUseCases.delete({ id: req.params.id, userId: authUserId })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async publish (req: Request) {
		const authUserId = req.authUser!.id

		const updatedQuiz = await QuizzesUseCases.publish({ id: req.params.id, userId: authUserId })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}

	static async freeze (req: Request) {
		const authUserId = req.authUser!.id

		const updatedQuiz = await QuizzesUseCases.freeze({ id: req.params.id, userId: authUserId })
		if (updatedQuiz) return updatedQuiz
		throw new NotAuthorizedError()
	}
}