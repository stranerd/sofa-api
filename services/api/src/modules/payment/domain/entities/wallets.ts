import { BaseEntity, CronTypes, Validation } from 'equipped'

import type { AccountDetails, Currencies, Subscription, SubscriptionModel } from '../types'
import { PlanDataType } from '../types'

export class WalletEntity extends BaseEntity<WalletConstructorArgs> {
	constructor(data: WalletConstructorArgs) {
		super(data)
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
