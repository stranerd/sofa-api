import type { CourseMeta, CourseSections, Publishable, Saleable } from '../types'
import { Coursable } from '../types'
import { PublishableEntity } from './coursables'

export class CourseEntity extends PublishableEntity<CourseConstructorArgs> implements Publishable, Saleable {
	constructor(data: CourseConstructorArgs) {
		super(data)
	}

	getCoursables() {
		const quizzes = this.sections.flatMap((section) =>
			section.items.filter((item) => item.type === Coursable.quiz).map((item) => item.id),
		)
		const files = this.sections.flatMap((section) =>
			section.items.filter((item) => item.type === Coursable.file).map((item) => item.id),
		)
		return [...quizzes.map((id) => ({ id, type: Coursable.quiz })), ...files.map((id) => ({ id, type: Coursable.file }))]
	}
}

type CourseConstructorArgs = Publishable &
	Saleable & {
		id: string
		sections: CourseSections
		meta: Record<CourseMeta, number>
		createdAt: number
		updatedAt: number
	}
