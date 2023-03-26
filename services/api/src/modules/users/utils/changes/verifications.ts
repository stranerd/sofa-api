import { AuthUsersUseCases } from '@modules/auth'
import { NotificationType, sendNotification } from '@modules/notifications'
import { appInstance } from '@utils/types'
import { AuthRole, DbChangeCallbacks } from 'equipped'
import { VerificationFromModel } from '../../data/models/verifications'
import { VerificationEntity } from '../../domain/entities/verifications'

export const VerificationDbChangeCallbacks: DbChangeCallbacks<VerificationFromModel, VerificationEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			'users/verifications', `users/verifications/${after.id}`,
			`users/verifications/${after.userId}`, `users/verifications/${after.id}/${after.userId}}`,
		], after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.created([
			'users/verifications', `users/verifications/${after.id}`,
			`users/verifications/${after.userId}`, `users/verifications/${after.id}/${after.userId}}`,
		], after)

		if (changes.pending && before.pending && !after.pending) {
			if (after.accepted) await AuthUsersUseCases.updateUserRole({
				userId: after.userId, roles: { [AuthRole.isVerified]: true }
			})

			await sendNotification([after.userId], {
				title: 'Verification Status',
				body: `Your verification request has been ${after.accepted ? 'accepted' : 'rejected'}`,
				sendEmail: true,
				data: {
					type: after.accepted ? NotificationType.VerificationAccepted : NotificationType.VerificationRejected,
					verificationId: after.id
				}
			})
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			'users/verifications', `users/verifications/${before.id}`,
			`users/verifications/${before.userId}`, `users/verifications/${before.id}/${before.userId}}`,
		], before)
	}
}
