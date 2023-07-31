export interface OrganizationMemberFromModel extends OrganizationMemberToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface OrganizationMemberToModel {
	pending: boolean
	withCode: boolean
	accepted: { is: boolean, at: number } | null
	organizationId: string
	email: string
}