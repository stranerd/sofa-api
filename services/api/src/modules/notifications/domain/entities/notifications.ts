import { BaseEntity } from 'equipped'

import { Purchasables } from '@modules/payment'

import type { NotificationData } from '../types'
import { NotificationType } from '../types'

export class NotificationEntity extends BaseEntity<NotificationConstructorArgs> {
	constructor(data: NotificationConstructorArgs) {
		super(data)
	}

	get link() {
		const not = this.data

		if (not.type === NotificationType.VerificationAccepted) return '/settings/profile'
		else if (not.type === NotificationType.VerificationRejected) return '/settings/profile'
		else if (not.type === NotificationType.TutorRequestAccepted) return '/settings/profile'
		else if (not.type === NotificationType.TutorRequestRejected) return '/settings/profile'
		else if (not.type === NotificationType.NewPurchase) return '/settings/wallet'
		else if (not.type === NotificationType.NewPurchased) {
			if (not.purchasedType === Purchasables.courses) return `/study/courses/${not.purchasedId}`
		} else if (not.type === NotificationType.TutorAddedToConversation) return `/chats/${not.conversationId}`
		else if (not.type === NotificationType.UserJoinedGame) return `/plays/games/${not.gameId}/lobby`
		else if (not.type === NotificationType.WithdrawalSuccessful) return '/settings/wallet'
		else if (not.type === NotificationType.WithdrawalFailed) return '/settings/wallet'
		else if (not.type === NotificationType.WalletFundSuccessful) return '/settings/wallet'
		else if (not.type === NotificationType.SubscriptionSuccessful) return '/settings/subscription'
		else if (not.type === NotificationType.SubscriptionFailed) return '/settings/subscription'
		else if (not.type === NotificationType.GenericSubscriptionSuccessful) return '/settings/wallet'
		else if (not.type === NotificationType.GenericSubscriptionFailed) return '/settings/wallet'
		else if (not.type === NotificationType.NewQuizAccessRequest) return `/study/quizzes/${not.quizId}/edit`
		else if (not.type === NotificationType.QuizAccessRequestGranted) return `/study/quizzes/${not.quizId}/edit`
		else if (not.type === NotificationType.QuizAccessRequestRejected) return `/study/quizzes/${not.quizId}`
		else if (not.type === NotificationType.QuizAccessMemberGranted) return `/study/quizzes/${not.quizId}/edit`
		else if (not.type === NotificationType.QuizAccessMemberRebuked) return `/study/quizzes/${not.quizId}`

		return '/dashboard'
	}
}

type NotificationConstructorArgs = {
	id: string
	title: string
	body: string
	userId: string
	data: NotificationData
	createdAt: number
	seen: boolean
	updatedAt: number
	sendEmail: boolean
}
