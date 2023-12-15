import { QueryParams } from 'equipped'
import { IUserRepository } from '../irepositories/users'
import { UserAccount, UserAi, UserBio, UserLocation, UserRoles, UserSocialsType, UserTypeData } from '../types'

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

	async findByEmail (email: string) {
		const res = await this.repository.getUsers({ where: [{ field: 'bio.email', value: email }] })
		const user = res.results.at(0)
		if (user && !user.isDeleted()) return user
		return null
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
		return await this.repository.updateType(params.userId, params.data)
	}

	async updateOrgCode (params: { userId: string, code: string }) {
		return await this.repository.updateOrgCode(params.userId, params.code)
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

	async updateRatings (input: { id: string, ratings: number, add: boolean }) {
		return await this.repository.updateRatings(input.id, input.ratings, input.add)
	}

	async updateLocation (params: { userId: string, location: UserLocation }) {
		return await this.repository.updateLocation(params.userId, params.location)
	}

	async updateOrganizationsIn (params: { email: string, organizations: UserAccount['organizationsIn'], add: boolean }) {
		return await this.repository.updateOrganizationsIn(params.email, params.organizations, params.add)
	}

	async updateSettings (params: { userId: string, settings: Partial<UserAccount['settings']>; }) {
		return await this.repository.updateSettings(params.userId, params.settings)
	}

	async updateEditing (params: { userId: string, editing: Partial<UserAccount['editing']> }) {
		return await this.repository.updateEditing(params.userId, params.editing)
	}
}