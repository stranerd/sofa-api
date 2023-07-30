import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { OrganizationMemberFromModel } from '../../data/models/organizationMembers'
import { OrganizationMemberEntity } from '../../domain/entities/organizationMembers'

export const OrganizationMemberDbChangeCallbacks: DbChangeCallbacks<OrganizationMemberFromModel, OrganizationMemberEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`users/organizationMembers/${after.organizationId}`, `users/organizationMembers/${after.organizationId}/${after.id}`
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.created([
			`users/organizationMembers/${after.organizationId}`, `users/organizationMembers/${after.organizationId}/${after.id}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			`users/organizationMembers/${before.organizationId}`, `users/organizationMembers/${before.organizationId}/${before.id}`
		], before)
	}
}
