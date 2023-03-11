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
	public readonly user: EmbeddedUser
	public readonly tagId: Publishable['tagId']
	public readonly status: Publishable['status']
	public readonly price: Publishable['price']
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, description, photo, isPublic, questions, user, tagId, status, price, createdAt, updatedAt }: QuizConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.description = description
		this.photo = photo
		this.isPublic = isPublic
		this.questions = questions
		this.user = generateDefaultUser(user)
		this.tagId = tagId
		this.status = status
		this.price = price
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
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}