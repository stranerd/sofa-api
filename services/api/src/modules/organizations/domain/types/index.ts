import { FileType, QuizModes } from '@modules/study'

export { Saleable } from '@modules/payment'
export { EmbeddedUser } from '@modules/users'
export { MediaOutput as Media } from 'equipped'

export enum MemberTypes {
	teacher = 'teacher',
	student = 'student',
}

export type AnnouncementFilter = {
	lessonId: string | null
	userType: MemberTypes | null
}

export type ScheduleTime = {
	start: number
	end: number
}

export type LessonMembers = {
	students: string[]
	teachers: string[]
}

export enum ScheduleStatus {
	created = 'created',
	started = 'started',
	ended = 'ended',
}

export type ClassLesson = {
	id: string
	title: string
	users: LessonMembers
	curriculum: ClassLessonCurriculumSection[]
}

export type ClassMembers = {
	students: string[]
}

export enum ClassLessonable {
	quiz = 'quiz',
	file = 'file',
	schedule = 'schedule',
}

type ClassLessonCurriculumSectionItem =
	| {
			id: string
			type: ClassLessonable.quiz
			quizMode: QuizModes
	  }
	| {
			id: string
			type: ClassLessonable.file
			fileType: FileType
	  }
	| {
			id: string
			type: ClassLessonable.schedule
	  }

export type ClassLessonCurriculumSection = {
	label: string
	items: ClassLessonCurriculumSectionItem[]
}

export type ScheduleStream = {
	broadcastId: string
	streamId: string
	streamKey: string
	type: 'jitsi'
	roomId: string
	canRewatch: boolean
}
