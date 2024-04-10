import { appInstance } from '@utils/types'
import { PlayStatus, PlayTiming } from '../../domain/types'
import { PlaysDbChangeCallbacks } from '../../utils/changes/plays'
import { PlayMapper } from '../mappers/plays'
import { PlayFromModel } from '../models/plays'

const Schema = new appInstance.dbs.mongo.Schema<PlayFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		title: {
			type: String,
			required: false,
			default: '',
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
		sources: {
			type: [appInstance.dbs.mongo.Schema.Types.Mixed] as unknown as PlayFromModel['sources'],
			required: false,
			default: [],
		},
		totalTimeInSec: {
			type: Number,
			required: false,
			default: 0,
		},
		timing: {
			type: String,
			required: false,
			default: PlayTiming.perQuestion,
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
