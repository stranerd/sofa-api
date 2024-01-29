export interface CourseFromModel extends CourseToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface CourseToModel {
	title: string
	institutionId: string
	facultyId: string | null
	departmentId: string | null
}
