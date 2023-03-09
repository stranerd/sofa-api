import { cancelSubscription, subscribeToPlan, WalletsUseCases } from '@modules/payment'
import { Request, Schema, validateReq } from 'equipped'

export class WalletsController {
	static async get (req: Request) {
		return await WalletsUseCases.get(req.authUser!.id)
	}

	static async subscribeToPlan (req: Request) {
		const { planId } = validateReq({
			planId: Schema.string().min(1)
		}, req.body)
		return await subscribeToPlan(req.authUser!.id, planId)
	}

	static async cancelSubscription (req: Request) {
		return await cancelSubscription(req.authUser!.id)
	}
}