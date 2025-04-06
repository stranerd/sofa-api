import type { QueryParams, Request } from 'equipped'

import { PlansUseCases } from '@modules/payment'

export class PlansController {
	static async find(req: Request) {
		return await PlansUseCases.find(req.params.id)
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		query.sort ??= []
		query.sort.push({ field: 'amount', desc: false })
		return await PlansUseCases.get(query)
	}
}
