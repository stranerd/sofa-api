import { QueryParams } from 'equipped'
import { IUserRepository } from '../irepositories/users'
import { UserAccount, UserAi, UserBio, UserRoles, UserSocialsType, UserTypeData } from '../types'

export class UsersUseCase {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async createOrUpdateUser (params: { id: string, data: UserBio, timestamp: number }) {
		return await this.repository.createOrUpdateUser(params.id, params.data, params.timestamp)
	}

	async updateRoles (params: { id: string, data: UserRoles, timestamp: number }) {
		return await this.repository.updateUserWithRoles(params.id, params.data, params.timestamp)
	}

	async markDeleted (params: { id: string, timestamp: number }) {
		return await this.repository.markUserAsDeleted(params.id, params.timestamp)
	}

	async find (id: string) {
		return await this.repository.findUser(id)
	}

	async get (query: QueryParams) {
		return await this.repository.getUsers(query)
	}

	async incrementMeta (params: { id: string, value: 1 | -1, property: keyof UserAccount['meta'] }) {
		return await this.repository.incrementUserMetaProperty(params.id, params.property, params.value)
	}

	async updateStatus (input: { userId: string, socketId: string, add: boolean }) {
		return await this.repository.updateUserStatus(input.userId, input.socketId, input.add)
	}

	async resetAllUsersStatus () {
		return await this.repository.resetAllUsersStatus()
	}

	async resetRankings (key: keyof UserAccount['rankings']) {
		return await this.repository.resetRankings(key)
	}

	async updateNerdScore (params: { userId: string, amount: number }) {
		return await this.repository.updateNerdScore(params.userId, params.amount)
	}

	async updateType (params: { userId: string, data: UserTypeData }) {
		return await this.repository.updateUserType(params.userId, params.data)
	}

	async updateTutorConversations (params: { userId: string, conversationId: string, add: boolean }) {
		return await this.repository.updateTutorConversations(params.userId, params.conversationId, params.add)
	}

	async updateTutorTopics (params: { userId: string, topicId: string, add: boolean }) {
		return await this.repository.updateTutorTopics(params.userId, params.topicId, params.add)
	}

	async updateAi (params: { userId: string, ai: Partial<UserAi> }) {
		return await this.repository.updateAi(params.userId, params.ai)
	}

	async updateSocials (params: { userId: string, socials: UserSocialsType }) {
		return await this.repository.updateSocials(params.userId, params.socials)
	}

	async updateRatings (input: { userId: string, ratings: number, add: boolean }) {
		return await this.repository.updateRatings(input.userId, input.ratings, input.add)
	}
}