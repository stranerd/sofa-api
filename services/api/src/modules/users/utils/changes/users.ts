import { ConversationsUseCases, TutorRequestsUseCases } from '@modules/conversations'
import { CommentsUseCases, LikesUseCases, ReportsUseCases, ReviewsUseCases, ViewsUseCases } from '@modules/interactions'
import { AnnouncementsUseCases, ClassesUseCases, MembersUseCases, SchedulesUseCases } from '@modules/organizations'
import { GamesUseCases } from '@modules/plays'
import { CoursesUseCases, FilesUseCases, FoldersUseCases, QuizzesUseCases } from '@modules/study'
import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { ConnectsUseCases, UsersUseCases } from '../../'
import { UserFromModel } from '../../data/models/users'
import { UserEntity } from '../../domain/entities/users'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['users/users', `users/users/${after.id}`], after)

		const { results: members } = await MembersUseCases.get({
			where: [{ field: 'email', value: after.bio.email }]
		})

		await Promise.all([
			MembersUseCases.updateMemberUser({ email: after.bio.email, user: after.getEmbedded() }),
			UsersUseCases.updateOrganizationsIn({
				email: after.bio.email, add: true,
				organizations: members.map((member) => ({ id: member.organizationId, type: member.type }))
			})
		])
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.created(['users/users', `users/users/${after.id}`], after)

		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([
			ConversationsUseCases, TutorRequestsUseCases,
			CommentsUseCases, LikesUseCases, ReportsUseCases, ReviewsUseCases, ViewsUseCases,
			GamesUseCases,
			CoursesUseCases, FoldersUseCases, QuizzesUseCases, FilesUseCases,
			ConnectsUseCases,
			AnnouncementsUseCases, ClassesUseCases, MembersUseCases, SchedulesUseCases
		].map(async (useCase) => await useCase.updateUserBio(after.getEmbedded())))

		if (changes.dates?.deletedAt && after.dates.deletedAt && !before.dates.deletedAt) await MembersUseCases.deleteByEmail(after.bio.email)
		if (changes.ai?.photo && before.ai.photo) await publishers.DELETEFILE.publish(before.ai.photo)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created(['users/users', `users/users/${before.id}`], before)
		await MembersUseCases.deleteByEmail(before.bio.email)
		if (before.ai.photo) await publishers.DELETEFILE.publish(before.ai.photo)
	}
}