import { BadRequestError, DelayedJobs } from 'equipped'
import { ClientSession } from 'mongodb'
import { IWalletRepository } from '../../domain/irepositories/wallets'
import {
	AccountDetails,
	Currencies,
	PlanDataType,
	Subscription,
	SubscriptionModel,
	TransactionStatus,
	TransactionType,
	TransferData,
	WithdrawData,
	WithdrawalStatus,
} from '../../domain/types'
import { WalletMapper } from '../mappers/wallets'
import { TransactionToModel } from '../models/transactions'
import { Transaction } from '../mongooseModels/transactions'
import { Wallet } from '../mongooseModels/wallets'
import { WithdrawalToModel } from '../models/withdrawals'
import { Withdrawal } from '../mongooseModels/withdrawals'
import { WalletFromModel } from '../models/wallets'
import { appInstance } from '@utils/types'

export class WalletRepository implements IWalletRepository {
	private static instance: WalletRepository
	private mapper: WalletMapper

	private constructor() {
		this.mapper = new WalletMapper()
	}

	static getInstance() {
		if (!WalletRepository.instance) WalletRepository.instance = new WalletRepository()
		return WalletRepository.instance
	}

	private static async getUserWallet(userId: string, session?: ClientSession) {
		const wallet = await Wallet.findOneAndUpdate(
			{ userId },
			{ $setOnInsert: { userId } },
			{ upsert: true, new: true, ...(session ? { session } : {}) },
		)
		return wallet!
	}

	async get(userId: string) {
		const wallet = await WalletRepository.getUserWallet(userId)
		return this.mapper.mapFrom(wallet)!
	}

	async updateAmount(userId: string, amount: number) {
		let res = false
		await Wallet.collection.conn.transaction(async (session) => {
			const wallet = this.mapper.mapFrom(await WalletRepository.getUserWallet(userId, session))!
			const updatedBalance = wallet.balance.amount + amount
			if (updatedBalance < 0) return false
			res = !!(await Wallet.findByIdAndUpdate(wallet.id, { $inc: { 'balance.amount': amount } }, { new: true, session }))
			return res
		})
		return res
	}

	async updateSubscription(id: string, data: Partial<SubscriptionModel>) {
		data = Object.fromEntries(Object.entries(data).map(([key, val]) => [`subscription.${key}`, val]))
		const wallet = await Wallet.findByIdAndUpdate(id, { $set: data }, { new: true })
		return this.mapper.mapFrom(wallet)!
	}

	async toggleRenewSubscription(userId: string, renew: boolean) {
		let res = null as WalletFromModel | null
		await Wallet.collection.conn.transaction(async (session) => {
			const walletModel = await WalletRepository.getUserWallet(userId, session)
			const wallet = this.mapper.mapFrom(walletModel)!
			if (!wallet.subscription.current) return (res = walletModel)
			if (renew && wallet.subscription.next) return (res = walletModel)
			if (!renew && !wallet.subscription.next) return (res = walletModel)

			const { id, expiredAt: renewedAt, jobId } = wallet.subscription.current
			if (renew && renewedAt <= Date.now()) return (res = walletModel)
			if (!renew && jobId) await appInstance.job.removeDelayedJob(jobId)

			const data = renew
				? {
					'subscription.current.jobId': await appInstance.job.addDelayedJob(
						{ type: DelayedJobs.RenewSubscription, data: { userId } },
						renewedAt - Date.now(),
					),
					'subscription.next': { id, renewedAt },
				}
				: {
					'subscription.current.jobId': null,
					'subscription.next': null,
				}
			const updatedWallet = await Wallet.findByIdAndUpdate(wallet.id, { $set: data }, { session, new: true })
			return (res = updatedWallet)
		})
		return this.mapper.mapFrom(res)!
	}

	async updateSubscriptionData(userId: string, key: PlanDataType, value: number) {
		let wallet = await WalletRepository.getUserWallet(userId)
		wallet = (await Wallet.findByIdAndUpdate(wallet._id, { $inc: { [`subscription.data.${key}`]: value } }, { new: true }))!
		return this.mapper.mapFrom(wallet)!
	}

