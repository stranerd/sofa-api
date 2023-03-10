import { ScoreRewards, UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { FoldersUseCases } from '../../'
import { CardFromModel } from '../../data/models/cards'
import { CardEntity } from '../../domain/entities/cards'
import { FolderSaved } from '../../domain/types'

export const CardDbChangeCallbacks: DbChangeCallbacks<CardFromModel, CardEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('study/cards', after)
		await appInstance.listener.created(`study/cards/${after.id}`, after)

		await UsersUseCases.updateNerdScore({
			userId: after.user.id,
			amount: ScoreRewards.NewCard
		})
		await UsersUseCases.incrementMeta({ id: after.user.id, value: 1, property: UserMeta.cards })
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('study/cards', after)
		await appInstance.listener.updated(`study/cards/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('study/cards', before)
		await appInstance.listener.deleted(`study/cards/${before.id}`, before)

		await FoldersUseCases.removeProp({ prop: FolderSaved.cards, value: before.id })
		await UsersUseCases.updateNerdScore({
			userId: before.user.id,
			amount: -ScoreRewards.NewCard
		})
		await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: UserMeta.cards })
	}
}