import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser } from '../types'

export class GameEntity extends BaseEntity {
	public readonly id: string
	public readonly quizId: string
	public readonly user: EmbeddedUser
	public readonly participants: string[]
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, quizId, user, participants, createdAt, updatedAt }: GameConstructorArgs) {
		super()
		this.id = id
		this.quizId = quizId
		this.user = generateDefaultUser(user)
		this.participants = participants
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type GameConstructorArgs = {
	id: string
	quizId: string
	user: EmbeddedUser
	participants: string[]
	createdAt: number
	updatedAt: number
}