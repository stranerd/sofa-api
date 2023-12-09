import { QueryParams } from 'equipped'
import { IMemberRepository } from '../irepositories/members'
import { MemberTypes } from '../types'

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

	async add (input: { userId: string, organizationId: string, members: { email: string, userId: string | null, type: MemberTypes }[] }) {
		return await this.repository.add(input)
	}

	async request (data: { email: string, userId: string | null, type: MemberTypes, organizationId: string, withCode: boolean }) {
		return await this.repository.request(data)
	}

	async accept (data: { userId: string, organizationId: string, email: string, type: MemberTypes, accept: boolean }) {
		return await this.repository.accept(data)
	}

	async remove (data: { userId: string | null, organizationId: string, email: string, type: MemberTypes }) {
		return await this.repository.remove(data)
	}

	async aggregateMembersDays () {
		return await this.repository.aggregateMembersDays()
	}

	async deleteByEmail (email: string) {
		return await this.repository.deleteByEmail(email)
	}
}