import { isAuthenticated } from '@application/middlewares'
import {
	TransactionEntity,
	TransactionStatus,
	TransactionType,
	TransactionsUseCases,
	WalletsUseCases,
	fulfillTransaction,
} from '@modules/payment'
import { flutterwaveConfig } from '@utils/environment'
import { ApiDef, BadRequestError, NotAuthorizedError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/transactions', groups: ['Transactions'] })

router.get<PaymentTransactionsFlutterwaveSecretsRouteDef>({
	path: '/flutterwave/secrets',
	key: 'payment-transactions-flutterwave-secrets',
})(async () => ({ publicKey: flutterwaveConfig.publicKey }))

router.get<PaymentTransactionsGetRouteDef>({ path: '/', key: 'payment-transactions-get', middlewares: [isAuthenticated] })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'userId', value: req.authUser!.id }]
	return await TransactionsUseCases.get(query)
})

router.get<PaymentTransactionsFindRouteDef>({ path: '/:id', key: 'payment-transactions-find', middlewares: [isAuthenticated] })(
	async (req) => {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction || transaction.userId !== req.authUser!.id) return null
		return transaction
	},
)

router.post<PaymentTransactionsCreateRouteDef>({ path: '/', key: 'payment-transactions-create', middlewares: [isAuthenticated] })(
	async (req) => {
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
	},
)

router.put<PaymentTransactionsFulfillRouteDef>({
	path: '/:id/fulfill',
	key: 'payment-transactions-fulfill',
	middlewares: [isAuthenticated],
})(async (req) => {
	const transaction = await TransactionsUseCases.find(req.params.id)
	if (!transaction || transaction.userId !== req.authUser!.id || transaction.status !== TransactionStatus.initialized)
		throw new NotAuthorizedError()
	const successful = await fulfillTransaction(transaction)
	if (!successful) throw new BadRequestError('transaction unsuccessful')
	return successful
})

export default router

type PaymentTransactionsFlutterwaveSecretsRouteDef = ApiDef<{
	key: 'payment-transactions-flutterwave-secrets'
	method: 'get'
	response: { publicKey: string }
}>

type PaymentTransactionsGetRouteDef = ApiDef<{
	key: 'payment-transactions-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<TransactionEntity>
}>

type PaymentTransactionsFindRouteDef = ApiDef<{
	key: 'payment-transactions-find'
	method: 'get'
	params: { id: string }
	response: TransactionEntity | null
}>

type PaymentTransactionsCreateRouteDef = ApiDef<{
	key: 'payment-transactions-create'
	method: 'post'
	body:
		| {
				amount: number
				data: { type: TransactionType.fundWallet }
		  }
		| { data: { type: TransactionType.newCard } }
	response: TransactionEntity
}>

type PaymentTransactionsFulfillRouteDef = ApiDef<{
	key: 'payment-transactions-fulfill'
	method: 'put'
	params: { id: string }
	response: boolean
}>
