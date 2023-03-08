import { WalletEntity } from '../entities/wallets'
import { AccountDetails, PlanDataType, SubscriptionModel } from '../types'

export interface IWalletRepository {
	get: (userId: string) => Promise<WalletEntity>
	updateAmount: (userId: string, amount: number) => Promise<boolean>
	updateSubscription: (id: string, data: Partial<SubscriptionModel>) => Promise<WalletEntity>
	updateSubscriptionData: (userId: string, key: PlanDataType, value: number) => Promise<WalletEntity>
	updateAccount: (userId: string, account: AccountDetails) => Promise<WalletEntity>
}
