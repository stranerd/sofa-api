import { QueryParams } from 'equipped'
import { IUserRepository } from '../irepositories/users'
import { RegisterInput, RoleInput, UserUpdateInput } from '../types'

export class AuthUsersUseCase {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async deleteUsers (userIds: string[]) {
		return await this.repository.deleteUsers(userIds)
	}

	async findUser (id: string) {
		return await this.repository.findUser(id)
	}

	async findUserByEmail (email: string) {
		const res = await this.repository.getUsers({
			where: [{ field: 'email', value: email.toLowerCase() }],
			limit: 1
		})
		return res.results.at(0) ?? null
	}

	async getUsers (data: QueryParams) {
		return await this.repository.getUsers(data)
	}

	async updatePassword (input: { userId: string, password: string }) {
		return await this.repository.updatePassword(input.userId, input.password)
	}

	async updateUserDetails (input: { userId: string, data: RegisterInput }) {
		return await this.repository.updateDetails(input.userId, input.data)
	}

	async updateUserProfile (input: { userId: string, data: UserUpdateInput }) {
		return await this.repository.updateUserProfile(input.userId, input.data)
	}

	async updateUserRole (roleInput: RoleInput) {
		return await this.repository.updateUserRole(roleInput)
	}
}