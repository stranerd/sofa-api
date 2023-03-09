export interface InstitutionFromModel extends InstitutionToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface InstitutionToModel {
	name: string
	isGateway: boolean
}