import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, GameStatus } from '../types'

export class GameEntity extends BaseEntity {
	public readonly id: string
	public readonly quizId: string
	public readonly user: EmbeddedUser
	public readonly status: GameStatus
	public readonly participants: string[]
	public readonly questions: string[]
	public readonly scores: Record<string, number>
	public readonly startedAt: number | null
	public readonly endedAt: number | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, quizId, user, status, participants, questions, scores, startedAt, endedAt, createdAt, updatedAt }: GameConstructorArgs) {
		super()
		this.id = id
		this.quizId = quizId
		this.user = generateDefaultUser(user)
		this.status = status
		this.participants = participants
		this.questions = questions
		this.scores = scores
		this.startedAt = startedAt
		this.endedAt = endedAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type GameConstructorArgs = {
	id: string
	quizId: string
	user: EmbeddedUser
	status: GameStatus
	participants: string[]
	questions: string[]
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}