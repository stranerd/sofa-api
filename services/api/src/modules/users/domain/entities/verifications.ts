import { BaseEntity } from 'equipped'
import { VerificationContent } from '../types'

export class VerificationEntity extends BaseEntity<VerificationConstructorArgs> {
	constructor(data: VerificationConstructorArgs) {
		super(data)
	}
}

type VerificationConstructorArgs = {
	id: string
	userId: string
	content: VerificationContent
	pending: boolean
	accepted: boolean
	createdAt: number
	updatedAt: number
}
