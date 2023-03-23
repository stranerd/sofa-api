import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { Coursable, Publishable, Saleable } from '../types'

export class CourseEntity extends BaseEntity implements Publishable, Saleable {
	public readonly id: string
	public readonly coursables: { id: string, type: Coursable }[]
	public readonly title: Publishable['title']
	public readonly description: Publishable['description']
	public readonly photo: Publishable['photo']
	public readonly isPublic: Publishable['isPublic']
	public readonly user: Publishable['user']
	public readonly tagId: Publishable['tagId']
	public readonly status: Publishable['status']
	public readonly price: Saleable['price']
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, coursables, title, description, photo, isPublic, user, tagId, status, price, createdAt, updatedAt }: CourseConstructorArgs) {
		super()
		this.id = id
		this.coursables = coursables
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

	getCoursables () {
		const obj = {} as Record<Coursable, string[]>
		this.coursables.map(({ id, type }) => {
			(obj[type] ||= []).push(id)
		})
		return obj
	}

	isFree () {
		return this.price.amount === 0
	}
}

type CourseConstructorArgs = Publishable & Saleable & {
	id: string
	coursables: { id: string, type: Coursable }[]
	createdAt: number
	updatedAt: number
}