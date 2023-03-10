import { CommentsUseCases } from '@modules/interactions'
import { CardsUseCases } from '@modules/study'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { ConnectsUseCases } from '../../'
import { UserFromModel } from '../../data/models/users'
import { UserEntity } from '../../domain/entities/users'

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
			ConnectsUseCases, CommentsUseCases, CardsUseCases
		].map(async (useCase) => await useCase.updateUserBio(after.getEmbedded())))
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('users/users', before)
		await appInstance.listener.deleted(`users/users/${before.id}`, before)
	}
}