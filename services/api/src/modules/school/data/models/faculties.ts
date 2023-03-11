export interface FacultyFromModel extends FacultyToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface FacultyToModel {
	title: string
	institutionId: string
}