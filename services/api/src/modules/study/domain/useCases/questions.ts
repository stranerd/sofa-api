import { QueryParams } from 'equipped'
import { QuestionToModel } from '../../data/models/questions'
import { IQuestionRepository } from '../irepositories/questions'

export class QuestionsUseCase {
	private repository: IQuestionRepository

	constructor(repository: IQuestionRepository) {
		this.repository = repository
	}

	async add(data: QuestionToModel) {
		return await this.repository.add(data)
	}

	async delete(input: { quizId: string; id: string; userId: string }) {
		return await this.repository.delete(input.quizId, input.id, input.userId)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async update(input: { quizId: string; id: string; userId: string; data: Partial<QuestionToModel> }) {
		return await this.repository.update(input.quizId, input.id, input.userId, input.data)
	}

	async deleteQuizQuestions(quizId: string) {
		return await this.repository.deleteQuizQuestions(quizId)
	}
}
