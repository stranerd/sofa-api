import type { QueryParams } from 'equipped'

import type { WithdrawalToModel } from '../../data/models/withdrawals'
import type { IWithdrawalRepository } from '../irepositories/withdrawals'

export class WithdrawalsUseCase {
	repository: IWithdrawalRepository

	constructor(repo: IWithdrawalRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async update(data: { id: string; data: Partial<WithdrawalToModel> }) {
		return await this.repository.update(data.id, data.data)
	}
}
