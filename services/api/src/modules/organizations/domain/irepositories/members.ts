import type { QueryParams, QueryResults } from 'equipped'

import type { MemberEntity } from '../entities/members'
import type { EmbeddedUser, MemberTypes } from '../types'

export interface IMemberRepository {
	find: (id: string) => Promise<MemberEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<MemberEntity>>
	add: (data: {
		organizationId: string
		members: { email: string; user: EmbeddedUser | null; type: MemberTypes }[]
	}) => Promise<MemberEntity[]>
	request: (data: {
		email: string
		user: EmbeddedUser | null
		type: MemberTypes
		organizationId: string
		withCode: boolean
	}) => Promise<MemberEntity>
	accept: (data: { email: string; type: MemberTypes; organizationId: string; accept: boolean }) => Promise<boolean>
	remove: (data: { organizationId: string; email: string; type: MemberTypes }) => Promise<boolean>
	aggregateMembersDays: () => Promise<Record<string, number>>
	deleteByEmail: (email: string) => Promise<boolean>
	updateMemberUser: (email: string, user: EmbeddedUser) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
}
