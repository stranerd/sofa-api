import { QueryParams, QueryResults } from 'equipped'
import { OrganizationMemberEntity } from '../entities/organizationMembers'

export interface IOrganizationMemberRepository {
	find: (id: string) => Promise<OrganizationMemberEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<OrganizationMemberEntity>>
	add: (data: { userId: string, organizationId: string, emails: string[] }) => Promise<OrganizationMemberEntity[]>
	request: (data: { email: string, organizationId: string, withPassword: boolean }) => Promise<OrganizationMemberEntity>
	accept: (data: { email: string, userId: string, organizationId: string, accept: boolean }) => Promise<boolean>
}