import { AccountDetails, Currencies, SubscriptionModel } from '../../domain/types'

export interface WalletFromModel extends WalletToModel {
	_id: string
	balance: { amount: number, currency: Currencies }
	account: AccountDetails | null
	subscription: SubscriptionModel
	createdAt: number
	updatedAt: number
}

export interface WalletToModel {
	userId: string
}