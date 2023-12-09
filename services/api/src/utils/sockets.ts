import { canAccessConversation } from '@modules/conversations'
import { canAccessOrgClasses, canAccessOrgMembers } from '@modules/organizations'
import { PlayTypes } from '@modules/plays'
import { Coursable, canAccessCoursable } from '@modules/study'
import { appInstance } from '@utils/types'
import { AuthRole, OnJoinFn } from 'equipped'

export const registerSockets = () => {
	const isAdmin: OnJoinFn = async ({ channel, user }) => user?.roles?.[AuthRole.isAdmin] ? channel : null
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	// const isSubbed: OnJoinFn = async ({ channel, user }) => user?.roles[AuthRole.isSubscribed] ? channel : null
	const isOpen: OnJoinFn = async ({ channel }) => channel
	const conversationsCb: OnJoinFn = async (data, params) => {
		const { conversationId = null } = params
		if (!conversationId || !data.user) return null
		return (await canAccessConversation(conversationId, data.user.id)) ? await isOpen(data, params) : null
	}
	const coursablesCb: OnJoinFn = async (data, params) => {
		const { quizId = null } = params
		if (!quizId || !data.user) return null
		return (await canAccessCoursable(Coursable.quiz, quizId, data.user)) ? await isOpen(data, params) : null
	}
	const orgMembersCb: OnJoinFn = async (data, params) => {
		const { organizationId = null } = params
		if (!organizationId || !data.user) return null
		return (await canAccessOrgMembers(data.user, organizationId)) ? await isOpen(data, params) : `${data.channel}/${data.user.email}}`
	}
	const orgClassesCb: OnJoinFn = async (data, params) => {
		const { organizationId = null, classId = null } = params
		if (!organizationId || !classId || !data.user) return null
		return (await canAccessOrgClasses(data.user, organizationId, classId)) ? await isOpen(data, params) : null
	}

	appInstance.listener
		.register('conversations/conversations', isMine)
		.register('conversations/conversations/:conversationId/messages', conversationsCb)
		.register('conversations/tutorRequests', isMine)

		.register('interactions/comments', isOpen)
		.register('interactions/likes', isOpen)
		.register('interactions/reports', isAdmin)
		.register('interactions/reviews', isOpen)
		.register('interactions/tags', isOpen)
		.register('interactions/views', isOpen)

		.register('notifications/notifications', isMine)

		.register('organizations/:organizationId/members', orgMembersCb)
		.register('organizations/:organizationId/classes', isOpen)
		.register('organizations/:organizationId/classes/:classId/announcements', orgClassesCb)

		.register('payment/methods', isMine)
		.register('payment/purchases', isMine)
		.register('payment/plans', isOpen)
		.register('payment/transactions', isMine)
		.register('payment/wallets', isMine)
		.register('payment/withdrawals', isMine)

		.register('plays/games', isMine)
		.register('plays/tests', isMine)

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


	Object.values(PlayTypes)
		.forEach((type) => appInstance.listener.register(`plays/${type}/:typeId/answers`, isOpen))
}