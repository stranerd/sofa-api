import type { QueryParams } from 'equipped'

import type { AnswerToModel } from '../../data/models/answers'
import type { IAnswerRepository } from '../irepositories/answers'
import type { PlayTypes } from '../types'

export class AnswersUseCase {
	private repository: IAnswerRepository

	constructor(repository: IAnswerRepository) {
		this.repository = repository
	}

	async answer(data: AnswerToModel) {
		return await this.repository.answer(data)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async deleteTypeAnswers(data: { type: PlayTypes; typeId: string }) {
		return await this.repository.deleteTypeAnswers(data.type, data.typeId)
	}

	async end(data: Omit<AnswerToModel, 'answer' | 'questionId'>) {
		return await this.repository.end(data)
	}

	async reset(data: Omit<AnswerToModel, 'answer' | 'questionId'>) {
		return await this.repository.reset(data)
	}
}
