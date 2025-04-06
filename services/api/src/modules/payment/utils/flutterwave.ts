import a from 'axios'

import { flutterwaveConfig } from '@utils/environment'
import { appInstance } from '@utils/types'

import type { MethodToModel } from '../data/models/methods'
import type { Currencies, CurrencyCountries } from '../domain/types'
import { MethodType } from '../domain/types'

const axios = a.create({
	baseURL: 'https://api.flutterwave.com/v3',
	headers: { Authorization: flutterwaveConfig.secretKey },
})

type FwTransaction = {
	id: number
	tx_ref: string
	amount: number
	currency: string
	status: 'successful' | 'failed'
	created_at: string
	card?: {
		first_6digits: string
		last_4digits: string
		country: string
		type: string
		token: string
		expiry: string
	}
	customer: {
		id: number
		email: string
	}
}

type TransferRate = {
	rate: number
	source: { currency: Currencies; amount: number }
	destination: { currency: Currencies; amount: number }
}

type Bank = {
	id: number
	code: string
	name: string
}

export class FlutterwavePayment {
	private static async verifyById(transactionId: string) {
		const res = await axios.get(`/transactions/verify_by_reference?tx_ref=${transactionId}`).catch(() => null)
		if (!res) return null
		if (res.data.status !== 'success') return null
		return res.data.data as FwTransaction | null
	}

	static async verify(transactionId: string, amount: number, currency: Currencies) {
		const transaction = await this.verifyById(transactionId)
		if (!transaction) return false
		if (transaction.currency !== currency || transaction.amount !== Math.abs(amount)) return false
		return transaction.status === 'successful'
	}

	static async saveCard(userId: string, transactionId: string): Promise<MethodToModel | null> {
		const transaction = await this.verifyById(transactionId)
		if (!transaction || !transaction.card) return null
		const [month, year] = transaction.card.expiry.split('/').map((x) => parseInt(x))
		const expireTime = new Date(2000 + year, month).getTime()
		return {
			userId,
			token: transaction.card.token,
			data: {
				type: MethodType.card,
				last4Digits: transaction.card.last_4digits,
				country: transaction.card.country,
				cardType: transaction.card.type,
				expiredAt: expireTime,
				expired: expireTime <= Date.now(),
			},
		}
	}

	static async convertAmount(amount: number, from: Currencies, to: Currencies) {
		if (from === to) return amount
		// flutterwave expects 1000 USD to NGN to have destination as USD and source as NGN, weird right
		const res = await axios
			.get(`/transfers/rates?amount=${amount}&destination_currency=${from}&source_currency=${to}`)
			.catch(() => null)
		// TODO: figure whether to throw, and consequences of throwing in background process
		const data = res?.data?.data as TransferRate | undefined
		return data?.source.amount ?? amount
	}

	static async chargeCard(data: { token: string; currency: Currencies; amount: number; email: string; id: string }) {
		const res = await axios
			.post('/tokenized-charges', {
				token: data.token,
				currency: data.currency,
				amount: Math.abs(data.amount),
				email: data.email,
				tx_ref: data.id,
			})
			.catch(() => null)
		return (res?.data?.data as FwTransaction | null)?.status === 'successful'
	}

	static async getBanks(country: CurrencyCountries) {
		const key = `flutterwave-banks-${country}`
		const cachedBanks = await appInstance.cache.get(key)
		if (cachedBanks) return JSON.parse(cachedBanks) as Bank[]
		const res = await axios.get(`/banks/${country}`).catch(() => null)
		const banks = (res?.data?.data as Bank[]) ?? []
		await appInstance.cache.set(key, JSON.stringify(banks), 60 * 60 * 24)
		return banks
	}

	static async verifyAccount({ bankNumber, bankCode }: { bankNumber: string; bankCode: string }) {
		const res = await axios
			.post('/accounts/resolve', {
				account_number: bankNumber,
				account_bank: bankCode,
			})
			.catch(() => null)
		return (res?.data?.data?.account_name as string | undefined) ?? null
	}

	static async transfer(data: { bankCode: string; bankNumber: string; amount: number; currency: Currencies; id: string }) {
		const res = await axios
			.post('/transfers', {
				account_bank: data.bankCode,
				account_number: data.bankNumber,
				currency: data.currency,
				amount: data.amount,
				reference: data.id,
			})
			.catch(() => null)
		return (res?.data?.data?.id ?? null) as number | null
	}

	static async verifyTransferStatus(transferId: number) {
		const res = await axios.get(`/transfers/${transferId}`).catch(() => null)
		const status = res?.data?.data?.status
		if (!status) return null
		if (status === 'SUCCESSFUL') return 'successful'
		if (status === 'PENDING' || status === 'NEW') return 'pending'
		if (status === 'FAILED') return 'failed'
		return null
	}
}
