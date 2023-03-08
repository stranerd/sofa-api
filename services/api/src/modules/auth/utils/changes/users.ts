import { UsersUseCases } from '@modules/users'
import { isProd } from '@utils/environment'
import { publishers } from '@utils/events'
import { DbChangeCallbacks, deleteCachedAccessToken } from 'equipped'
import { UserFromModel } from '../../data/models/users'
import { AuthUserEntity } from '../../domain/entities/users'
import { subscribeToMailingList } from '../mailing'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, AuthUserEntity> = {
	created: async ({ after }) => {
		await UsersUseCases.createOrUpdateUser({
			id: after.id,
			timestamp: after.signedUpAt,
			data: {
				name: after.allNames,
				email: after.email,
				description: after.description,
				phone: after.phone,
				photo: after.photo
			}
		})
		await UsersUseCases.updateRoles({ id: after.id, data: after.roles, timestamp: Date.now() })
		if (isProd) await subscribeToMailingList(after.email)
	},
	updated: async ({ before, after, changes }) => {
		if (changes.photo && before.photo) await publishers.DELETEFILE.publish(before.photo)

		const updatedBio = AuthUserEntity.bioKeys().some((key) => changes[key])
		if (updatedBio) await UsersUseCases.createOrUpdateUser({
			id: after.id,
			timestamp: Date.now(),
			data: {
				name: after.allNames,
				email: after.email,
				description: after.description,
				phone: after.phone,
				photo: after.photo
			}
		})

		const updatedRoles = changes.roles
		if (updatedRoles) await UsersUseCases.updateRoles({ id: after.id, data: after.roles, timestamp: Date.now() })
		if (updatedRoles) await deleteCachedAccessToken(after.id)
	},
	deleted: async ({ before }) => {
		if (before.photo) await publishers.DELETEFILE.publish(before.photo)
		await UsersUseCases.markDeleted({ id: before.id, timestamp: Date.now() })
	}
}