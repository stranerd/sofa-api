import { BaseEntity } from 'equipped'

export class AnswerEntity extends BaseEntity {
	public readonly id: string
	public readonly gameId: string
	public readonly userId: string
	public readonly data: Record<string, any>
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, gameId, userId, data, createdAt, updatedAt }: AnswerConstructorArgs) {
		super()
		this.id = id
		this.gameId = gameId
		this.userId = userId
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type AnswerConstructorArgs = {
	id: string
	gameId: string
	userId: string
	data: Record<string, any>
	createdAt: number
	updatedAt: number
}