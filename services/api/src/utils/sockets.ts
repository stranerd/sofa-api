import type { OnJoinFn } from 'equipped'
import { AuthRole } from 'equipped'

import { canAccessConversation } from '@modules/conversations'
import { canAccessOrgClasses, canAccessOrgMembers } from '@modules/organizations'
import { Coursable, canAccessCoursable } from '@modules/study'
import { appInstance } from '@utils/types'

export const registerSockets = () => {
	const isAdmin: OnJoinFn = async ({ channel, user }) => (user?.roles?.[AuthRole.isAdmin] ? channel : null)
	const isAdminOrMine: OnJoinFn = async ({ channel, user }) =>
		!user ? null : user.roles?.[AuthRole.isAdmin] ? channel : `${channel}/${user.id}`
	const isMine: OnJoinFn = async ({ channel, user }) => (user ? `${channel}/${user.id}` : null)
	// const isSubbed: OnJoinFn = async ({ channel, user }) => user?.roles[AuthRole.isSubscribed] ? channel : null
	const isOpen: OnJoinFn = async ({ channel }) => channel
	const conversationsCb: OnJoinFn = async (data, params, query) => {
		const { conversationId = null } = params
		if (!conversationId || !data.user) return null
		return (await canAccessConversation(conversationId, data.user.id)) ? await isOpen(data, params, query) : null
	}
	const coursablesCb: OnJoinFn = async (data, params, query) => {
		const { quizId = null } = params
		if (!quizId || !data.user) return null
		return (await canAccessCoursable(Coursable.quiz, quizId, data.user, query.access)) ? await isOpen(data, params, query) : null
	}
	const orgMembersCb: OnJoinFn = async (data, params, query) => {
		const { organizationId = null } = params
		if (!organizationId || !data.user) return null
		return (await canAccessOrgMembers(data.user, organizationId))
			? await isOpen(data, params, query)
			: `${data.channel}/${data.user.email}}`
	}
	const orgClassesCb: OnJoinFn = async (data, params, query) => {
		const { organizationId = null, classId = null } = params
		if (!organizationId || !classId || !data.user) return null
		return (await canAccessOrgClasses(data.user, organizationId, classId))?.role ? await isOpen(data, params, query) : null
	}

	appInstance.listener
		.register('conversations/conversations', isMine)
		.register('conversations/conversations/:conversationId/messages', conversationsCb)

		.register('interactions/comments', isOpen)
		.register('interactions/likes', isMine)
		.register('interactions/media', isOpen)
		.register('interactions/reports', isAdminOrMine)
		.register('interactions/reviews', isOpen)
		.register('interactions/tags', isOpen)
		.register('interactions/views', isMine)

		.register('notifications/notifications', isMine)

		.register('organizations/:organizationId/members', orgMembersCb)
		.register('organizations/classes', isOpen)
		.register('organizations/:organizationId/classes', isOpen)
		.register('organizations/:organizationId/classes/:classId/announcements', orgClassesCb)
		.register('organizations/:organizationId/classes/:classId/lessons', orgClassesCb)
		.register('organizations/:organizationId/classes/:classId/schedules', orgClassesCb)

		.register('payment/methods', isMine)
		.register('payment/purchases', isMine)
		.register('payment/plans', isOpen)
		.register('payment/transactions', isMine)
		.register('payment/wallets', isMine)
		.register('payment/withdrawals', isMine)

		.register('plays/plays', isMine)
		.register('plays/:type/:typeId/answers', isMine)

		.register('school/courses', isOpen)
		.register('school/departments', isOpen)
		.register('school/faculties', isOpen)
		.register('school/institutions', isOpen)

		.register('study/folders', isMine)
		.register('study/quizzes/tutors', isAdmin)
		.register('study/quizzes', isOpen)
		.register('study/quizzes/:quizId/questions', coursablesCb)
		.register('study/courses', isOpen)
		.register('study/files', isOpen)

		.register('users/connects', isMine)
		.register('users/users', isOpen)
		.register('users/verifications', isOpen)
		.register('users/tutorRequests', isOpen)
}
