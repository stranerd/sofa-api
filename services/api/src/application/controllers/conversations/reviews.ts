import { ReviewsUseCases } from '@modules/conversations'
import { QueryParams, Request } from 'equipped'

export class ReviewsController {
	static async get (req: Request) {
		const query = req.query as QueryParams
		return await ReviewsUseCases.get(query)
	}

	static async find (req: Request) {
		return await ReviewsUseCases.find(req.params.id)
	}
}