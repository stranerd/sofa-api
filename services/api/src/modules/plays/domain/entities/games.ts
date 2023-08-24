import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, PlayStatus } from '../types'

export class GameEntity extends BaseEntity {
	public readonly id: string
	public readonly quizId: string
	public readonly user: EmbeddedUser
	public readonly status: PlayStatus
	public readonly participants: string[]
	public readonly questions: string[]
	public readonly totalTimeInSec: number
	public readonly scores: Record<string, number>
	public readonly startedAt: number | null
	public readonly endedAt: number | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, quizId, user, status, participants, questions, totalTimeInSec, scores, startedAt, endedAt, createdAt, updatedAt }: GameConstructorArgs) {
		super()
		this.id = id
		this.quizId = quizId
		this.user = generateDefaultUser(user)
		this.status = status
		this.participants = participants
		this.questions = questions
		this.totalTimeInSec = totalTimeInSec
		this.scores = scores
		this.startedAt = startedAt
		this.endedAt = endedAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}


	getEndsAt () {
		return (this.startedAt ?? 0) + (this.totalTimeInSec * 1000)
	}
}

type GameConstructorArgs = {
	id: string
	quizId: string
	user: EmbeddedUser
	status: PlayStatus
	participants: string[]
	questions: string[]
	totalTimeInSec: number
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}