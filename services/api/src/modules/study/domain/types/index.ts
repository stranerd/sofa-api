export { Saleable } from '@modules/payment'
export * from './questions'
export { EmbeddedUser, Media }
import { EmbeddedUser } from '@modules/users'
import { MediaOutput as Media } from 'equipped'

export enum FileType {
	video = 'video',
	image = 'image',
	document = 'document',
}

export enum FolderSaved {
	courses = 'courses',
	quizzes = 'quizzes',
	files = 'files'
}

export enum DraftStatus {
	draft = 'draft',
	published = 'published'
}

export type Publishable = {
	title: string
	description: string
	photo: Media | null
	user: EmbeddedUser
	tagId: string
	status: DraftStatus
}

export enum Coursable {
	quiz = 'quiz',
	file = 'file'
}

export type CoursableData = Publishable & {
	courseId: string | null
}

export type CourseSections = {
	label: string
	items: { id: string, type: Coursable }[]
}[]