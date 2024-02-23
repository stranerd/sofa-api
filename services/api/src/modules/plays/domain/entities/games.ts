import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, PlayStatus } from '../types'

export class GameEntity extends BaseEntity<GameConstructorArgs> {
	constructor(data: GameConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}

	getEndsAt() {
		return (this.startedAt ?? 0) + this.totalTimeInSec * 1000
	}

	canUserAccess(userId: string) {
		return this.user.id === userId || this.participants.includes(userId)
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
