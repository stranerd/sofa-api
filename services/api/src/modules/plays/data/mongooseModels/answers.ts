import { appInstance } from '@utils/types'
import { AnswerDbChangeCallbacks } from '../../utils/changes/answers'
import { AnswerMapper } from '../mappers/answers'
import { AnswerFromModel } from '../models/answers'

const Schema = new appInstance.dbs.mongo.Schema<AnswerFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		type: {
			type: String,
			required: true,
		},
		typeId: {
			type: String,
			required: true,
		},
		typeUserId: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		data: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: {},
		},
		timedOutAt: {
			type: Number,
			required: false,
			default: null,
		},
		endedAt: {
			type: Number,
			required: false,
			default: null,
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

export const Answer = appInstance.dbs.mongo.use('plays').model<AnswerFromModel>('Answer', Schema)

export const AnswerChange = appInstance.dbs.mongo.change(Answer, AnswerDbChangeCallbacks, new AnswerMapper().mapFrom)
