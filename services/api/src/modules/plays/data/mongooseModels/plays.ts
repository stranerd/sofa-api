import { appInstance } from '@utils/types'
import { PlayStatus } from '../../domain/types'
import { PlaysDbChangeCallbacks } from '../../utils/changes/plays'
import { PlayMapper } from '../mappers/plays'
import { PlayFromModel } from '../models/plays'

const Schema = new appInstance.dbs.mongo.Schema<PlayFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		quizId: {
			type: String,
			required: true,
		},
		user: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		data: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		status: {
			type: String,
			required: true,
			default: PlayStatus.created,
		},
		questions: {
			type: [String],
			required: false,
			default: [],
		},
		totalTimeInSec: {
			type: Number,
			required: false,
			default: 0,
		},
		scores: {
			type: [appInstance.dbs.mongo.Schema.Types.Mixed] as unknown as PlayFromModel['scores'],
			required: false,
			default: [],
		},
		startedAt: {
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

export const Play = appInstance.dbs.mongo.use('plays').model<PlayFromModel>('Play', Schema)

export const PlayChange = appInstance.dbs.mongo.change(Play, PlaysDbChangeCallbacks, new PlayMapper().mapFrom)
