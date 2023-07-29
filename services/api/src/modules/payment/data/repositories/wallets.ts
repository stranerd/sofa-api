import { BadRequestError } from 'equipped'
import { IWalletRepository } from '../../domain/irepositories/wallets'
import { AccountDetails, PlanDataType, SubscriptionModel, TransactionStatus, TransactionType, TransferData } from '../../domain/types'
import { WalletMapper } from '../mappers/wallets'
import { TransactionToModel } from '../models/transactions'
import { Transaction } from '../mongooseModels/transactions'
import { Wallet } from '../mongooseModels/wallets'

export class WalletRepository implements IWalletRepository {
	private static instance: WalletRepository
	private mapper: WalletMapper

	private constructor () {
		this.mapper = new WalletMapper()
	}

	static getInstance () {
		if (!WalletRepository.instance) WalletRepository.instance = new WalletRepository()
		return WalletRepository.instance
	}

	private static async getUserWallet (userId: string, session?: any) {
		const wallet = await Wallet.findOneAndUpdate(
			{ userId },
			{ $setOnInsert: { userId } },
			{ upsert: true, new: true, ...(session ? { session } : {}) })
		return wallet!
	}

	async get (userId: string) {
		const wallet = await WalletRepository.getUserWallet(userId)
		return this.mapper.mapFrom(wallet)!
	}

	async updateAmount (userId: string, amount: number) {
		let res = false
		await Wallet.collection.conn.transaction(async (session) => {
			const wallet = this.mapper.mapFrom(await WalletRepository.getUserWallet(userId, session))!
			const updatedBalance = wallet.balance.amount + amount
			if (updatedBalance < 0) return false
			res = !!(await Wallet.findByIdAndUpdate(wallet.id,
				{ $inc: { 'balance.amount': amount } },
				{ new: true, session }
			))
			return res
		})
		return res
	}

	async updateSubscription (id: string, data: Partial<SubscriptionModel>) {
		data = Object.fromEntries(Object.entries(data).map(([key, val]) => [`subscription.${key}`, val]))
		const wallet = await Wallet.findByIdAndUpdate(id, { $set: data }, { new: true })
		return this.mapper.mapFrom(wallet)!
	}

	async updateSubscriptionData (userId: string, key: PlanDataType, value: number) {
		let wallet = await WalletRepository.getUserWallet(userId)
		wallet = (await Wallet.findByIdAndUpdate(wallet._id, { $inc: { [`subscription.data.${key}`]: value } }, { new: true }))!
		return this.mapper.mapFrom(wallet)!
	}

	async updateAccount (userId: string, account: AccountDetails) {
		let wallet = await WalletRepository.getUserWallet(userId)
		wallet = (await Wallet.findByIdAndUpdate(wallet._id, { $set: { account } }, { new: true }))!
		return this.mapper.mapFrom(wallet)!
	}

	async transfer (data: TransferData) {
		let res = false
		await Wallet.collection.conn.transaction(async (session) => {
			const fromWallet = this.mapper.mapFrom(await WalletRepository.getUserWallet(data.from, session))!
			const toWallet = this.mapper.mapFrom(await WalletRepository.getUserWallet(data.to, session))!
			const updatedBalance = fromWallet.balance.amount - data.amount
			if (updatedBalance < 0) throw new BadRequestError('insufficient balance')
			const transactions: TransactionToModel[] = [
				{
					userId: data.from,
					email: data.fromEmail,
					title: 'You sent money',
					amount: 0 - data.amount,
					currency: fromWallet.balance.currency,
					status: TransactionStatus.settled,
					data: { type: TransactionType.sent, note: data.note, to: data.to }
				}, {
					userId: data.to,
					email: data.toEmail,
					title: 'You received money',
					amount: data.amount,
					currency: fromWallet.balance.currency,
					status: TransactionStatus.settled,
					data: { type: TransactionType.received, note: data.note, from: data.from }
				}
			]
			await Transaction.insertMany(transactions, { session })
			const updatedFromWallet =  await Wallet.findByIdAndUpdate(fromWallet.id,
				{ $inc: { 'balance.amount': 0 - data.amount } },
				{ new: true, session }
			)
			const updatedToWallet =  await Wallet.findByIdAndUpdate(toWallet.id,
				{ $inc: { 'balance.amount': data.amount } },
				{ new: true, session }
			)
			res = !!updatedFromWallet && !!updatedToWallet
			return res
		})
		return res
	}
}
