import {
	BadRequestError,
	Conditions,
	deleteCachedAccessToken,
	deleteCachedRefreshToken,
	exchangeOldForNewTokens,
	makeAccessToken,
	makeRefreshToken
} from 'equipped'
import { AuthUsersUseCases } from '../'
import { AuthUserEntity } from '../domain/entities/users'
import { AuthOutput } from '../domain/types'

export const signOutUser = async (userId: string): Promise<boolean> => {
	await deleteCachedAccessToken(userId)
	await deleteCachedRefreshToken(userId)
	return true
}

export const generateAuthOutput = async (user: AuthUserEntity): Promise<AuthOutput & { user: AuthUserEntity }> => {
	const accessToken = await makeAccessToken({
		id: user.id,
		email: user.email,
		roles: user.roles,
		isEmailVerified: user.isEmailVerified
	})
	const refreshToken = await makeRefreshToken({ id: user.id })
	return { accessToken, refreshToken, user }
}

export const getNewTokens = async (tokens: AuthOutput): Promise<AuthOutput & { user: AuthUserEntity }> => {
	let user = null as null | AuthUserEntity
	const newTokens = await exchangeOldForNewTokens(tokens, async (id: string) => {
		user = await AuthUsersUseCases.findUser(id)
		if (!user) throw new BadRequestError('No account with such id exists')
		const { accessToken, refreshToken } = await generateAuthOutput(user)
		return { accessToken, refreshToken }
	})

	return { ...newTokens, user: user! }
}

export const deleteUnverifiedUsers = async () => {
	const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
	const { results: unverifiedUsers } = await AuthUsersUseCases.getUsers({
		where: [{ field: 'isEmailVerified', value: false }, { field: 'signedUpAt', condition: Conditions.lte, value: sevenDaysAgo }],
		all: true
	})
	await AuthUsersUseCases.deleteUsers(unverifiedUsers.map((u) => u.id))
}
