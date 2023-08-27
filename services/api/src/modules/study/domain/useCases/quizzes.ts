import { QueryParams } from 'equipped'
import { QuizToModel } from '../../data/models/quizzes'
import { IQuizRepository } from '../irepositories/quizzes'
import { EmbeddedUser, QuizMeta } from '../types'

export class QuizzesUseCase {
	private repository: IQuizRepository

	constructor (repository: IQuizRepository) {
		this.repository = repository
	}

	async add (data: QuizToModel) {
		return await this.repository.add(data)
	}

	async delete (input: { id: string, userId: string, isAdmin: boolean }) {
		return await this.repository.delete(input.id, input.userId, input.isAdmin)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { id: string, userId: string, data: Partial<QuizToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async publish (input: { id: string, userId: string }) {
		return await this.repository.publish(input.id, input.userId)
	}

	async toggleQuestion (input: { quizId: string, userId: string, questionId: string, add: boolean }) {
		return await this.repository.toggleQuestion(input.quizId, input.userId, input.questionId, input.add)
	}

	async reorder (input: { id: string, userId: string, questionIds: string[] }) {
		return await this.repository.reorder(input.id, input.userId, input.questionIds)
	}

	async deleteCourseQuizzes (courseId: string) {
		return await this.repository.deleteCourseQuizzes(courseId)
	}

	async updateMeta (data: { id: string, property: QuizMeta, value: 1 | -1 }) {
		return this.repository.updateMeta(data.id, data.property, data.value)
	}

	async updateRatings (input: { id: string, ratings: number, add: boolean }) {
		return await this.repository.updateRatings(input.id, input.ratings, input.add)
	}
}