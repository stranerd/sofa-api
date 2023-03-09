import { IWalletRepository } from '../irepositories/wallets'
import { PlanDataType, SubscriptionModel } from '../types'

export class WalletsUseCase {
	repository: IWalletRepository

	constructor (repo: IWalletRepository) {
		this.repository = repo
	}

	async get (userId: string) {
		return await this.repository.get(userId)
	}

	async updateAmount (data: { userId: string, amount: number }) {
		return await this.repository.updateAmount(data.userId, data.amount)
	}

	async updateSubscription (data: { id: string, data: Partial<SubscriptionModel> }) {
		return await this.repository.updateSubscription(data.id, data.data)
	}

	async updateSubscriptionData (data: { userId: string, key: PlanDataType, value: 1 | -1 }) {
		return await this.repository.updateSubscriptionData(data.userId, data.key, data.value)
	}
}