import { appInstance } from '@utils/types'
import { ConnectDbChangeCallbacks } from '../../utils/changes/connects'
import { ConnectMapper } from '../mappers/connects'
import { ConnectFromModel } from '../models/connects'

const ConnectSchema = new appInstance.dbs.mongo.Schema<ConnectFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	from: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	to: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	pending: {
		type: Boolean,
		required: false,
		default: true
	},
	accepted: {
		type: Boolean,
		required: false,
		default: false
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

export const Connect = appInstance.dbs.mongo.use('users').model<ConnectFromModel>('Connect', ConnectSchema)

export const ConnectChange = appInstance.dbs.mongo.change(Connect, ConnectDbChangeCallbacks, new ConnectMapper().mapFrom)