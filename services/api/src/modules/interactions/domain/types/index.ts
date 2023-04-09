export { EmbeddedUser } from '@modules/users'

export enum InteractionEntities {
	comments = 'comments'
}

export type Interaction = {
	type: InteractionEntities
	id: string
}

export type InteractionEntity = Interaction & { userId: string }

export enum CommentMeta {
	comments = 'comments',
	total = 'total'
}

export type CommentMetaType = Record<CommentMeta, number>

export enum TagMetaType {
	tags = 'tags'
}

export type TagMeta = Record<TagMetaType, number>

export enum TagTypes {
	topics = 'topics'
}