	async updateAccounts(userId: string, accounts: AccountDetails[]) {
		let wallet = await WalletRepository.getUserWallet(userId)
		wallet = (await Wallet.findByIdAndUpdate(wallet._id, { $set: { accounts } }, { new: true }))!
		return this.mapper.mapFrom(wallet)!
	}

	async transfer(data: TransferData) {
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
					data: { type: TransactionType.sent, note: data.note, to: data.to },
				},
				{
					userId: data.to,
					email: data.toEmail,
					title: 'You received money',
					amount: data.amount,
					currency: fromWallet.balance.currency,
					status: TransactionStatus.settled,
					data: { type: TransactionType.received, note: data.note, from: data.from },
				},
			]
			await Transaction.insertMany(transactions, { session })
			const updatedFromWallet = await Wallet.findByIdAndUpdate(
				fromWallet.id,
				{ $inc: { 'balance.amount': 0 - data.amount } },
				{ new: true, session },
			)
			const updatedToWallet = await Wallet.findByIdAndUpdate(
				toWallet.id,
				{ $inc: { 'balance.amount': data.amount } },
				{ new: true, session },
			)
			res = !!updatedFromWallet && !!updatedToWallet
			return res
		})
		return res
	}

	async withdraw(data: WithdrawData) {
		let res = false
		await Wallet.collection.conn.transaction(async (session) => {
			const wallet = this.mapper.mapFrom(await WalletRepository.getUserWallet(data.userId, session))!
			const fee = WithdrawalFees[wallet.balance.currency] ?? WithdrawalFees[Currencies.NGN]
			const deductingAmount = data.amount + fee
			const updatedBalance = wallet.balance.amount - deductingAmount
			if (updatedBalance < 0) throw new BadRequestError('insufficient balance')
			const withdrawalModel: WithdrawalToModel = {
				userId: data.userId,
				email: data.email,
				amount: data.amount,
				account: data.account,
				fee,
				currency: wallet.balance.currency,
				status: WithdrawalStatus.created,
				externalId: null,
			}
			const withdrawal = await new Withdrawal(withdrawalModel).save({ session })
			const transaction: TransactionToModel = {
				userId: data.userId,
				email: data.email,
				title: 'You withdrew money',
				amount: 0 - deductingAmount,
				currency: wallet.balance.currency,
				status: TransactionStatus.settled,
				data: { type: TransactionType.withdrawal, withdrawalId: withdrawal._id },
			}
			await new Transaction(transaction).save({ session })
			const updatedWallet = await Wallet.findByIdAndUpdate(
				wallet.id,
				{ $inc: { 'balance.amount': transaction.amount } },
				{ new: true, session },
			)
			res = !!updatedWallet
			return res
		})
		return res
	}

	async updateMembersDays(data: Record<string, number>) {
		let res = false
		const now = Date.now()
		await Wallet.collection.conn.transaction(async (session) => {
			const entries = Object.entries(data)
			const bulk = Wallet.collection.initializeUnorderedBulkOp()
			for (const [userId, days] of entries) {
				bulk.find({ userId })
					.upsert()
					.updateOne({
						$inc: { 'subscription.data.membersDays': days },
						$setOnInsert: { userId, createdAt: now, updatedAt: now },
					})
			}
			const result = await bulk.execute({ session })
			res = result.modifiedCount === entries.length
			return res
		})
		return res
	}

	async updateSubscriptions(id: string, subscription: Subscription) {
		let res = null as WalletFromModel | null
		await Wallet.collection.conn.transaction(async (session) => {
			const wallet = this.mapper.mapFrom(await Wallet.findById(id, {}, { session }))!
			const sub = wallet.getSubscription(subscription.data)
			const subscriptions = [...wallet.subscriptions]
			const index = sub ? subscriptions.indexOf(sub) : -1
			if (index === -1) subscriptions.push(subscription)
			else subscriptions[index] = subscription
			const updatedWallet = await Wallet.findByIdAndUpdate(wallet.id, { $set: { subscriptions } }, { new: true, session })
			res = updatedWallet
			return res
		})
		return this.mapper.mapFrom(res)!
	}
}

const WithdrawalFees = {
	[Currencies.NGN]: 50,
}
