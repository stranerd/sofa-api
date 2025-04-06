import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import { UsersUseCases } from '../../'
import type { ConnectFromModel } from '../../data/models/connects'
import type { ConnectEntity } from '../../domain/entities/connects'
import { UserMeta } from '../../domain/types'

export const ConnectDbChangeCallbacks: DbChangeCallbacks<ConnectFromModel, ConnectEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[
				`users/connects/${after.from.id}`,
				`users/connects/${after.to.id}`,
				`users/connects/${after.id}/${after.from.id}`,
				`users/connects/${after.id}/${after.to.id}`,
			],
			after,
		)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(
			[
				`users/connects/${after.from.id}`,
				`users/connects/${after.to.id}`,
				`users/connects/${after.id}/${after.from.id}`,
				`users/connects/${after.id}/${after.to.id}`,
			],
			{ after, before },
		)

		if (changes.pending && !after.pending)
			await Promise.all([
				after.accepted &&
					UsersUseCases.incrementMeta({
						id: after.from.id,
						property: UserMeta.connects,
						value: after.accepted ? 1 : -1,
					}),
				after.accepted &&
					UsersUseCases.incrementMeta({
						id: after.to.id,
						property: UserMeta.connects,
						value: after.accepted ? 1 : -1,
					}),
			])
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[
				`users/connects/${before.from.id}`,
				`users/connects/${before.to.id}`,
				`users/connects/${before.id}/${before.from.id}`,
				`users/connects/${before.id}/${before.to.id}`,
			],
			before,
		)

		if (before.accepted)
			await Promise.all([
				UsersUseCases.incrementMeta({ id: before.from.id, property: UserMeta.connects, value: -1 }),
				UsersUseCases.incrementMeta({ id: before.to.id, property: UserMeta.connects, value: -1 }),
			])
	},
}
