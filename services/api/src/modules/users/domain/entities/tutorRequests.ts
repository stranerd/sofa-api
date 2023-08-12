import { BaseEntity, MediaOutput } from 'equipped'

export class TutorRequestEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly topicId: string
	public readonly verification: MediaOutput
	public readonly qualification: MediaOutput[]
	public readonly pending: boolean
	public readonly accepted: boolean
	public readonly testId: string
	public readonly testFinished: boolean
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, userId, topicId, verification, qualification, pending, accepted, testId, testFinished, createdAt, updatedAt }: TutorRequestConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.topicId = topicId
		this.verification = verification
		this.qualification = qualification
		this.pending = pending
		this.accepted = accepted
		this.testId = testId
		this.testFinished = testFinished
		this.createdAt = createdAt
		this.updatedAt = updatedAt
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