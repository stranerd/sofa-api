import { ConversationsUseCases } from '@modules/conversations'
import { CommentsUseCases, LikesUseCases, ViewsUseCases } from '@modules/interactions'
import { PurchasesUseCases } from '@modules/payment'
import { GamesUseCases } from '@modules/plays'
import { CoursesUseCases, FilesUseCases, FoldersUseCases, QuizzesUseCases } from '@modules/study'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { ConnectsUseCases } from '../../'
import { UserFromModel } from '../../data/models/users'
import { UserEntity } from '../../domain/entities/users'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['users/users', `users/users/${after.id}`], after)
	},
	updated: async ({ after, changes }) => {
		await appInstance.listener.created(['users/users', `users/users/${after.id}`], after)
		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([
			ConversationsUseCases,
			CommentsUseCases, LikesUseCases, ViewsUseCases,
			PurchasesUseCases,
			GamesUseCases,
			CoursesUseCases, FoldersUseCases, QuizzesUseCases, FilesUseCases,
			ConnectsUseCases,
		].map(async (useCase) => await useCase.updateUserBio(after.getEmbedded())))
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created(['users/users', `users/users/${before.id}`], before)
	}
}