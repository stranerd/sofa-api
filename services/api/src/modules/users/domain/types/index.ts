import type { AuthRoles, MediaOutput } from 'equipped'

import type { Phone } from '@modules/auth'
import type { MemberTypes } from '@modules/organizations'
import type { Ratings } from '@utils/commons'

export type * from './verifications'

export type UserBio = {
	email: string
	name: { first: string; last: string; full: string }
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
	rankings: Record<UserRankings, { value: number; lastUpdatedAt: number }>
	meta: Record<UserMeta, number>
	streak: {
		count: number
		longestStreak: number
		lastEvaluatedAt: number
	}
	ratings: Ratings
	organizationsIn: { id: string; type: MemberTypes }[]
	settings: {
		notifications: boolean
	}
	editing: {
		quizzes: { id: string; questionId: string } | null
	}
	saved: {
		classes: string[]
	}
}

export type EmbeddedUser = {
	id: string
	bio: Pick<UserBio, 'name' | 'photo'> & { publicName: string }
	roles: UserRoles
	type:
		| Pick<Extract<UserTypeData, { type: UserType.agent }>, 'type'>
		| Pick<Extract<UserTypeData, { type: UserType.student }>, 'type'>
		| Pick<Extract<UserTypeData, { type: UserType.teacher }>, 'type'>
		| Pick<Extract<UserTypeData, { type: UserType.organization }>, 'type' | 'name'>
		| null
}

export enum UserMeta {
	connects = 'connects',

	courses = 'courses',
	publishedCourses = 'publishedCourses',
	quizzes = 'quizzes',
	publishedQuizzes = 'publishedQuizzes',
	documents = 'documents',
	publishedDocuments = 'publishedDocuments',
	images = 'images',
	publishedImages = 'publishedImages',
	videos = 'videos',
	publishedVideos = 'publishedVideos',
	folders = 'folders',

	hostedGames = 'hostedGames',
	playedGames = 'playedGames',
	playedTests = 'playedTests',
	playedPractice = 'playedPractice',
	playedFlashcards = 'playedFlashcards',
	hostedAssessments = 'hostedAssessments',
	playedAssessments = 'playedAssessments',

	students = 'students',
	teachers = 'teachers',
	classes = 'classes',
	lessons = 'lessons',

	total = 'total',
}

export enum UserRankings {
	daily = 'daily',
	weekly = 'weekly',
	monthly = 'monthly',
	overall = 'overall',
}

export enum ScoreRewards {
	newCourse = 1,
	newFolder = 0.05,
	newFile = 1,
	newQuiz = 1,
}

export enum UserType {
	agent = 'agent',
	student = 'student',
	teacher = 'teacher',
	organization = 'organization',
}

export enum UserSchoolType {
	'secondary' = 'secondary',
	'aspirant' = 'aspirant',
	'college' = 'college',
	'graduate' = 'graduate',
}

export type UserSchool =
	| {
			type: UserSchoolType.secondary
			schoolName: string
			schoolLocation: string
			choiceCourse: string
	  }
	| {
			type: UserSchoolType.aspirant
			exams: {
				institutionId: string
				courseIds: string[]
			}[]
	  }
	| {
			type: UserSchoolType.college
			institutionId: string
			facultyId: string
			departmentId: string
	  }
	| {
			type: UserSchoolType.graduate
	  }
	| null

export type UserTypeData =
	| {
			type: UserType.student
			school: UserSchool
	  }
	| {
			type: UserType.teacher
			degree: string
			workplace: string
			opLength: string
			sellsMaterials: boolean
			school: UserSchool
	  }
	| {
			type: UserType.organization
			name: string
			code: string
			opLength: string
			teachersSize: string
			studentsSize: string
			sellsMaterials: boolean
			school: UserSchool
	  }
	| {
			type: UserType.agent
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

export type UserSocialsType = { ref: UserSocials; link: string }[]
