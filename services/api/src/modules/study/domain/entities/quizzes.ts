import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { CoursableData } from '../types'

export class QuizEntity extends BaseEntity implements CoursableData {
	public readonly id: string
	public readonly questions: string[]
	public readonly title: CoursableData['title']
	public readonly description: CoursableData['description']
	public readonly photo: CoursableData['photo']
	public readonly isPublic: CoursableData['isPublic']
	public readonly courseId: CoursableData['courseId']
	public readonly user: CoursableData['user']
	public readonly tagId: CoursableData['tagId']
	public readonly status: CoursableData['status']
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, description, photo, isPublic, questions, courseId, user, tagId, status, createdAt, updatedAt }: QuizConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.description = description
		this.photo = photo
		this.isPublic = isPublic
		this.questions = questions
		this.courseId = courseId
		this.user = generateDefaultUser(user)
		this.tagId = tagId
		this.status = status
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type QuizConstructorArgs = CoursableData & {
	id: string
	questions: string[]
	createdAt: number
	updatedAt: number
}