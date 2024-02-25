import { appInstance } from '@utils/types'
import { PlayStatus } from '../../domain/types'
import { TestDbChangeCallbacks } from '../../utils/changes/tests'
import { TestMapper } from '../mappers/tests'
import { TestFromModel } from '../models/tests'

const Schema = new appInstance.dbs.mongo.Schema<TestFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		quizId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			default: PlayStatus.started,
		},
		user: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
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
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: {},
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

export const Test = appInstance.dbs.mongo.use('plays').model<TestFromModel>('Test', Schema)

export const TestChange = appInstance.dbs.mongo.change(Test, TestDbChangeCallbacks, new TestMapper().mapFrom)
