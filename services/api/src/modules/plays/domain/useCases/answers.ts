import { QueryParams } from 'equipped'
import { AnswerToModel } from '../../data/models/answers'
import { IAnswerRepository } from '../irepositories/answers'

export class AnswersUseCase {
	private repository: IAnswerRepository

	constructor (repository: IAnswerRepository) {
		this.repository = repository
	}

	async answer (data: AnswerToModel & { questionId: string, answer: any }) {
		return await this.repository.answer(data)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async deleteGameAnswers (gameId: string) {
		return await this.repository.deleteGameAnswers(gameId)
	}
}