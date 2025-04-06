import type { AccountDetails, Currencies, Subscription, SubscriptionModel } from '../../domain/types'

export interface WalletFromModel extends WalletToModel {
	_id: string
	balance: { amount: number; currency: Currencies }
	accounts: AccountDetails[]
	subscription: SubscriptionModel
	subscriptions: Subscription[]
	createdAt: number
	updatedAt: number
}

export interface WalletToModel {
	userId: string
}
