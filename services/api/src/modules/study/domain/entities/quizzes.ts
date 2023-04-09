import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { CoursableData, QuizMeta } from '../types'

export class QuizEntity extends BaseEntity implements CoursableData {
	public readonly id: string
	public readonly questions: string[]
	public readonly title: CoursableData['title']
	public readonly description: CoursableData['description']
	public readonly photo: CoursableData['photo']
	public readonly courseId: CoursableData['courseId']
	public readonly user: CoursableData['user']
	public readonly topicId: CoursableData['topicId']
	public readonly tagIds: CoursableData['tagIds']
	public readonly status: CoursableData['status']
	public readonly meta: Record<QuizMeta, number>
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, description, photo, questions, courseId, user, topicId, tagIds, status, meta, createdAt, updatedAt }: QuizConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.description = description
		this.photo = photo
		this.questions = questions
		this.courseId = courseId
		this.user = generateDefaultUser(user)
		this.topicId = topicId
		this.tagIds = tagIds
		this.status = status
		this.meta = meta
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type QuizConstructorArgs = CoursableData & {
	id: string
	questions: string[]
	meta: Record<QuizMeta, number>
	createdAt: number
	updatedAt: number
}