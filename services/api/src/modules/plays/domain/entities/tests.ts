import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, PlayStatus } from '../types'

export class TestEntity extends BaseEntity<TestConstructorArgs> {
	constructor(data: TestConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}

	getEndsAt() {
		return (this.startedAt ?? 0) + this.totalTimeInSec * 1000
	}

	canUserAccess(userId: string) {
		return this.user.id === userId
	}
}

type TestConstructorArgs = {
	id: string
	quizId: string
	status: PlayStatus
	user: EmbeddedUser
	questions: string[]
	totalTimeInSec: number
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}
