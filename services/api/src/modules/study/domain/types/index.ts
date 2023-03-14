import { Currencies } from '@modules/payment'
import { EmbeddedUser } from '@modules/users'
import { MediaOutput as Media } from 'equipped'
export * from './questions'
export { EmbeddedUser, Media }

export enum FolderSaved {
	courses = 'courses',
	quizzes = 'quizzes'
}

export enum DraftStatus {
	draft = 'draft',
	published = 'published',
	frozen = 'frozen'
}

export type Publishable = {
	title: string
	description: string
	photo: Media | null
	user: EmbeddedUser
	tagId: string
	status: DraftStatus
	isPublic: boolean
}

export type Saleable = {
	price: {
		amount: number
		currency: Currencies
	}
}

export enum Coursable {
	quiz = 'quiz'
}

export type CoursableData = Publishable & {
	courseId: string | null
}