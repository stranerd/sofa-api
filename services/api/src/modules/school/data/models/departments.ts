export interface DepartmentFromModel extends DepartmentToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface DepartmentToModel {
	name: string
	institutionId: string
	facultyId: string
}