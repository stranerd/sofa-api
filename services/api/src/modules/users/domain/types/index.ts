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
	roles: Pick<UserRoles, 'isTutor'>
}

export enum UserMeta {
	connects = 'connects',

	courses = 'courses',
	quizzes = 'quizzes',
	folders = 'folders'
}

export enum UserRankings {
	daily = 'daily',
	weekly = 'weekly',
	monthly = 'monthly',
	overall = 'overall'
}

export enum ScoreRewards {
	NewCourse = 1,
	NewFolder = 0.05,
	NewQuiz = 1
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