import { QueryParams, QueryResults } from 'equipped'
import { MemberEntity } from '../entities/members'
import { MemberTypes } from '../types'

export interface IMemberRepository {
	find: (id: string) => Promise<MemberEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<MemberEntity>>
	add: (data: { userId: string, organizationId: string, members: { email: string, userId: string | null, type: MemberTypes }[] }) => Promise<MemberEntity[]>
	request: (data: { email: string, userId: string | null, type: MemberTypes, organizationId: string, withCode: boolean }) => Promise<MemberEntity>
	accept: (data: { email: string, type: MemberTypes, userId: string, organizationId: string, accept: boolean }) => Promise<boolean>
	remove: (data: { userId: string | null, organizationId: string, email: string, type: MemberTypes }) => Promise<boolean>
	aggregateMembersDays: () => Promise<Record<string, number>>
	deleteByEmail: (email: string) => Promise<boolean>
}