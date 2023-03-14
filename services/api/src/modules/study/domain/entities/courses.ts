import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, Media, Publishable, Saleable } from '../types'

export class CourseEntity extends BaseEntity implements Publishable, Saleable {
	public readonly id: string
	public readonly title: string
	public readonly description: string
	public readonly photo: Media | null
	public readonly isPublic: boolean
	public readonly user: EmbeddedUser
	public readonly tagId: Publishable['tagId']
	public readonly status: Publishable['status']
	public readonly price: Saleable['price']
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, description, photo, isPublic, user, tagId, status, price, createdAt, updatedAt }: CourseConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.description = description
		this.photo = photo
		this.isPublic = isPublic
		this.user = generateDefaultUser(user)
		this.tagId = tagId
		this.status = status
		this.price = price
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type CourseConstructorArgs = Publishable & Saleable & {
	id: string
	title: string
	description: string
	photo: Media | null
	isPublic: boolean
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}