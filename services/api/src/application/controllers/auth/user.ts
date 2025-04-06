import type { Request } from 'equipped'
import { AuthRole, BadRequestError, NotFoundError, Schema, validate, Validation, verifyAccessToken } from 'equipped'

import { AuthUsersUseCases, signOutUser } from '@modules/auth'
import { UploaderUseCases } from '@modules/storage'
import { officialAccountEmail, superAdminEmail } from '@utils/environment'

export class UserController {
	static async find(req: Request) {
		const userId = req.authUser!.id
		return await AuthUsersUseCases.findUser(userId)
	}

	static async update(req: Request) {
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
				phone: Schema.any().addRule(Validation.isValidPhone()).nullable(),
			},
			{ ...req.body, photo: uploadedPhoto },
		)
		const { name, description, phone } = data
		const photo = uploadedPhoto ? await UploaderUseCases.upload('profiles/photos', uploadedPhoto) : undefined

		return await AuthUsersUseCases.updateUserProfile({
			userId,
			data: {
				name,
				description,
				phone,
				...((changedPhoto ? { photo } : {}) as any),
			},
		})
	}

	static async updateRole(req: Request) {
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
	}

	static async signout(req: Request) {
		const user = await verifyAccessToken(req.headers.AccessToken ?? '').catch(() => null)
		return await signOutUser(user?.id ?? '')
	}

	static async superAdmin(_: Request) {
		const user = await AuthUsersUseCases.findUserByEmail(superAdminEmail)
		if (!user) throw new NotFoundError()
		return await AuthUsersUseCases.updateUserRole({
			userId: user.id,
			roles: {
				[AuthRole.isAdmin]: true,
				[AuthRole.isSuperAdmin]: true,
			},
		})
	}

	static async officialAccount(_: Request) {
		const user = await AuthUsersUseCases.findUserByEmail(officialAccountEmail)
		if (!user) throw new NotFoundError()
		return await AuthUsersUseCases.updateUserRole({
			userId: user.id,
			roles: {
				[AuthRole.isOfficialAccount]: true,
			},
		})
	}

	static async delete(req: Request) {
		const authUserId = req.authUser!.id
		const deleted = await AuthUsersUseCases.deleteUsers([authUserId])
		await signOutUser(authUserId)
		return deleted
	}
}
