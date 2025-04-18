import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import { CommentsUseCases } from '../../'
import type { CommentFromModel } from '../../data/models/comments'
import type { CommentEntity } from '../../domain/entities/comments'
import { CommentMeta, InteractionEntities } from '../../domain/types'

export const CommentDbChangeCallbacks: DbChangeCallbacks<CommentFromModel, CommentEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/comments', `interactions/comments/${after.id}`], after)

		if (after.entity.type === InteractionEntities.comments)
			await CommentsUseCases.updateMeta({
				id: after.entity.id,
				property: CommentMeta.comments,
				value: 1,
			})
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(['interactions/comments', `interactions/comments/${after.id}`], { before, after })
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/comments', `interactions/comments/${before.id}`], before)
		await CommentsUseCases.deleteEntityComments({ type: InteractionEntities.comments, id: before.id })
		if (before.entity.type === InteractionEntities.comments)
			await CommentsUseCases.updateMeta({
				id: before.entity.id,
				property: CommentMeta.comments,
				value: -1,
			})
	},
}
