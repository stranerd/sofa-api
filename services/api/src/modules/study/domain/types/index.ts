export type { Saleable } from '@modules/payment'
export * from './questions'
export type { EmbeddedUser, Media }
import type { MediaOutput as Media } from 'equipped'

import type { EmbeddedUser } from '@modules/users'
import type { Ratings } from '@utils/commons'

export enum FileType {
	video = 'video',
	image = 'image',
	document = 'document',
}

export enum FolderSaved {
	courses = 'courses',
	quizzes = 'quizzes',
	files = 'files',
}

export enum DraftStatus {
	draft = 'draft',
	published = 'published',
}

export type Publishable = {
	title: string
	description: string
	photo: Media | null
	user: EmbeddedUser
	topicId: string
	tagIds: string[]
	ratings: Ratings
	status: DraftStatus
}

export enum Coursable {
	quiz = 'quiz',
	file = 'file',
	play = 'play',
}

export type CoursableData = Publishable & {
	courseIds: string[]
}

export type CourseSectionItem =
	| {
			id: string
			type: Coursable.quiz
			quizMode: QuizModes
	  }
	| {
			id: string
			type: Coursable.play
			quizId: string
			quizMode: QuizModes
	  }
	| {
			id: string
			type: Coursable.file
			fileType: FileType
	  }

export type CourseSections = {
	label: string
	items: CourseSectionItem[]
}[]

export enum QuizMeta {
	games = 'games',
	tests = 'tests',
	flashcards = 'flashcards',
	practice = 'practice',
	assessments = 'assessments',
	total = 'total',
}

export enum CourseMeta {
	purchases = 'purchases',
	total = 'total',
}

export type QuizAccess = {
	requests: string[]
	members: string[]
}

export enum QuizModes {
	practice = 'practice',
	tests = 'tests',
	games = 'games',
	flashcards = 'flashcards',
	assessments = 'assessments',
}
