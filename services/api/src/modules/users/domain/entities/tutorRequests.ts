import { BaseEntity, MediaOutput } from 'equipped'

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
	accepted: boolean
	testId: string
	testFinished: boolean
	createdAt: number
	updatedAt: number
}
