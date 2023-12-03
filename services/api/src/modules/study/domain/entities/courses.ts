import { Coursable, CourseMeta, CourseSections, Publishable, Saleable } from '../types'
import { PublishableEntity } from './coursables'

export class CourseEntity extends PublishableEntity implements Publishable, Saleable {
	public readonly coursables: { id: string, type: Coursable }[]
	public readonly sections: CourseSections
	public readonly frozen: Saleable['frozen']
	public readonly price: Saleable['price']
	public readonly meta: Record<CourseMeta, number>

	constructor (data: CourseConstructorArgs) {
		super(data)
		this.coursables = data.coursables
		this.sections = data.sections
		this.frozen = data.frozen
		this.price = data.price
		this.meta = data.meta
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
	meta: Record<CourseMeta, number>
	createdAt: number
	updatedAt: number
}