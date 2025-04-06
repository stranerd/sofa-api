import type { DbChangeCallbacks } from 'equipped'

import { ConversationsUseCases } from '@modules/conversations'
import { CommentsUseCases, LikesUseCases, ReportsUseCases, ReviewsUseCases, ViewsUseCases } from '@modules/interactions'
import { AnnouncementsUseCases, ClassesUseCases, MembersUseCases, SchedulesUseCases } from '@modules/organizations'
import { PlaysUseCases } from '@modules/plays'
import { CoursesUseCases, FilesUseCases, FoldersUseCases, QuizzesUseCases } from '@modules/study'
import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'

import { ConnectsUseCases, UsersUseCases } from '../../'
import type { UserFromModel } from '../../data/models/users'
import type { UserEntity } from '../../domain/entities/users'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['users/users', `users/users/${after.id}`], after)

		const { results: members } = await MembersUseCases.get({
			where: [{ field: 'email', value: after.bio.email }],
		})

		await Promise.all([
			MembersUseCases.updateMemberUser({ email: after.bio.email, user: after.getEmbedded() }),
			UsersUseCases.updateOrganizationsIn({
				email: after.bio.email,
				add: true,
				organizations: members.map((member) => ({ id: member.organizationId, type: member.type })),
			}),
		])
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['users/users', `users/users/${after.id}`], { after, before })

		const updatedBioOrRoles = !!changes.bio || !!changes.roles || !!changes.type
		if (updatedBioOrRoles)
			await Promise.all(
				[
					ConversationsUseCases,
					CommentsUseCases,
					LikesUseCases,
					ReportsUseCases,
					ReviewsUseCases,
					ViewsUseCases,
					PlaysUseCases,
					CoursesUseCases,
					FoldersUseCases,
					QuizzesUseCases,
					FilesUseCases,
					ConnectsUseCases,
					AnnouncementsUseCases,
					ClassesUseCases,
					MembersUseCases,
					SchedulesUseCases,
				].map(async (useCase) => await useCase.updateUserBio(after.getEmbedded())),
			)

		if (changes.dates?.deletedAt && after.dates.deletedAt && !before.dates.deletedAt)
			await MembersUseCases.deleteByEmail(after.bio.email)
		if (changes.ai?.photo && before.ai.photo) await publishers.DELETEFILE.publish(before.ai.photo)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['users/users', `users/users/${before.id}`], before)
		await MembersUseCases.deleteByEmail(before.bio.email)
		if (before.ai.photo) await publishers.DELETEFILE.publish(before.ai.photo)
	},
}
