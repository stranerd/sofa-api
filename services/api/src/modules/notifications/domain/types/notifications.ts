export enum NotificationType {
	ConnectRequested = 'ConnectRequested',
	ConnectAccepted = 'ConnectAccepted',
	ConnectDeclined = 'ConnectDeclined',
}

export type NotificationData =
	{ type: NotificationType.ConnectRequested, connectId: string, userId: string }
	| { type: NotificationType.ConnectAccepted, connectId: string, userId: string }
	| { type: NotificationType.ConnectDeclined, connectId: string, userId: string }