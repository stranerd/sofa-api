import { Coursable, CourseMeta, CourseSections, Publishable, Saleable } from '../types'
import { PublishableEntity } from './coursables'

export class CourseEntity extends PublishableEntity<CourseConstructorArgs> implements Publishable, Saleable {
	constructor(data: CourseConstructorArgs) {
		super(data)
	}

	getCoursables() {
		const obj = {} as Record<Coursable, string[]>
		this.coursables.map(({ id, type }) => {
			;(obj[type] ||= []).push(id)
		})
		return obj
	}
}

type CourseConstructorArgs = Publishable &
	Saleable & {
		id: string
		coursables: { id: string; type: Coursable }[]
		sections: CourseSections
		meta: Record<CourseMeta, number>
		createdAt: number
		updatedAt: number
	}
