export interface FacultyFromModel extends FacultyToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface FacultyToModel {
	name: string
	institutionId: string
}