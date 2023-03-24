import { appInstance } from '@utils/types'
import { MessageDbChangeCallbacks } from '../../utils/changes/messages'
import { MessageMapper } from '../mappers/messages'
import { MessageFromModel } from '../models/messages'

const Schema = new appInstance.dbs.mongo.Schema<MessageFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	conversationId: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: false,
		default: ''
	},
	body: {
		type: String,
		required: false,
		default: ''
	},
	media: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	tags: {
		type: [String],
		required: false,
		default: []
	},
	starred: {
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
	},
	readAt: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: {}
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Message = appInstance.dbs.mongo.use('conversations').model<MessageFromModel>('Message', Schema)

export const MessageChange = appInstance.dbs.mongo.change(Message, MessageDbChangeCallbacks, new MessageMapper().mapFrom)