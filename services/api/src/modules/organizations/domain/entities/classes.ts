import { BaseEntity } from 'equipped'
import { EmbeddedUser, Media, Saleable } from '../types'

export class ClassEntity extends BaseEntity implements Saleable {
	public readonly id: string
	public readonly organizationId: string
	public readonly title: string
	public readonly description: string
	public readonly photo: Media | null
	public readonly user: EmbeddedUser
	public readonly frozen: Saleable['frozen']
	public readonly price: Saleable['price']
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, organizationId, title, description, photo, user, frozen, price, createdAt, updatedAt }: ClassConstructorArgs) {
		super()
		this.id = id
		this.organizationId = organizationId
		this.title = title
		this.description = description
		this.photo = photo
		this.user = user
		this.frozen = frozen
		this.price = price
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ClassConstructorArgs = Saleable & {
	id: string
	organizationId: string
	title: string
	description: string
	photo: Media | null
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}