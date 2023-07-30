export interface OrganizationMemberFromModel extends OrganizationMemberToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface OrganizationMemberToModel {
	pending: boolean
	withPassword: boolean
	accepted: number | null
	organizationId: string
	email: string
}