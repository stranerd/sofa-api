import { appInstance } from '@utils/types'
import { AnnouncementDbChangeCallbacks } from '../../utils/changes/announcements'
import { AnnouncementMapper } from '../mappers/announcements'
import { AnnouncementFromModel } from '../models/announcements'

const AnnouncementSchema = new appInstance.dbs.mongo.Schema<AnnouncementFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		organizationId: {
			type: String,
			required: true,
		},
		classId: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		user: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		filter: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		readAt: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: () => ({}),
		},
		createdAt: {
			type: Number,
			required: false,
			default: Date.now,
		},
		updatedAt: {
			type: Number,
			required: false,
			default: Date.now,
		},
	},
	{ timestamps: { currentTime: Date.now }, minimize: false },
)

export const Announcement = appInstance.dbs.mongo.use('organizations').model<AnnouncementFromModel>('Announcement', AnnouncementSchema)

export const AnnouncementChange = appInstance.dbs.mongo.change(
	Announcement,
	AnnouncementDbChangeCallbacks,
	new AnnouncementMapper().mapFrom,
)
