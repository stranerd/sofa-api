import { CommentMeta, EmbeddedUser, InteractionEntity } from '../../domain/types'

export interface CommentFromModel extends CommentToModel {
	_id: string
	meta: CommentMeta
	createdAt: number
	updatedAt: number
}

export interface CommentToModel {
	body: string
	entity: InteractionEntity
	user: EmbeddedUser
}