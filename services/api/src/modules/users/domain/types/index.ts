import { Phone } from '@modules/auth'
import { Ratings } from '@utils/commons'
import { AuthRoles, MediaOutput } from 'equipped'

export * from './verifications'

export type UserBio = {
	email: string
	name: { first: string, last: string, full: string }
	description: string
	photo: MediaOutput | null
	phone: Phone | null
}

export type UserLocation = {
	country: string
	state: string
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
	ratings: Ratings
	organizationsIn: string[]
	settings: {
		notifications: boolean
	}
}

export type EmbeddedUser = {
	id: string
	bio: Pick<UserBio, 'name' | 'photo'>
	roles: UserRoles
	type: UserTypeData | null
}

export enum UserMeta {
	connects = 'connects',

	courses = 'courses',
	quizzes = 'quizzes',
	documents = 'documents',
	images = 'images',
	videos = 'videos',
	folders = 'folders',

	hostedGames = 'hostedGames',
	playedGames = 'playedGames',
	playedTests = 'playedTests',

	students = 'students',

	total = 'total'
}

export enum UserRankings {
	daily = 'daily',
	weekly = 'weekly',
	monthly = 'monthly',
	overall = 'overall'
}

export enum ScoreRewards {
	newCourse = 1,
	newFolder = 0.05,
	newFile = 1,
	newQuiz = 1
}


export enum UserType {
	student = 'student',
	teacher = 'teacher',
	organization = 'organization'
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

export type UserTypeData = {
	type: UserType.student,
	school: AspirantType | CollegeType
} | {
	type: UserType.teacher,
	school: string
} | {
	type: UserType.organization,
	name: string,
	code: string
}

export type UserTutor = {
	conversations: string[]
	topics: string[]
}

export type UserAi = {
	photo: MediaOutput | null
	name: string
	tagline: string
}

export enum UserSocials {
	website = 'website',
	facebook = 'facebook',
	twitter = 'twitter',
	instagram = 'instagram',
	linkedIn = 'linkedIn',
	youtube = 'youtube',
	tiktok = 'tiktok',
}

export type UserSocialsType = { ref: UserSocials, link: string }[]