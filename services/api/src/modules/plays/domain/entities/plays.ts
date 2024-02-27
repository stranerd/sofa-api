import { QuizMetaType } from '@modules/study'
import { UserMeta, generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, PlayData, PlayStatus, PlayTypes } from '../types'

export class PlayEntity extends BaseEntity<PlayConstructorArgs> {
	constructor(data: PlayConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}

	isPublic() {
		return this.isGame() || this.isAssessment()
	}

	isTest() {
		return this.data.type === PlayTypes.tests
	}

	isTutorTest() {
		return this.isTest() && 'forTutors' in this.data && !!this.data.forTutors
	}

	isGame() {
		return this.data.type === PlayTypes.games
	}

	isAssessment() {
		return this.data.type === PlayTypes.assessments
	}

	get type() {
		return this.data.type
	}

	getQuizMetaType() {
		if (this.type === PlayTypes.games) return QuizMetaType.games
		if (this.type === PlayTypes.tests) return QuizMetaType.tests
		if (this.type === PlayTypes.flashcards) return QuizMetaType.flashcards
		if (this.type === PlayTypes.practice) return QuizMetaType.practice
		if (this.type === PlayTypes.assessments) return QuizMetaType.assessments
		return QuizMetaType.practice
	}

	getUserMetaType() {
		if (this.type === PlayTypes.games) return UserMeta.playedGames
		if (this.type === PlayTypes.tests) return UserMeta.playedTests
		if (this.type === PlayTypes.flashcards) return UserMeta.playedFlashcards
		if (this.type === PlayTypes.practice) return UserMeta.playedPractice
		if (this.type === PlayTypes.assessments) return UserMeta.playedAssessments
		return UserMeta.playedPractice
	}

	getMembers() {
		return [...new Set(this.getActiveParticipants().concat(this.user.id))]
	}

	getActiveParticipants() {
		if (this.data.type === PlayTypes.games) return this.data.participants
		if (this.data.type === PlayTypes.assessments) return this.data.participants
		return [this.user.id]
	}

	getEndsAt() {
		return (this.startedAt ?? 0) + this.totalTimeInSec * 1000
	}

	canUserAccess(userId: string) {
		return this.getMembers().includes(userId)
	}
}

export type PlayConstructorArgs = {
	id: string
	quizId: string
	user: EmbeddedUser
	data: PlayData
	status: PlayStatus
	questions: string[]
	totalTimeInSec: number
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}
