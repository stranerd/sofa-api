import type { Purchasables, Subscription } from '@modules/payment'

export enum NotificationType {
	VerificationAccepted = 'VerificationAccepted',
	VerificationRejected = 'VerificationRejected',
	TutorRequestAccepted = 'TutorRequestAccepted',
	TutorRequestRejected = 'TutorRequestRejected',
	TutorAddedToConversation = 'TutorAddedToConversation',
	UserJoinedGame = 'UserJoinedGame',
	NewPurchase = 'NewPurchase',
	NewPurchased = 'NewPurchased',
	WithdrawalSuccessful = 'WithdrawalSuccessful',
	WithdrawalFailed = 'WithdrawalFailed',
	WalletFundSuccessful = 'WalletFundSuccessful',
	SubscriptionSuccessful = 'SubscriptionSuccessful',
	SubscriptionFailed = 'SubscriptionFailed',
	GenericSubscriptionSuccessful = 'GenericSubscriptionSuccessful',
	GenericSubscriptionFailed = 'ClassSubscriptionFailed',
	NewQuizAccessRequest = 'NewQuizAccessRequest',
	QuizAccessRequestGranted = 'QuizAccessRequestGranted',
	QuizAccessRequestRejected = 'QuizAccessRequestRejected',
	QuizAccessMemberGranted = 'QuizAccessMemberGranted',
	QuizAccessMemberRebuked = 'QuizAccessMemberRebuked',
	ClassAnnouncementCreated = 'ClassAnnouncementCreated',
}

export type NotificationData =
	| { type: NotificationType.VerificationAccepted; verificationId: string }
	| { type: NotificationType.VerificationRejected; verificationId: string }
	| { type: NotificationType.TutorRequestAccepted; tutorRequestId: string }
	| { type: NotificationType.TutorRequestRejected; tutorRequestId: string }
	| { type: NotificationType.TutorAddedToConversation; conversationId: string; tutorId: string; accepted: boolean }
	| { type: NotificationType.UserJoinedGame; gameId: string; userId: string }
	| { type: NotificationType.NewPurchase; id: string; purchasedType: Purchasables; purchasedId: string; userId: string }
	| { type: NotificationType.NewPurchased; id: string; purchasedType: Purchasables; purchasedId: string; userId: string }
	| { type: NotificationType.WithdrawalSuccessful; withdrawalId: string; amount: number; currency: string }
	| { type: NotificationType.WithdrawalFailed; withdrawalId: string; amount: number; currency: string }
	| { type: NotificationType.WalletFundSuccessful; amount: number; currency: string }
	| { type: NotificationType.SubscriptionSuccessful; planId: string }
	| { type: NotificationType.SubscriptionFailed; planId: string }
	| { type: NotificationType.GenericSubscriptionSuccessful; data: Subscription['data'] }
	| { type: NotificationType.GenericSubscriptionFailed; data: Subscription['data'] }
	| { type: NotificationType.NewQuizAccessRequest; quizId: string; userIds: string[] }
	| { type: NotificationType.QuizAccessRequestGranted; quizId: string }
	| { type: NotificationType.QuizAccessRequestRejected; quizId: string }
	| { type: NotificationType.QuizAccessMemberGranted; quizId: string }
	| { type: NotificationType.QuizAccessMemberRebuked; quizId: string }
	| { type: NotificationType.ClassAnnouncementCreated; organizationId: string; classId: string; announcementId: string }
