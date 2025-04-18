import type { QueryParams } from 'equipped'

import { appInstance } from '@utils/types'

import type { INotificationRepository } from '../../domain/irepositories/notifications'
import { NotificationMapper } from '../mappers/notifications'
import type { NotificationToModel } from '../models/notifications'
import { Notification } from '../mongooseModels/notifications'

export class NotificationRepository implements INotificationRepository {
	private static instance: NotificationRepository
	private mapper = new NotificationMapper()

	static getInstance(): NotificationRepository {
		if (!NotificationRepository.instance) NotificationRepository.instance = new NotificationRepository()
		return NotificationRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Notification, query)
		return {
			...data,
			results: data.results.map((n) => this.mapper.mapFrom(n)!),
		}
	}

	async find(id: string) {
		const notification = await Notification.findById(id)
		return this.mapper.mapFrom(notification)
	}

	async create(data: NotificationToModel[]) {
		const notifications = await Notification.insertMany(data)
		return notifications.map((notification) => this.mapper.mapFrom(notification)!)
	}

	async markSeen(data: { userId: string; ids?: string[]; seen: boolean }) {
		await Notification.findOneAndUpdate(
			{
				userId: data.userId,
				...(data.ids ? { _id: { $in: data.ids } } : {}),
			},
			{ $set: { seen: data.seen } },
		)
	}

	async deleteOldSeen() {
		const weekInMs = 1000 * 60 * 60 * 24 * 7
		await Notification.deleteMany({
			seen: true,
			createdAt: { $lte: Date.now() - weekInMs },
		})
	}
}
