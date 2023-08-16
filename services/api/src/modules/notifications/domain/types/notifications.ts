export enum NotificationType {
	VerificationAccepted = 'VerificationAccepted',
	VerificationRejected = 'VerificationRejected',
	TutorRequestAccepted = 'TutorRequestAccepted',
	TutorRequestRejected = 'TutorRequestRejected',
	TutorAddedToConversation = 'TutorAddedToConversation',
	UserJoinedGame = 'UserJoinedGame',
	NewPurchase = 'NewPurchase',
	NewPurchased = 'NewPurchased',
}

export type NotificationData =
	| { type: NotificationType.VerificationAccepted, verificationId: string }
	| { type: NotificationType.VerificationRejected, verificationId: string }
	| { type: NotificationType.TutorRequestAccepted, tutorRequestId: string }
	| { type: NotificationType.TutorRequestRejected, tutorRequestId: string }
	| { type: NotificationType.TutorAddedToConversation, conversationId: string, tutorId: string }
	| { type: NotificationType.UserJoinedGame, gameId: string, userId: string }
	| { type: NotificationType.NewPurchase, purchaseId: string, userId: string }
	| { type: NotificationType.NewPurchased, purchaseId: string, userId: string }