import { Coursable, CourseMeta, CourseSections, Publishable, Saleable } from '../../domain/types'

export interface CourseFromModel extends CourseToModel {
	_id: string
	coursables: { id: string, type: Coursable }[]
	sections: CourseSections
	meta: Record<CourseMeta, number>
	createdAt: number
	updatedAt: number
}

export interface CourseToModel extends Publishable, Saleable { }