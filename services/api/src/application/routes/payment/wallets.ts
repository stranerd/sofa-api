import { isAuthenticated } from '@application/middlewares'
import {
	WalletEntity,
	WalletsUseCases,
	SelectedPaymentMethodSchema,
	Subscriptions,
	CurrencyCountries,
	FlutterwavePayment,
	MethodsUseCases,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	Bank,
	SelectedPaymentMethod,
} from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { ApiDef, BadRequestError, Router, Schema, ValidationError, validate } from 'equipped'

const accountSchema = () => ({
	country: Schema.in(Object.values(CurrencyCountries)),
	bankNumber: Schema.force.string().min(1).trim(),
	bankCode: Schema.force.string().min(1).trim(),
})

const router = new Router({ path: '/wallets', groups: ['Wallets'] })

router.get<PaymentWalletsGetRouteDef>({ path: '/', key: 'payment-wallets-get', middlewares: [isAuthenticated] })(
	async (req) => await WalletsUseCases.get(req.authUser!.id),
)

router.post<PaymentWalletsSubscribeToPlanRouteDef>({
	path: '/subscriptions',
	key: 'payment-wallets-subscribe-to-plan',
	middlewares: [isAuthenticated],
})(async (req) => {
	const { planId, methodId } = validate(
		{
			planId: Schema.string().min(1),
			methodId: SelectedPaymentMethodSchema,
		},
		req.body,
	)
	return await Subscriptions.createPlan(req.authUser!.id, planId, methodId)
})

router.post<PaymentWalletsRenewPlanRouteDef>({
	path: '/subscriptions/renew',
	key: 'payment-wallets-renew-plan',
	middlewares: [isAuthenticated],
})(async (req) => await Subscriptions.renewPlan(req.authUser!.id))

router.post<PaymentWalletsToggleRenewSubscriptionRouteDef>({
	path: '/subscriptions/renew/toggle',
	key: 'payment-wallets-toggle-renew-subscription',
	middlewares: [isAuthenticated],
})(async (req) => {
	const { renew } = validate({ renew: Schema.boolean() }, req.body)
	return await WalletsUseCases.toggleRenewSubscription({ userId: req.authUser!.id, renew })
})

router.post<PaymentWalletsTransferRouteDef>({ path: '/transfer', key: 'payment-wallets-transfer', middlewares: [isAuthenticated] })(
	async (req) => {
		const authUser = req.authUser!

		const { amount, to, note } = validate(
			{
				amount: Schema.number().gt(0),
				to: Schema.string().min(1),
				note: Schema.string(),
			},
			req.body,
		)

		if (to === authUser.id) throw new BadRequestError('cannot transfer to yourself')
		const user = await UsersUseCases.find(to)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		return await WalletsUseCases.transfer({
			from: authUser.id,
			fromEmail: authUser.email,
			to: user.id,
			toEmail: user.bio.email,
			amount,
			note,
		})
	},
)

const countries = Object.values(CurrencyCountries).join('|')
router.get<PaymentWalletsGetBanksRouteDef>({ path: `/account/banks/:country(${countries})`, key: 'payment-wallets-get-banks' })(
	async (req) => await FlutterwavePayment.getBanks(req.params.country),
)

router.post<PaymentWalletsUpdateAccountRouteDef>({
	path: '/account',
	key: 'payment-wallets-update-account',
	middlewares: [isAuthenticated],
})(async (req) => {
	const { accounts } = validate({ accounts: Schema.array(Schema.object(accountSchema())) }, req.body)
	const countries = [...new Set(accounts.map((a) => a.country))]
	const banksArrays = await Promise.all(
		countries.map(async (country) => ({ banks: await FlutterwavePayment.getBanks(country), country })),
	)
	const fullAccounts = await Promise.all(
		accounts.map(async (account) => {
			const banks = banksArrays.find((b) => b.country === account.country)?.banks ?? []
			const bank = banks.find((b) => b.code === account.bankCode)
			if (!bank) throw new BadRequestError(`failed to verify account number: ${account.bankNumber}`)
			const verified = await FlutterwavePayment.verifyAccount(account)
			if (!verified) throw new BadRequestError(`failed to verify account number: ${account.bankNumber}`)
			return { ...account, bankCode: bank.code, bankName: bank.name, ownerName: verified }
		}),
	)

	return await WalletsUseCases.updateAccounts({
		userId: req.authUser!.id,
		accounts: fullAccounts,
	})
})

