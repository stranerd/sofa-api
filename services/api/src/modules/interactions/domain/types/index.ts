export { EmbeddedUser } from '@modules/users'

export enum InteractionEntities {
	comments = 'comments'
}

export type Interaction = {
	type: InteractionEntities
	id: string
}

export type InteractionEntity = Interaction & { userId: string }

export enum CommentMetaType {
	comments = 'comments'
}

export type CommentMeta = Record<CommentMetaType, number>

export enum TagTypes {
	topics = 'topics'
}