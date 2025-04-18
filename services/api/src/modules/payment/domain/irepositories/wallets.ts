import type { WalletEntity } from '../entities/wallets'
import type { AccountDetails, Currencies, PlanDataType, Subscription, SubscriptionModel, TransferData, WithdrawData } from '../types'

export interface IWalletRepository {
	get: (userId: string) => Promise<WalletEntity>
	updateAmount: (userId: string, amount: number, currency: Currencies) => Promise<boolean>
	updateSubscription: (id: string, data: Partial<SubscriptionModel>) => Promise<WalletEntity>
	toggleRenewSubscription: (userId: string, renew: boolean) => Promise<WalletEntity>
	updateSubscriptionData: (userId: string, key: PlanDataType, value: number) => Promise<WalletEntity>
	updateAccounts: (userId: string, account: AccountDetails[]) => Promise<WalletEntity>
	transfer: (data: TransferData) => Promise<boolean>
	withdraw: (data: WithdrawData) => Promise<boolean>
	updateMembersDays: (data: Record<string, number>) => Promise<boolean>
	updateSubscriptions: (id: string, subscription: Subscription) => Promise<WalletEntity>
}
