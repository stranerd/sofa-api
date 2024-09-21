import { AuthUserEntity, AuthUsersUseCases, signOutUser } from '@modules/auth'
import { UploaderUseCases } from '@modules/storage'
import { officialAccountEmail, superAdminEmail } from '@utils/environment'
import {
	ApiDef,
	AuthRole,
	AuthRoles,
	BadRequestError,
	FileSchema,
	NotFoundError,
	Router,
	Schema,
	validate,
	verifyAccessToken,
} from 'equipped'
import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '../../middlewares'

const router = new Router({ path: '/user', groups: ['User'] })

router.get<GetAuthUserRouteDef>({ path: '/', key: 'user-get', middlewares: [isAuthenticatedButIgnoreVerified] })(async (req) => {
	const user = await AuthUsersUseCases.findUser(req.authUser!.id)
	if (!user) throw new NotFoundError('User not found')
	return user
})

router.put<UpdateAuthUserRouteDef>({ path: '/', key: 'user-update', middlewares: [isAuthenticated] })(async (req) => {
	const userId = req.authUser!.id
	const uploadedPhoto = req.body.photo?.at?.(0) ?? null
	const changedPhoto = !!uploadedPhoto || req.body.photo === null
	const data = validate(
		{
			name: Schema.object({
				first: Schema.string().min(1),
				last: Schema.string(),
			}),
			description: Schema.string(),
			photo: Schema.file().image().nullable(),
		},
		{ ...req.body, photo: uploadedPhoto },
	)
	const { name, description } = data
	const photo = uploadedPhoto ? await UploaderUseCases.upload('profiles/photos', uploadedPhoto) : undefined

	return await AuthUsersUseCases.updateUserProfile({
		userId,
		data: {
			name,
			description,
			...((changedPhoto ? { photo } : {}) as any),
		},
	})
})

router.delete<DeleteUserRouteDef>({ path: '/', key: 'user-delete', middlewares: [isAuthenticated] })(async (req) => {
	const authUserId = req.authUser!.id
	const deleted = await AuthUsersUseCases.deleteUsers([authUserId])
	await signOutUser(authUserId)
	return deleted
})

router.post<UpdateUserRolesRouteDef>({ path: '/roles', key: 'user-update-roles', middlewares: [isAuthenticated, isAdmin] })(async (req) => {
	const updatableRoles: string[] = [AuthRole.isAdmin, AuthRole.isVerified]

	const { role, userId, value } = validate(
		{
			role: Schema.in(updatableRoles),
			userId: Schema.string().min(1),
			value: Schema.boolean(),
		},
		req.body,
	)
	if (req.authUser!.id === userId) throw new BadRequestError('You cannot modify your own roles')

	return await AuthUsersUseCases.updateUserRole({
		userId,
		roles: { [role]: value },
	})
})

router.post<SignoutRouteDef>({ path: '/signout', key: 'user-signout' })(async (req) => {
	const user = await verifyAccessToken(req.headers.AccessToken ?? '').catch(() => null)
	return await signOutUser(user?.id ?? '')
})

router.get<SetSuperAdminRouteDef>({ path: '/superAdmin', key: 'user-super-admin' })(async () => {
	const user = await AuthUsersUseCases.findUserByEmail(superAdminEmail)
	if (!user) throw new NotFoundError()
	return await AuthUsersUseCases.updateUserRole({
		userId: user.id,
		roles: {
			[AuthRole.isAdmin]: true,
			[AuthRole.isSuperAdmin]: true,
		},
	})
})

router.get<SetOfficialAccountRouteDef>({ path: '/officialAccount', key: 'user-official-account' })(async () => {
	const user = await AuthUsersUseCases.findUserByEmail(officialAccountEmail)
	if (!user) throw new NotFoundError()
	return await AuthUsersUseCases.updateUserRole({
		userId: user.id,
		roles: {
			[AuthRole.isOfficialAccount]: true,
		},
	})
})

export default router

type GetAuthUserRouteDef = ApiDef<{
	key: 'user-get'
	method: 'get'
	response: AuthUserEntity
}>

type UpdateAuthUserRouteDef = ApiDef<{
	key: 'user-update'
	method: 'put'
	body: { name: { first: string; last: string }; description: string; photo?: FileSchema | null }
	response: AuthUserEntity
}>

type DeleteUserRouteDef = ApiDef<{
	key: 'user-delete'
	method: 'delete'
	response: boolean
}>

type UpdateUserRolesRouteDef = ApiDef<{
	key: 'user-update-roles'
	method: 'put'
	body: { role: AuthRoles; userId: string; value: boolean }
	response: boolean
}>

type SignoutRouteDef = ApiDef<{
	key: 'user-signout'
	method: 'post'
	response: boolean
}>

type SetSuperAdminRouteDef = ApiDef<{
	key: 'user-super-admin'
	method: 'get'
	response: boolean
}>

type SetOfficialAccountRouteDef = ApiDef<{
	key: 'user-official-account'
	method: 'get'
	response: boolean
}>
