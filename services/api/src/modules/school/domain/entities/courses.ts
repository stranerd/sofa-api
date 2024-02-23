import { BaseEntity } from 'equipped'

export class CourseEntity extends BaseEntity<CourseConstructorArgs> {
	constructor(data: CourseConstructorArgs) {
		super(data)
	}
}

type CourseConstructorArgs = {
	id: string
	title: string
	institutionId: string
	facultyId: string | null
	departmentId: string | null
	createdAt: number
	updatedAt: number
}
