import { BaseEntity, CronTypes, Validation } from 'equipped'
import { AccountDetails, Currencies, PlanDataType, Subscription, SubscriptionModel } from '../types'

export class WalletEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly balance: { amount: number; currency: Currencies }
	public readonly accounts: AccountDetails[]
	public readonly subscription: SubscriptionModel
	public readonly subscriptions: Subscription[]
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, userId, balance, accounts, subscription, subscriptions, createdAt, updatedAt }: WalletConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.balance = balance
		this.accounts = accounts
		this.subscription = subscription
		this.subscriptions = subscriptions
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	canAddTutorToConversation() {
		return this.subscription.data[PlanDataType.tutorAidedConversations] > 0
	}

	getSubscription(data: Subscription['data']) {
		return this.subscriptions.find((s) => Validation.Differ.equal(s.data, data))
	}

	getNextCharge(interval: 'monthly' | 'weekly', time: number) {
		const date = new Date(time)
		if (interval === CronTypes.weekly) date.setDate(date.getDate() + 7)
		if (interval === CronTypes.monthly) date.setMonth(date.getMonth() + 1)
		return date.getTime()
	}
}

type WalletConstructorArgs = {
	id: string
	userId: string
	balance: { amount: number; currency: Currencies }
	accounts: AccountDetails[]
	subscription: SubscriptionModel
	subscriptions: Subscription[]
	createdAt: number
	updatedAt: number
}
