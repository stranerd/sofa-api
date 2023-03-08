import { Phone } from '@modules/auth'
import { AuthRoles, MediaOutput } from 'equipped'

export type UserBio = {
	email: string
	name: { first: string, last: string, full: string }
	description: string
	photo: MediaOutput | null
	phone: Phone | null
}

export type UserRoles = AuthRoles

export type UserDates = {
	createdAt: number
	deletedAt: number | null
}

export type UserStatus = {
	connections: string[]
	lastUpdatedAt: number
}

export type UserAccount = {
	rankings: Record<UserRankings, { value: number, lastUpdatedAt: number }>
	meta: Record<UserMeta, number>
	streak: {
		count: number
		longestStreak: number
		lastEvaluatedAt: number
	}
}

export type EmbeddedUser = {
	id: string
	bio: Pick<UserBio, 'name' | 'photo'>
	roles: {}
}

export enum UserMeta {
	connects = 'connects',

	questions = 'questions',
	answers = 'answers',
	bestAnswers = 'bestAnswers',

	flashCards = 'flashCards',
	notes = 'notes',
	files = 'files',
	sets = 'sets'
}

export enum UserRankings {
	daily = 'daily',
	weekly = 'weekly',
	monthly = 'monthly',
	overall = 'overall'
}

export enum ScoreRewards {
	BestAnswer = 2,
	NewAnswer = 1,
	NewQuestion = 0.5,

	CompleteTest = 1,
	NewSet = 0.05,
	NewFlashCard = 1,
	NewFile = 0.05,
	NewNote = 0.05
}

export enum UserSchoolType {
	'aspirant' = 'aspirant',
	'college' = 'college'
}

type AspirantType = {
	type: UserSchoolType.aspirant
	exams: {
		institutionId: string
		courseIds: string[]
		startDate: number
		endDate: number
	}[]
}

type CollegeType = {
	type: UserSchoolType.college
	institutionId: string
	facultyId: string
	departmentId: string
}

export type UserSchoolData = AspirantType | CollegeType