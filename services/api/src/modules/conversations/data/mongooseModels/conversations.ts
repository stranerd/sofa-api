import { appInstance } from '@utils/types'
import { ConversationDbChangeCallbacks } from '../../utils/changes/conversations'
import { ConversationMapper } from '../mappers/conversations'
import { ConversationFromModel } from '../models/conversations'

const Schema = new appInstance.dbs.mongo.Schema<ConversationFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	title: {
		type: String,
		required: false,
		default: ''
	},
	user: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
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

export const Conversation = appInstance.dbs.mongo.use('conversations').model<ConversationFromModel>('Conversation', Schema)

export const ConversationChange = appInstance.dbs.mongo.change(Conversation, ConversationDbChangeCallbacks, new ConversationMapper().mapFrom)