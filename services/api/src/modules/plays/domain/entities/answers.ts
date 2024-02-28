import { BaseEntity } from 'equipped'
import { PlayAnswer, PlayTypes } from '../types'

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
	data: Record<string, { value: PlayAnswer; at: number }>
	createdAt: number
	updatedAt: number
}
