import { BaseEntity } from 'equipped'
import { PlayAnswer, PlayTypes } from '../types'

export class AnswerEntity extends BaseEntity<AnswerConstructorArgs> {
	constructor(data: AnswerConstructorArgs) {
		super(data)
	}

	getMembers() {
		return [...new Set([this.userId, this.typeUserId])]
	}

	getLastDate() {
		if (this.endedAt) return this.endedAt
		return Object.values(this.data).reduce((acc, { at }) => Math.max(acc, at), 0)
	}
}

type AnswerConstructorArgs = {
	id: string
	type: PlayTypes
	typeId: string
	typeUserId: string
	userId: string
	data: Record<string, { value: PlayAnswer; at: number }>
	endedAt: number | null
	createdAt: number
	updatedAt: number
}
