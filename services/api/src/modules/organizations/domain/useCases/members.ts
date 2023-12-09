import { QueryParams } from 'equipped'
import { IMemberRepository } from '../irepositories/members'
import { EmbeddedUser, MemberTypes } from '../types'

export class MembersUseCase {
	repository: IMemberRepository

	constructor (repo: IMemberRepository) {
		this.repository = repo
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async add (input: { organizationId: string, members: { email: string, user: EmbeddedUser | null, type: MemberTypes }[] }) {
		return await this.repository.add(input)
	}

	async request (data: { email: string, user: EmbeddedUser | null, type: MemberTypes, organizationId: string, withCode: boolean }) {
		return await this.repository.request(data)
	}

	async accept (data: { organizationId: string, email: string, type: MemberTypes, accept: boolean }) {
		return await this.repository.accept(data)
	}

	async remove (data: { organizationId: string, email: string, type: MemberTypes }) {
		return await this.repository.remove(data)
	}

	async aggregateMembersDays () {
		return await this.repository.aggregateMembersDays()
	}

	async deleteByEmail (email: string) {
		return await this.repository.deleteByEmail(email)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}
}