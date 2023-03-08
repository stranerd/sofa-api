import { DbChangeCallbacks } from 'equipped'
import { appInstance } from '@utils/types'
import { UserFromModel } from '../../data/models/users'
import { UserEntity } from '../../domain/entities/users'
import { ConnectsUseCases } from '../../'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('users/users', after)
		await appInstance.listener.created(`users/users/${after.id}`, after)
	},
	updated: async ({ after, changes }) => {
		await appInstance.listener.updated('users/users', after)
		await appInstance.listener.updated(`users/users/${after.id}`, after)
		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([
			ConnectsUseCases
		].map(async (useCase) => await useCase.updateUserBio(after.getEmbedded())))
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('users/users', before)
		await appInstance.listener.deleted(`users/users/${before.id}`, before)
	}
}