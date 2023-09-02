import { ConversationsUseCases, ReviewsUseCases as CReviewsUseCases, TutorRequestsUseCases } from '@modules/conversations'
import { CommentsUseCases, LikesUseCases, ReviewsUseCases, ViewsUseCases } from '@modules/interactions'
import { GamesUseCases } from '@modules/plays'
import { CoursesUseCases, FilesUseCases, FoldersUseCases, QuizzesUseCases } from '@modules/study'
import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { ConnectsUseCases, OrganizationMembersUseCases, UsersUseCases } from '../../'
import { UserFromModel } from '../../data/models/users'
import { UserEntity } from '../../domain/entities/users'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['users/users', `users/users/${after.id}`], after)

		const { results: members } = await OrganizationMembersUseCases.get({
			where: [{ field: 'email', value: after.bio.email }]
		})

		await UsersUseCases.updateOrganizationsIn({
			email: after.bio.email, organizationIds: members.map((member) => member.organizationId), add: true
		})
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.created(['users/users', `users/users/${after.id}`], after)

		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([
			ConversationsUseCases, CReviewsUseCases, TutorRequestsUseCases,
			CommentsUseCases, LikesUseCases, ReviewsUseCases, ViewsUseCases,
			GamesUseCases,
			CoursesUseCases, FoldersUseCases, QuizzesUseCases, FilesUseCases,
			ConnectsUseCases,
		].map(async (useCase) => await useCase.updateUserBio(after.getEmbedded())))
		if (changes.ai?.photo && before.ai.photo) await publishers.DELETEFILE.publish(before.ai.photo)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created(['users/users', `users/users/${before.id}`], before)
		if (before.ai.photo) await publishers.DELETEFILE.publish(before.ai.photo)
	}
}