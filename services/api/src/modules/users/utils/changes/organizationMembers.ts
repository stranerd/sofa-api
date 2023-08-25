import { UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { OrganizationMemberFromModel } from '../../data/models/organizationMembers'
import { OrganizationMemberEntity } from '../../domain/entities/organizationMembers'

export const OrganizationMemberDbChangeCallbacks: DbChangeCallbacks<OrganizationMemberFromModel, OrganizationMemberEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`users/organizations/${after.organizationId}/members`, `users/organizations/${after.organizationId}/members/${after.id}`
		], after)

		if (!after.pending && after.accepted?.is) await updateMetas(after, true)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.created([
			`users/organizations/${after.organizationId}/members`, `users/organizations/${after.organizationId}/members/${after.id}`
		], after)

		if (!after.pending && after.accepted?.is && before.pending && !after.accepted) await updateMetas(after, true)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			`users/organizations/${before.organizationId}/members`, `users/organizations/${before.organizationId}/members/${before.id}`
		], before)
		if (!before.pending && before.accepted?.is) await updateMetas(before, false)
	}
}

const updateMetas = async (member: OrganizationMemberEntity, add: boolean) => {
	await Promise.all([
		UsersUseCases.updateOrganizationsIn({ email: member.email, organizationIds: [member.organizationId], add }),
		UsersUseCases.incrementMeta({ id: member.organizationId, property: UserMeta.students, value: add ? 1 : -1 })
	])
}
