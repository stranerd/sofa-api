import { BaseEntity } from 'equipped'
import { AccountDetails, Currencies, PlanDataType, SubscriptionModel } from '../types'

export class WalletEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly balance: { amount: number, currency: Currencies }
	public readonly accounts: AccountDetails[]
	public readonly subscription: SubscriptionModel
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, userId, balance, accounts, subscription, createdAt, updatedAt
	}: WalletConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.balance = balance
		this.accounts = accounts
		this.subscription = subscription
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	canAddTutorToConversation () {
		return this.subscription.data[PlanDataType.tutorAidedConversations] > 0
	}
}

type WalletConstructorArgs = {
	id: string
	userId: string
	balance: { amount: number, currency: Currencies }
	accounts: AccountDetails[]
	subscription: SubscriptionModel
	createdAt: number
	updatedAt: number
}