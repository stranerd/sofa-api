import { AuthTypes } from 'equipped'

import type { UserToModel } from '../../data/models/users'
import type { IAuthRepository } from '../irepositories/auth'
import type { Credential, PasswordResetInput, Phone, RegisterInput } from '../types'

export class AuthUseCase {
	repository: IAuthRepository

	constructor(repo: IAuthRepository) {
		this.repository = repo
	}

	async authenticateUser(params: Credential) {
		return await this.repository.authenticateUser(params, true, AuthTypes.email)
	}

	async googleSignIn(input: { idToken: string }) {
		return await this.repository.googleSignIn(input.idToken)
	}

	async appleSignIn(input: { data: { idToken: string; email: string | null; firstName: string | null; lastName: string | null } }) {
		return await this.repository.appleSignIn(input.data)
	}

	async registerUser(params: RegisterInput) {
		const userModel: UserToModel = {
			name: { first: '', last: '' },
			description: '',
			photo: null,
			phone: null,
			isEmailVerified: false,
			authTypes: [AuthTypes.email],
			...params,
		}

		return await this.repository.addNewUser(userModel, AuthTypes.email)
	}

	async resetPassword(input: PasswordResetInput) {
		return await this.repository.resetPassword(input)
	}

	async sendPasswordResetMail(email: string) {
		return await this.repository.sendPasswordResetMail(email)
	}

	async sendVerificationMail(email: string) {
		return await this.repository.sendVerificationMail(email)
	}

	async verifyEmail(token: string) {
		return await this.repository.verifyEmail(token)
	}

	async sendVerificationText(data: { id: string; phone: Phone }) {
		return await this.repository.sendVerificationText(data.id, data.phone)
	}

	async verifyPhone(token: string) {
		return await this.repository.verifyPhone(token)
	}
}
