import { cancelSubscription, subscribeToPlan, WalletsUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, Request, Schema, validate } from 'equipped'

export class WalletsController {
	static async get (req: Request) {
		return await WalletsUseCases.get(req.authUser!.id)
	}

	static async subscribeToPlan (req: Request) {
		const { planId } = validate({
			planId: Schema.string().min(1)
		}, req.body)
		return await subscribeToPlan(req.authUser!.id, planId)
	}

	static async cancelSubscription (req: Request) {
		return await cancelSubscription(req.authUser!.id)
	}

	static async transfer (req: Request) {
		const authUser = req.authUser!

		const { amount, to, note } = validate({
			amount: Schema.number().gt(0),
			to: Schema.string().min(1),
			note: Schema.string(),
		}, req.body)

		if (to === authUser.id) throw new BadRequestError('cannot transfer to yourself')
		const user = await UsersUseCases.find(to)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		return await WalletsUseCases.transfer({
			from: authUser.id, fromEmail: authUser.email,
			to: user.id, toEmail: user.bio.email,
			amount, note
		})
	}
}