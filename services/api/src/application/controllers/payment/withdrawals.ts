import { WithdrawalsUseCases } from '@modules/payment'
import { NotAuthorizedError, QueryParams, Request } from 'equipped'

export class WithdrawalsController {
	static async find (req: Request) {
		const withdrawal = await WithdrawalsUseCases.find(req.params.id)
		if (!withdrawal || withdrawal.userId !== req.authUser!.id) return null
		return withdrawal
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await WithdrawalsUseCases.get(query)
	}

	static async delete (req: Request) {
		const isDeleted = await WithdrawalsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}