import {
	CurrencyCountries,
	FlutterwavePayment,
	MethodsUseCases,
	Subscriptions,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	WalletsUseCases,
} from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, Request, Schema, validate, ValidationError } from 'equipped'

export class WalletsController {
	static async get(req: Request) {
		return await WalletsUseCases.get(req.authUser!.id)
	}

	static async subscribeToPlan(req: Request) {
		const { planId } = validate(
			{
				planId: Schema.string().min(1),
			},
			req.body,
		)
		return await Subscriptions.createPlan(req.authUser!.id, planId)
	}

	static async toggleRenewSubscription(req: Request) {
		const { renew } = validate({ renew: Schema.boolean() }, req.body)
		return await WalletsUseCases.toggleRenewSubscription({ userId: req.authUser!.id, renew })
	}

	static async transfer(req: Request) {
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
	}

	static async getBanks(req: Request) {
		let country = req.params.country as any
		country = Object.values(CurrencyCountries).includes(country) ? country : CurrencyCountries.NG
		return await FlutterwavePayment.getBanks(country)
	}

	static async updateAccount(req: Request) {
		const { accounts } = validate(
			{
				accounts: Schema.array(
					Schema.object({
						country: Schema.in(Object.values(CurrencyCountries)),
						bankNumber: Schema.force.string().min(1).trim(),
						bankCode: Schema.force.string().min(1).trim(),
					}),
				),
			},
			req.body,
		)
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
	}

	static async verifyAccount(req: Request) {
		const { country, bankCode, bankNumber } = validate(
			{
				country: Schema.in(Object.values(CurrencyCountries)),
				bankNumber: Schema.force.string().min(1).trim(),
				bankCode: Schema.force.string().min(1).trim(),
			},
			req.body,
		)
		const banks = await FlutterwavePayment.getBanks(country)
		const bank = banks.find((b) => b.code === bankCode)
		if (!bank) throw new ValidationError([{ field: 'bankCode', messages: ['is not a supported bank'] }])
		return await FlutterwavePayment.verifyAccount({ bankNumber, bankCode })
	}

	static async fund(req: Request) {
		const { amount, methodId } = validate(
			{
				amount: Schema.number().gte(100),
				methodId: Schema.string().min(1),
			},
			req.body,
		)

		const userId = req.authUser!.id
		const method = await MethodsUseCases.find(methodId)
		if (!method || method.userId !== userId) throw new BadRequestError('invalid method')

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
	}

	static async withdraw(req: Request) {
		const { amount, account } = validate(
			{
				amount: Schema.number().gte(1000),
				account: Schema.object({
					country: Schema.in(Object.values(CurrencyCountries)),
					bankNumber: Schema.force.string().min(1).trim(),
					bankCode: Schema.force.string().min(1).trim(),
				}),
			},
			req.body,
		)

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
	}
}
