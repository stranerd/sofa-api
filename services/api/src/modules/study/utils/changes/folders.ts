import { ScoreRewards, UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { FolderFromModel } from '../../data/models/folders'
import { FolderEntity } from '../../domain/entities/folders'

export const FolderDbChangeCallbacks: DbChangeCallbacks<FolderFromModel, FolderEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('study/folders', after)
		await appInstance.listener.created(`study/folders/${after.id}`, after)

		await UsersUseCases.updateNerdScore({
			userId: after.user.id,
			amount: ScoreRewards.NewFolder
		})
		await UsersUseCases.incrementMeta({ id: after.user.id, value: 1, property: UserMeta.folders })
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('study/folders', after)
		await appInstance.listener.updated(`study/folders/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('study/folders', before)
		await appInstance.listener.deleted(`study/folders/${before.id}`, before)

		await UsersUseCases.updateNerdScore({
			userId: before.user.id,
			amount: -ScoreRewards.NewFolder
		})
		await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: UserMeta.folders })
	}
}