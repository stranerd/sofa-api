import { NotificationsUseCases } from '@modules/notifications'
import { QueryParams, Request, Schema, validateReq } from 'equipped'

export class NotificationsController {
	static async getNotifications(req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await NotificationsUseCases.get(query)
	}

	static async findNotification(req: Request) {
		const notification = await NotificationsUseCases.find(req.params.id)
		if (!notification || notification.userId !== req.authUser!.id) return null
		return notification
	}

	static async markNotificationSeen(req: Request) {
		const data = validateReq({
			seen: Schema.boolean()
		}, req.body)

		await NotificationsUseCases.markSeen({
			ids: [req.params.id],
			userId: req.authUser!.id,
			seen: !!data.seen
		})

		return true
	}

	static async markAllNotificationsSeen(req: Request) {
		const { seen } = validateReq({
			seen: Schema.boolean()
		}, req.body)

		await NotificationsUseCases.markSeen({
			userId: req.authUser!.id, seen
		})

		return true
	}
}