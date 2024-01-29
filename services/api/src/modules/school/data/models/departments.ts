export interface DepartmentFromModel extends DepartmentToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface DepartmentToModel {
	title: string
	institutionId: string
	facultyId: string
}
