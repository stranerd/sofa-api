import { BaseEntity } from 'equipped'
import { PlayTypes } from '../types'

export class AnswerEntity extends BaseEntity<AnswerConstructorArgs> {
	constructor(data: AnswerConstructorArgs) {
		super(data)
	}
}

type AnswerConstructorArgs = {
	id: string
	type: PlayTypes
	typeId: string
	userId: string
	data: Record<string, any>
	createdAt: number
	updatedAt: number
}
