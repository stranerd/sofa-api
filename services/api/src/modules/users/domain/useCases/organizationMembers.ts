import { QueryParams } from 'equipped'
import { IOrganizationMemberRepository } from '../irepositories/organizationMembers'

export class OrganizationMembersUseCase {
	repository: IOrganizationMemberRepository

	constructor (repo: IOrganizationMemberRepository) {
		this.repository = repo
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async add (input: { userId: string, organizationId: string, emails: string[] }) {
		return await this.repository.add(input)
	}

	async request (data: { email: string, organizationId: string, withPassword: boolean }) {
		return await this.repository.request(data)
	}

	async accept (data: { userId: string, organizationId: string, email: string, accept: boolean }) {
		return await this.repository.accept(data)
	}
}