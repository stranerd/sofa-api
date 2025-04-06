import type { MediaOutput } from 'equipped'
import { BaseEntity } from 'equipped'

import type { VerificationAcceptType } from '../types'

export class TutorRequestEntity extends BaseEntity<TutorRequestConstructorArgs> {
	constructor(data: TutorRequestConstructorArgs) {
		super(data)
	}
}

type TutorRequestConstructorArgs = {
	id: string
	userId: string
	topicId: string
	verification: MediaOutput
	qualification: MediaOutput[]
	pending: boolean
	accepted: VerificationAcceptType
	testId: string
	testFinished: boolean
	createdAt: number
	updatedAt: number
}
