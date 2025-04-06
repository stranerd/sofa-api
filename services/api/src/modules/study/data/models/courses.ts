import type { CourseMeta, CourseSections, Publishable, Saleable } from '../../domain/types'

export interface CourseFromModel extends CourseToModel {
	_id: string
	sections: CourseSections
	meta: Record<CourseMeta, number>
	ratings: Publishable['ratings']
	createdAt: number
	updatedAt: number
}

export interface CourseToModel extends Omit<Publishable, 'ratings'>, Saleable {}
