import { BaseMapper } from 'equipped'
import { OrganizationMemberEntity } from '../../domain/entities/organizationMembers'
import { OrganizationMemberFromModel, OrganizationMemberToModel } from '../models/organizationMembers'

export class OrganizationMemberMapper extends BaseMapper<OrganizationMemberFromModel, OrganizationMemberToModel, OrganizationMemberEntity> {
	mapFrom (param: OrganizationMemberFromModel | null) {
		return !param ? null : new OrganizationMemberEntity({
			id: param._id.toString(),
			email: param.email,
			organizationId: param.organizationId,
			pending: param.pending,
			withCode: param.withCode,
			accepted: param.accepted,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: OrganizationMemberEntity) {
		return {
			email: param.email,
			organizationId: param.organizationId,
			pending: param.pending,
			withCode: param.withCode,
			accepted: param.accepted
		}
	}
}