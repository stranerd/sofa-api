import { UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { MembersUseCases } from '../..'
import { MemberFromModel } from '../../data/models/members'
import { MemberEntity } from '../../domain/entities/members'
import { MemberTypes } from '../../domain/types'

export const MemberDbChangeCallbacks: DbChangeCallbacks<MemberFromModel, MemberEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[
				`organizations/${after.organizationId}/members`,
				`organizations/${after.organizationId}/members/${after.id}`,
				`organizations/${after.organizationId}/members/${after.email}`,
				`organizations/${after.organizationId}/members/${after.id}/${after.email}`,
			],
			after,
		)

		if (!after.user) {
			const user = await UsersUseCases.findByEmail(after.email)
			if (user) await MembersUseCases.updateMemberUser({ email: after.email, user: user.getEmbedded() })
		}

		if (!after.pending && after.accepted?.is) await updateMetas(after, true)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			[
				`organizations/${after.organizationId}/members`,
				`organizations/${after.organizationId}/members/${after.id}`,
				`organizations/${after.organizationId}/members/${after.email}`,
				`organizations/${after.organizationId}/members/${after.id}/${after.email}`,
			],
			{ after, before },
		)

		if (!after.pending && after.accepted?.is && before.pending && !before.accepted) await updateMetas(after, true)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[
				`organizations/${before.organizationId}/members`,
				`organizations/${before.organizationId}/members/${before.id}`,
				`organizations/${before.organizationId}/members/${before.email}`,
				`organizations/${before.organizationId}/members/${before.id}/${before.email}`,
			],
			before,
		)
		if (!before.pending && before.accepted?.is) await updateMetas(before, false)
	},
}

const updateMetas = async (member: MemberEntity, add: boolean) => {
	await Promise.all([
		UsersUseCases.updateOrganizationsIn({
			email: member.email,
			organizations: [{ id: member.organizationId, type: member.type }],
			add,
		}),
		UsersUseCases.incrementMeta({
			id: member.organizationId,
			property: member.type === MemberTypes.teacher ? UserMeta.teachers : UserMeta.students,
			value: add ? 1 : -1,
		}),
	])
}
