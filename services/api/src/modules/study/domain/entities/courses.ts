import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { Coursable, CourseSections, Publishable, Saleable } from '../types'

export class CourseEntity extends BaseEntity implements Publishable, Saleable {
	public readonly id: string
	public readonly coursables: { id: string, type: Coursable }[]
	public readonly sections: CourseSections
	public readonly title: Publishable['title']
	public readonly description: Publishable['description']
	public readonly photo: Publishable['photo']
	public readonly user: Publishable['user']
	public readonly topicId: Publishable['topicId']
	public readonly tagIds: Publishable['tagIds']
	public readonly status: Publishable['status']
	public readonly frozen: Saleable['frozen']
	public readonly price: Saleable['price']
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, coursables, sections, title, description, photo, user, topicId, tagIds, status, frozen, price, createdAt, updatedAt }: CourseConstructorArgs) {
		super()
		this.id = id
		this.coursables = coursables
		this.sections = sections
		this.title = title
		this.description = description
		this.photo = photo
		this.user = generateDefaultUser(user)
		this.topicId = topicId
		this.tagIds = tagIds
		this.status = status
		this.frozen = frozen
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
}

type CourseConstructorArgs = Publishable & Saleable & {
	id: string
	coursables: { id: string, type: Coursable }[]
	sections: CourseSections
	createdAt: number
	updatedAt: number
}