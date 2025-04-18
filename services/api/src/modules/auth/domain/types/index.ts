import type { MediaOutput } from 'equipped'

export type Phone = {
	code: string
	number: string
}

export interface UserUpdateInput {
	name: { first: string; last: string }
	description: string
	photo: MediaOutput | null
}

export interface RoleInput {
	userId: string
	roles: Record<string, boolean>
}

export interface RegisterInput {
	email: string
	password: string
}

export interface PasswordResetInput {
	token: string
	password: string
}

export interface Credential {
	email: string
	password: string
}

export interface AuthOutput {
	accessToken: string
	refreshToken: string
}
