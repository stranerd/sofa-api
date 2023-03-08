import { appInstance } from '@utils/types'
import { NotificationDbChangeCallbacks } from '../../utils/changes/notifications'
import { NotificationMapper } from '../mappers/notifications'
import { NotificationFromModel } from '../models/notifications'

const NotificationSchema = new appInstance.dbs.mongo.Schema<NotificationFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.toString()
	},
	title: {
		type: String,
		required: false,
		default: ''
	},
	body: {
		type: String,
		required: true
	},
	seen: {
		type: Boolean,
		required: false,
		default: false
	},
	sendEmail: {
		type: Boolean,
		required: false,
		default: false
	},
	data: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true,
		default: {}
	},
	userId: {
		type: String,
		required: true
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Notification = appInstance.dbs.mongo.use('notifications').model<NotificationFromModel>('Notification', NotificationSchema)

export const NotificationChange = appInstance.dbs.mongo.change(Notification, NotificationDbChangeCallbacks, new NotificationMapper().mapFrom)