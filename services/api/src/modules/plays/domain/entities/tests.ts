import { BaseEntity } from 'equipped'
import { PlayStatus } from '../types'

export class TestEntity extends BaseEntity {
	public readonly id: string
	public readonly quizId: string
	public readonly status: PlayStatus
	public readonly userId: string
	public readonly questions: string[]
	public readonly totalTimeInSec: number
	public readonly scores: Record<string, number>
	public readonly startedAt: number | null
	public readonly endedAt: number | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({
		id,
		quizId,
		status,
		userId,
		questions,
		totalTimeInSec,
		scores,
		startedAt,
		endedAt,
		createdAt,
		updatedAt,
	}: TestConstructorArgs) {
		super()
		this.id = id
		this.quizId = quizId
		this.status = status
		this.userId = userId
		this.questions = questions
		this.totalTimeInSec = totalTimeInSec
		this.scores = scores
		this.startedAt = startedAt
		this.endedAt = endedAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	getEndsAt() {
		return (this.startedAt ?? 0) + this.totalTimeInSec * 1000
	}
}

type TestConstructorArgs = {
	id: string
	quizId: string
	status: PlayStatus
	userId: string
	questions: string[]
	totalTimeInSec: number
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}
