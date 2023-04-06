import { appInstance } from '@utils/types'
import { AnswerDbChangeCallbacks } from '../../utils/changes/answers'
import { AnswerMapper } from '../mappers/answers'
import { AnswerFromModel } from '../models/answers'

const Schema = new appInstance.dbs.mongo.Schema<AnswerFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	gameId: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	data: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: {}
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

export const Answer = appInstance.dbs.mongo.use('plays').model<AnswerFromModel>('GameAnswer', Schema)

export const AnswerChange = appInstance.dbs.mongo.change(Answer, AnswerDbChangeCallbacks, new AnswerMapper().mapFrom)