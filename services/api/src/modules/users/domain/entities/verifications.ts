import { BaseEntity } from 'equipped'

import type { VerificationAcceptType, VerificationContent } from '../types'

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
	accepted: VerificationAcceptType
	createdAt: number
	updatedAt: number
}
