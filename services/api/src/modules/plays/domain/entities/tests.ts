import { BaseEntity } from 'equipped'
import { PlayStatus } from '../types'

export class TestEntity extends BaseEntity<TestConstructorArgs> {
	constructor(data: TestConstructorArgs) {
		super(data)
	}

	getEndsAt() {
		return (this.startedAt ?? 0) + this.totalTimeInSec * 1000
	}

	canUserAccess(userId: string) {
		return this.userId === userId
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
