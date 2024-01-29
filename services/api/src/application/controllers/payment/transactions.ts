import { fulfillTransaction, TransactionStatus, TransactionsUseCases, TransactionType, WalletsUseCases } from '@modules/payment'
import { flutterwaveConfig } from '@utils/environment'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class TransactionsController {
	static async getSecrets(_: Request) {
		return { publicKey: flutterwaveConfig.publicKey }
	}

	static async find(req: Request) {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction || transaction.userId !== req.authUser!.id) return null
		return transaction
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await TransactionsUseCases.get(query)
	}

	static async create(req: Request) {
		const isNewCardType = req.body.data?.type === TransactionType.newCard
		const isFundWallet = req.body.data?.type === TransactionType.fundWallet
		const types = [TransactionType.newCard, TransactionType.fundWallet] as const
		const authUser = req.authUser!

		const {
			amount,
			data: { type },
		} = validate(
			{
				amount: Schema.number()
					.gte(100)
					.requiredIf(() => isFundWallet),
				data: Schema.object({
					type: Schema.in(types),
				}),
			},
			req.body,
		)

		const dynamics = { title: '', amount: amount ?? 0 }

		if (isNewCardType) {
			dynamics.title = 'Test charge on new card'
			dynamics.amount = 10
		}

		if (isFundWallet) {
			dynamics.title = 'Fund wallet'
			dynamics.amount = amount!
		}

		const wallet = await WalletsUseCases.get(authUser.id)

		return await TransactionsUseCases.create({
			...dynamics,
			currency: wallet.balance.currency,
			userId: authUser.id,
			email: authUser.email,
			status: TransactionStatus.initialized,
			data: { type },
		})
	}

	static async fulfill(req: Request) {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction || transaction.userId !== req.authUser!.id || transaction.status !== TransactionStatus.initialized)
			throw new NotAuthorizedError()
		const successful = await fulfillTransaction(transaction)
		if (!successful) throw new BadRequestError('transaction unsuccessful')
		return successful
	}
}
