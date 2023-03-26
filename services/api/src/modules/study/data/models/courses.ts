import { Coursable, CourseSections, Publishable, Saleable } from '../../domain/types'

export interface CourseFromModel extends CourseToModel {
	_id: string
	coursables: { id: string, type: Coursable }[]
	sections: CourseSections
	createdAt: number
	updatedAt: number
}

export interface CourseToModel extends Publishable, Saleable { }