import { appInstance } from '@utils/types'
import { CardDbChangeCallbacks } from '../../utils/changes/cards'
import { CardMapper } from '../mappers/cards'
import { CardFromModel } from '../models/cards'

const Schema = new appInstance.dbs.mongo.Schema<CardFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	title: {
		type: String,
		required: true
	},
	set: {
		type: [Object],
		required: true
	},
	user: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	tagId: {
		type: String,
		required: true
	},
	price: {
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

export const Card = appInstance.dbs.mongo.use('study').model<CardFromModel>('Card', Schema)

export const CardChange = appInstance.dbs.mongo.change(Card, CardDbChangeCallbacks, new CardMapper().mapFrom)