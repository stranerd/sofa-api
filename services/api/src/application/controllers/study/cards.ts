import { TagsUseCases } from '@modules/interactions'
import { Currencies } from '@modules/payment'
import { CardsUseCases, DraftStatus } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class CardController {
	static async find (req: Request) {
		return await CardsUseCases.find(req.params.id)
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await CardsUseCases.get(query)
	}

	static async update (req: Request) {
		const data = validateReq({
			title: Schema.string().min(1),
			set: Schema.array(Schema.object({
				question: Schema.string().min(1),
				answer: Schema.string().min(1)
			})).min(1).max(128)
		}, req.body)

		const authUserId = req.authUser!.id

		const updatedCard = await CardsUseCases.update({ id: req.params.id, userId: authUserId, data })
		if (updatedCard) return updatedCard
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const data = validateReq({
			title: Schema.string().min(1),
			set: Schema.array(Schema.object({
				question: Schema.string().min(1),
				answer: Schema.string().min(1)
			})).min(1).max(128),
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
		return await CardsUseCases.add({
			...data, user: user.getEmbedded(),
			status: DraftStatus.draft
		})
	}

	static async delete (req: Request) {
		const authUserId = req.authUser!.id
		const isDeleted = await CardsUseCases.delete({ id: req.params.id, userId: authUserId })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async saveMatch (req: Request) {
		const data = validateReq({
			time: Schema.number().gt(0)
		}, req.body)

		return await CardsUseCases.saveMatch({
			userId: req.authUser!.id,
			cardId: req.params.id,
			time: data.time
		})
	}

	static async updatePrice (req: Request) {
		const data = validateReq({
			price: Schema.object({
				amount: Schema.number().gte(0),
				currency: Schema.any<Currencies>().in(Object.values(Currencies))
			})
		}, req.body)

		const authUserId = req.authUser!.id

		const updatedCard = await CardsUseCases.updatePrice({ id: req.params.id, userId: authUserId, price: data.price })
		if (updatedCard) return updatedCard
		throw new NotAuthorizedError()
	}

	static async publish (req: Request) {
		const authUserId = req.authUser!.id

		const updatedCard = await CardsUseCases.publish({ id: req.params.id, userId: authUserId })
		if (updatedCard) return updatedCard
		throw new NotAuthorizedError()
	}
}