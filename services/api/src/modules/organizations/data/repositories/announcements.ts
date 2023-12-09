import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IAnnouncementRepository } from '../../domain/irepositories/announcements'
import { EmbeddedUser } from '../../domain/types'
import { AnnouncementMapper } from '../mappers/announcements'
import { AnnouncementToModel } from '../models/announcements'
import { Announcement } from '../mongooseModels/announcements'

export class AnnouncementRepository implements IAnnouncementRepository {
	private static instance: AnnouncementRepository
	private mapper: AnnouncementMapper

	private constructor () {
		this.mapper = new AnnouncementMapper()
	}

	static getInstance () {
		if (!AnnouncementRepository.instance) AnnouncementRepository.instance = new AnnouncementRepository()
		return AnnouncementRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Announcement, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: AnnouncementToModel) {
		const announcement = await new Announcement(data).save()
		return this.mapper.mapFrom(announcement)!
	}

	async find (id: string) {
		const announcement = await Announcement.findById(id)
		return this.mapper.mapFrom(announcement)
	}

	async update (organizationId: string, classId: string, id: string, data: Partial<AnnouncementToModel>) {
		const announcement = await Announcement.findOneAndUpdate({ _id: id, organizationId, classId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(announcement)
	}

	async updateUserBio (user: EmbeddedUser) {
		const announcements = await Announcement.updateMany({ 'user.id': user.id }, { $set: { user } })
		return announcements.acknowledged
	}

	async delete (organizationId: string, classId: string, id: string) {
		const announcement = await Announcement.findOneAndDelete({ _id: id, organizationId, classId })
		return !!announcement
	}

	async deleteClassAnnouncements (organizationId: string, classId: string) {
		const announcements = await Announcement.deleteMany({ organizationId, classId })
		return announcements.acknowledged
	}

	async markRead (organizationId: string, classId: string, userId: string) {
		const readAt = Date.now()
		const announcements = await Announcement.updateMany(
			{ organizationId, classId, [`readAt.${userId}`]: null },
			{ $set: { [`readAt.${userId}`]: readAt } }
		)
		return announcements.acknowledged
	}
}
