import { QueryParams } from 'equipped'
import { IWithdrawalRepository } from '../irepositories/withdrawals'

export class WithdrawalsUseCase {
	repository: IWithdrawalRepository

	constructor (repo: IWithdrawalRepository) {
		this.repository = repo
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async delete (data: { id: string, userId: string }) {
		return await this.repository.delete(data.id, data.userId)
	}
}