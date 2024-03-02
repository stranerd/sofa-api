import { QuizMetaType } from '@modules/study'
import { UserMeta, generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, PlayData, PlayScore, PlaySources, PlayStatus, PlayTypes } from '../types'

export class PlayEntity extends BaseEntity<PlayConstructorArgs> {
	constructor(data: PlayConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
		this.sources['']
		if (!this.isPractice() && !this.isFlashcard()) this.ignoreInJSON.push('sources')
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

	isPractice() {
		return this.data.type === PlayTypes.practice
	}

	isFlashcard() {
		return this.data.type === PlayTypes.flashcards
	}

	get type() {
		return this.data.type
	}

	get questions() {
		return this.sources.map((s) => s.id)
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
		if (this.data.type === PlayTypes.assessments) return this.data.endedAt
		return (this.startedAt ?? 0) + this.totalTimeInSec * 1000
	}

	getUsesTimer() {
		return ![PlayTypes.practice, PlayTypes.flashcards].includes(this.data.type)
	}

	canUserAccess(userId: string) {
		return this.getMembers().includes(userId)
	}
}

export type PlayConstructorArgs = {
	id: string
	title: string
	quizId: string
	user: EmbeddedUser
	data: PlayData
	status: PlayStatus
	sources: PlaySources
	totalTimeInSec: number
	scores: PlayScore
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}
