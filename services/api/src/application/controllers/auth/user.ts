import { AuthUsersUseCases, signOutUser } from '@modules/auth'
import { UploaderUseCases } from '@modules/storage'
import { superAdminEmail } from '@utils/environment'
import { AuthRole, BadRequestError, NotFoundError, Request, Schema, validate, verifyAccessToken } from 'equipped'

export class UserController {
	static async find (req: Request) {
		const userId = req.authUser!.id
		return await AuthUsersUseCases.findUser(userId)
	}

	static async update (req: Request) {
		const userId = req.authUser!.id
		const uploadedPhoto = req.files.photo?.[0] ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null
		const data = validate({
			name: Schema.object({
				first: Schema.string().min(1),
				last: Schema.string().min(1),
			}),
			description: Schema.string(),
			photo: Schema.file().image().nullable()
		}, { ...req.body, photo: uploadedPhoto })
		const { name, description } = data
		const photo = uploadedPhoto ? await UploaderUseCases.upload('profiles/photos', uploadedPhoto) : undefined

		return await AuthUsersUseCases.updateUserProfile({
			userId,
			data: {
				name, description,
				...(changedPhoto ? { photo } : {}) as any
			}
		})
	}

	static async updateRole (req: Request) {
		const { role, userId, value } = validate({
			role: Schema.in([AuthRole.isAdmin, AuthRole.isTutor]),
			userId: Schema.string().min(1),
			value: Schema.boolean()
		}, req.body)
		if (req.authUser!.id === userId) throw new BadRequestError('You cannot modify your own roles')

		return await AuthUsersUseCases.updateUserRole({
			userId, roles: { [role]: value }
		})
	}

	static async signout (req: Request) {
		const user = await verifyAccessToken(req.headers.AccessToken ?? '').catch(() => null)
		return await signOutUser(user?.id ?? '')
	}

	static async superAdmin (_: Request) {
		const user = await AuthUsersUseCases.findUserByEmail(superAdminEmail)
		if (!user) throw new NotFoundError()
		return await AuthUsersUseCases.updateUserRole({
			userId: user.id,
			roles: {
				[AuthRole.isAdmin]: true,
				[AuthRole.isSuperAdmin]: true
			}
		})
	}

	static async delete (req: Request) {
		const authUserId = req.authUser!.id
		const deleted = await AuthUsersUseCases.deleteUsers([authUserId])
		await signOutUser(authUserId)
		return deleted
	}
}