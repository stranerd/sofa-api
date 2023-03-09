import { cancelSubscription, CurrencyCountries, FlutterwavePayment, subscribeToPlan, WalletsUseCases } from '@modules/payment'
import { BadRequestError, Request, Schema, validateReq, ValidationError } from 'equipped'

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

	static async getBanks (req: Request) {
		let country = req.params.country as any
		country = Object.values(CurrencyCountries).includes(country) ? country : CurrencyCountries.NG
		const banks = await FlutterwavePayment.getBanks(country)
		return banks.sort((a, b) => a.name < b.name ? -1 : 1)
	}

	static async updateAccount (req: Request) {
		const { country, bankCode, number } = validateReq({
			country: Schema.any<CurrencyCountries>().in(Object.values(CurrencyCountries)),
			number: Schema.string(),
			bankCode: Schema.string()
		}, req.body)
		const banks = await FlutterwavePayment.getBanks(country)
		const bank = banks.find((b) => b.code === bankCode)
		if (!bank) throw new ValidationError([{ field: 'bankCode', messages: ['is not a supported bank'] }])
		const verified = await FlutterwavePayment.verifyAccount({ number, bankCode })
		if (!verified) throw new BadRequestError('failed to verify account number')
		return await WalletsUseCases.updateAccount({
			userId: req.authUser!.id,
			account: { country, number, bankCode: bank.code, bankName: bank.name }
		})
	}
}