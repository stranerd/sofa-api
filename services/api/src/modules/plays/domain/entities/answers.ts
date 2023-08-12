import { BaseEntity } from 'equipped'
import { AnswerTypes } from '../types'

export class AnswerEntity extends BaseEntity {
	public readonly id: string
	public readonly type: AnswerTypes
	public readonly typeId: string
	public readonly userId: string
	public readonly data: Record<string, any>
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, type, typeId, userId, data, createdAt, updatedAt }: AnswerConstructorArgs) {
		super()
		this.id = id
		this.type = type
		this.typeId = typeId
		this.userId = userId
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type AnswerConstructorArgs = {
	id: string
	type: AnswerTypes
	typeId: string
	userId: string
	data: Record<string, any>
	createdAt: number
	updatedAt: number
}