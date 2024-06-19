import { AuthRole, makeMiddleware, NotAuthenticatedError, NotAuthorizedError, requireAuthUser } from 'equipped'

export const isAuthenticatedButIgnoreVerified = requireAuthUser

export const isAuthenticated = makeMiddleware(
	async (request) => {
		await requireAuthUser.cb(request)
		if (!request.authUser?.isEmailVerified) throw new NotAuthenticatedError('verify your account to proceed')
	},
	(route) => {
		requireAuthUser.onSetup?.(route)
		route.descriptions ??= []
		route.descriptions.push('Requires auth user to be verified')
	},
)

export const isAdmin = makeMiddleware(
	async (request) => {
		const isAdmin = request.authUser?.roles?.[AuthRole.isAdmin]
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isAdmin) throw new NotAuthorizedError()
	},
	(route) => {
		route.descriptions ??= []
		route.descriptions.push('Requires auth user to be an admin')
	},
)
