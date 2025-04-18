import type { IWalletRepository } from '../irepositories/wallets'
import type { AccountDetails, Currencies, PlanDataType, Subscription, SubscriptionModel, TransferData, WithdrawData } from '../types'

export class WalletsUseCase {
	repository: IWalletRepository

	constructor(repo: IWalletRepository) {
		this.repository = repo
	}

	async get(userId: string) {
		return await this.repository.get(userId)
	}

	async updateAmount(data: { userId: string; amount: number; currency: Currencies }) {
		return await this.repository.updateAmount(data.userId, data.amount, data.currency)
	}

	async updateSubscription(data: { id: string; data: Partial<SubscriptionModel> }) {
		return await this.repository.updateSubscription(data.id, data.data)
	}

	async toggleRenewSubscription(data: { userId: string; renew: boolean }) {
		return await this.repository.toggleRenewSubscription(data.userId, data.renew)
	}

	async updateSubscriptionData(data: { userId: string; key: PlanDataType; value: 1 | -1 }) {
		return await this.repository.updateSubscriptionData(data.userId, data.key, data.value)
	}

	async updateAccounts(data: { userId: string; accounts: AccountDetails[] }) {
		return await this.repository.updateAccounts(data.userId, data.accounts)
	}

	async transfer(data: TransferData) {
		return await this.repository.transfer(data)
	}

	async withdraw(data: WithdrawData) {
		return await this.repository.withdraw(data)
	}

	async updateMembersDays(data: Record<string, number>) {
		return await this.repository.updateMembersDays(data)
	}

	async updateSubscriptions(data: { id: string; subscription: Subscription }) {
		return await this.repository.updateSubscriptions(data.id, data.subscription)
	}
}
