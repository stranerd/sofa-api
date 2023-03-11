import { canAccessQuiz } from '@modules/study'
import { appInstance } from '@utils/types'
import { OnJoinFn } from 'equipped'

export const registerSockets = () => {
	// const isAdmin: OnJoinFn = async ({ channel, user }) => user?.roles?.[AuthRole.isAdmin] ? channel : null
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	// const isSubbed: OnJoinFn = async ({ channel, user }) => user?.roles[AuthRole.isSubscribed] ? channel : null
	const isOpen: OnJoinFn = async ({ channel }) => channel
	const quizQuestionsCb: OnJoinFn = async (data, params) => {
		const { quizId = null } = params
		if (!quizId || !data.user) return null
		const hasAccess = await canAccessQuiz(quizId, data.user.id)
		return hasAccess ? await isOpen(data, params) : null
	}

	appInstance.listener
		.register('interactions/comments', isOpen)
		.register('interactions/likes', isOpen)
		.register('interactions/tags', isOpen)
		.register('interactions/views', isOpen)

		.register('notifications/notifications', isMine)

		.register('payment/plans', isOpen)
		.register('payment/transactions', isMine)
		.register('payment/methods', isMine)
		.register('payment/wallets', isMine)

		.register('school/courses', isOpen)
		.register('school/departments', isOpen)
		.register('school/faculties', isOpen)
		.register('school/institutions', isOpen)

		.register('study/folders', isMine)
		.register('study/quizzes', isOpen)
		.register('study/:quizId/questions', quizQuestionsCb)

		.register('users/users', isOpen)
		.register('users/connects', isMine)
}