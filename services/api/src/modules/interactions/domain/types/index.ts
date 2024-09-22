export { EmbeddedUser } from '@modules/users'

export enum InteractionEntities {
	comments = 'comments',
	courses = 'courses',
	quizzes = 'quizzes',
	users = 'users',
	quizQuestions = 'quizQuestions',
	conversations = 'conversations',
}

type BaseInteractionEntity = {
	id: string
	userId: string
}

export type InteractionEntity = BaseInteractionEntity &
	(
		| {
				type: InteractionEntities.comments
				relations: {}
		  }
		| {
				type: InteractionEntities.courses
				relations: {}
		  }
		| {
				type: InteractionEntities.quizzes
				relations: {}
		  }
		| {
				type: InteractionEntities.users
				relations: {}
		  }
		| {
				type: InteractionEntities.quizQuestions
				relations: {}
		  }
		| {
				type: InteractionEntities.conversations
				relations: {}
		  }
	)

export type Interaction = Omit<InteractionEntity, 'userId' | 'relations'>

export enum CommentMeta {
	comments = 'comments',
	total = 'total',
}

export type CommentMetaType = Record<CommentMeta, number>

export enum TagMeta {
	courses = 'courses',
	quizzes = 'quizzes',
	images = 'images',
	documents = 'documents',
	videos = 'videos',

	total = 'total',
}

export type TagMetaType = Record<TagMeta, number>

export enum TagTypes {
	generic = 'generic',
	topics = 'topics',
}
