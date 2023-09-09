export { EmbeddedUser } from '@modules/users'

export enum InteractionEntities {
	comments = 'comments',
	courses = 'courses',
	quizzes = 'quizzes',
	users = 'users',
	quizQuestions = 'quizQuestions',
	tutorConversations = 'tutorConversations',
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

export enum TagMeta {
	courses = 'courses',
	quizzes = 'quizzes',
	images = 'images',
	documents = 'documents',
	videos = 'videos',

	total = 'total'
}

export type TagMetaType = Record<TagMeta, number>

export enum TagTypes {
	generic = 'generic',
	topics = 'topics'
}