import { BaseEntity, MediaOutput } from 'equipped'
import { VerificationAcceptType } from '../types'

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
