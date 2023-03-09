import {
	AuthRole,
	makeMiddleware,
	NotAuthenticatedError,
	NotAuthorizedError,
	requireAuthUser,
	requireRefreshUser
} from 'equipped'

export const isAuthenticatedButIgnoreVerified = makeMiddleware(
	async (request) => {
		await requireAuthUser(request)
	}
)

export const isAuthenticated = makeMiddleware(
	async (request) => {
		await requireAuthUser(request)
		if (!request.authUser?.isEmailVerified) throw new NotAuthenticatedError('verify your email address to proceed')
	}
)

export const hasRefreshToken = makeMiddleware(
	async (request) => {
		await requireRefreshUser(request)
	}
)

export const isAdmin = makeMiddleware(
	async (request) => {
		const isAdmin = request.authUser?.roles?.[AuthRole.isAdmin] || request.authUser?.roles?.[AuthRole.isSuperAdmin]
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isAdmin) throw new NotAuthorizedError()
	}
)

export const isSubscribed = makeMiddleware(
	async (request) => {
		const isSubscribed = request.authUser?.roles?.[AuthRole.isSubscribed]
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isSubscribed) throw new NotAuthorizedError('You need an active subscription to proceed')
	}
)