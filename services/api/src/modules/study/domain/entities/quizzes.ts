import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, Media, Publishable } from '../types'

export class QuizEntity extends BaseEntity implements Publishable {
	public readonly id: string
	public readonly title: string
	public readonly description: string
	public readonly photo: Media | null
	public readonly isPublic: boolean
	public readonly questions: string[]
	public readonly courseId: string | null
	public readonly user: EmbeddedUser
	public readonly tagId: Publishable['tagId']
	public readonly status: Publishable['status']
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

type QuizConstructorArgs = Publishable & {
	id: string
	title: string
	description: string
	photo: Media | null
	isPublic: boolean
	questions: string[]
	courseId: string | null
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}