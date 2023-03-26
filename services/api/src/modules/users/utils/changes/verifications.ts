import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { VerificationFromModel } from '../../data/models/verifications'
import { VerificationEntity } from '../../domain/entities/verifications'

export const VerificationDbChangeCallbacks: DbChangeCallbacks<VerificationFromModel, VerificationEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			'users/verifications', `users/verifications/${after.id}`,
			`users/verifications/${after.userId}`, `users/verifications/${after.id}/${after.userId}}`,
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.created([
			'users/verifications', `users/verifications/${after.id}`,
			`users/verifications/${after.userId}`, `users/verifications/${after.id}/${after.userId}}`,
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			'users/verifications', `users/verifications/${before.id}`,
			`users/verifications/${before.userId}`, `users/verifications/${before.id}/${before.userId}}`,
		], before)
	}
}
