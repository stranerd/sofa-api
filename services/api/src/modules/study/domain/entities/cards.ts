import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, Publishable } from '../types'

export class CardEntity extends BaseEntity implements Publishable {
	public readonly id: string
	public readonly title: string
	public readonly set: { question: string, answer: string }[]
	public readonly user: EmbeddedUser
	public readonly tagId: Publishable['tagId']
	public readonly status: Publishable['status']
	public readonly price: Publishable['price']
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, set, user, tagId, status, price, createdAt, updatedAt }: CardConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.set = set
		this.user = generateDefaultUser(user)
		this.tagId = tagId
		this.status = status
		this.price = price
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type CardConstructorArgs = Publishable & {
	id: string
	title: string
	set: { question: string, answer: string }[]
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}