router.post<PaymentWalletsVerifyAccountRouteDef>({ path: '/account/verify', key: 'payment-wallets-verify-account' })(async (req) => {
	const { country, bankCode, bankNumber } = validate(accountSchema(), req.body)
	const banks = await FlutterwavePayment.getBanks(country)
	const bank = banks.find((b) => b.code === bankCode)
	if (!bank) throw new ValidationError([{ field: 'bankCode', messages: ['is not a supported bank'] }])
	return await FlutterwavePayment.verifyAccount({ bankNumber, bankCode })
})

router.post<PaymentWalletsFundRouteDef>({ path: '/fund', key: 'payment-wallets-fund', middlewares: [isAuthenticated] })(async (req) => {
	const { amount, methodId } = validate(
		{
			amount: Schema.number().gte(100),
			methodId: SelectedPaymentMethodSchema,
		},
		req.body,
	)

	const userId = req.authUser!.id
	if (methodId === true) throw new BadRequestError('you cant fund your wallet from your wallet')
	const method = await MethodsUseCases.getForUser(userId, methodId)
	if (!method) throw new BadRequestError('invalid method')

	const wallet = await WalletsUseCases.get(userId)

	const transaction = await TransactionsUseCases.create({
		userId,
		email: req.authUser!.email,
		amount,
		currency: wallet.balance.currency,
		status: TransactionStatus.initialized,
		title: 'Fund wallet',
		data: { type: TransactionType.fundWallet },
	})

	const successful = await FlutterwavePayment.chargeCard({
		email: transaction.email,
		amount: transaction.amount,
		currency: transaction.currency,
		token: method.token,
		id: transaction.id,
	})

	await TransactionsUseCases.update({
		id: transaction.id,
		data: { status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed },
	})

	return successful
})

router.post<PaymentWalletsWithdrawRouteDef>({ path: '/withdraw', key: 'payment-wallets-withdraw', middlewares: [isAuthenticated] })(
	async (req) => {
		const { amount, account } = validate({ amount: Schema.number().gte(1000), account: Schema.object(accountSchema()) }, req.body)

		const banks = await FlutterwavePayment.getBanks(account.country)
		const bank = banks.find((b) => b.code === account.bankCode)
		if (!bank) throw new ValidationError([{ field: 'bankCode', messages: ['is not a supported bank'] }])
		const verified = await FlutterwavePayment.verifyAccount(account)
		if (!verified) throw new BadRequestError('failed to verify account number')

		return await WalletsUseCases.withdraw({
			userId: req.authUser!.id,
			email: req.authUser!.email,
			amount,
			account: { ...account, bankCode: bank.code, bankName: bank.name, ownerName: verified },
		})
	},
)

export default router

type PaymentWalletsGetRouteDef = ApiDef<{
	key: 'payment-wallets-get'
	method: 'get'
	response: WalletEntity
}>

type PaymentWalletsSubscribeToPlanRouteDef = ApiDef<{
	key: 'payment-wallets-subscribe-to-plan'
	method: 'post'
	body: { planId: string; methodId: SelectedPaymentMethod }
	response: WalletEntity
}>

type PaymentWalletsRenewPlanRouteDef = ApiDef<{
	key: 'payment-wallets-renew-plan'
	method: 'post'
	response: WalletEntity
}>

type PaymentWalletsToggleRenewSubscriptionRouteDef = ApiDef<{
	key: 'payment-wallets-toggle-renew-subscription'
	method: 'post'
	body: { renew: boolean }
	response: WalletEntity
}>

type PaymentWalletsTransferRouteDef = ApiDef<{
	key: 'payment-wallets-transfer'
	method: 'post'
	body: { amount: number; to: string; note: string }
	response: boolean
}>

type PaymentWalletsGetBanksRouteDef = ApiDef<{
	key: 'payment-wallets-get-banks'
	method: 'get'
	params: { country: CurrencyCountries }
	response: Bank[]
}>

type Account = { country: CurrencyCountries; bankNumber: string; bankCode: string }

type PaymentWalletsUpdateAccountRouteDef = ApiDef<{
	key: 'payment-wallets-update-account'
	method: 'post'
	body: { accounts: Account[] }
	response: WalletEntity
}>

type PaymentWalletsVerifyAccountRouteDef = ApiDef<{
	key: 'payment-wallets-verify-account'
	method: 'post'
	body: Account
	response: string | null
}>

type PaymentWalletsFundRouteDef = ApiDef<{
	key: 'payment-wallets-fund'
	method: 'post'
	body: { amount: number; methodId: SelectedPaymentMethod }
	response: boolean
}>

type PaymentWalletsWithdrawRouteDef = ApiDef<{
	key: 'payment-wallets-withdraw'
	method: 'post'
	body: { amount: number; account: Account }
	response: boolean
}>
