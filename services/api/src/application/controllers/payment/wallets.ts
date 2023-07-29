import { cancelSubscription, CurrencyCountries, FlutterwavePayment, MethodsUseCases, subscribeToPlan, TransactionStatus, TransactionsUseCases, TransactionType, WalletsUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, Request, Schema, validate, ValidationError } from 'equipped'

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

	static async getBanks (req: Request) {
		let country = req.params.country as any
		country = Object.values(CurrencyCountries).includes(country) ? country : CurrencyCountries.NG
		const banks = await FlutterwavePayment.getBanks(country)
		return banks.sort((a, b) => a.name < b.name ? -1 : 1)
	}

	static async updateAccount (req: Request) {
		const { country, bankCode, bankNumber } = validate({
			country: Schema.in(Object.values(CurrencyCountries)),
			bankNumber: Schema.string().min(1),
			bankCode: Schema.string().min(1)
		}, req.body)
		const banks = await FlutterwavePayment.getBanks(country)
		const bank = banks.find((b) => b.code === bankCode)
		if (!bank) throw new ValidationError([{ field: 'bankCode', messages: ['is not a supported bank'] }])
		const verified = await FlutterwavePayment.verifyAccount({ bankNumber, bankCode })
		if (!verified) throw new BadRequestError('failed to verify account number')
		return await WalletsUseCases.updateAccount({
			userId: req.authUser!.id,
			account: { country, bankNumber, bankCode: bank.code, bankName: bank.name }
		})
	}

	static async fund (req: Request) {
		const { amount, methodId } = validate({
			amount: Schema.number().gte(100),
			methodId: Schema.string().default(''),
		}, req.body)

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
			data: { type: TransactionType.fundWallet }
		})

		const successful = await FlutterwavePayment.chargeCard({
			email: transaction.email, amount: Math.abs(transaction.amount), currency: transaction.currency,
			token: method.token, id: transaction.id
		})

		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed }
		})

		return successful
	}
}