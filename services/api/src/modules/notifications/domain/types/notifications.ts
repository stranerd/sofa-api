export enum NotificationType {
	ConnectRequested = 'ConnectRequested',
	ConnectAccepted = 'ConnectAccepted',
	ConnectDeclined = 'ConnectDeclined',
	VerificationAccepted = 'VerificationAccepted',
	VerificationRejected = 'VerificationRejected',
	TutorRequestAccepted = 'TutorRequestAccepted',
	TutorRequestRejected = 'TutorRequestRejected',
}

export type NotificationData =
	{ type: NotificationType.ConnectRequested, connectId: string, userId: string }
	| { type: NotificationType.ConnectAccepted, connectId: string, userId: string }
	| { type: NotificationType.ConnectDeclined, connectId: string, userId: string }
	| { type: NotificationType.VerificationAccepted, verificationId: string }
	| { type: NotificationType.VerificationRejected, verificationId: string }
	| { type: NotificationType.TutorRequestAccepted, tutorRequestId: string }
	| { type: NotificationType.TutorRequestRejected, tutorRequestId: string }