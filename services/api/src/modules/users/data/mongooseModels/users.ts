import { appInstance } from '@utils/types'

import { UserMeta, UserRankings } from '../../domain/types'
import { UserDbChangeCallbacks } from '../../utils/changes/users'
import { UserMapper } from '../mappers/users'
import type { UserFromModel } from '../models/users'

const Meta = Object.fromEntries(
	Object.values(UserMeta).map((key) => [
		key,
		{
			type: Number,
			required: false,
			default: 0,
		},
	]),
)

const Rankings = Object.fromEntries(
	Object.values(UserRankings).map((key) => [
		key,
		{
			value: {
				type: Number,
				required: false,
				default: 0,
			},
			lastUpdatedAt: {
				type: Number,
				required: false,
				default: Date.now(),
			},
		},
	]),
)

const UserStreak = {
	count: {
		type: Number,
		required: false,
		default: 0,
	},
	longestStreak: {
		type: Number,
		required: false,
		default: 0,
	},
	lastEvaluatedAt: {
		type: Number,
		required: false,
		default: 0,
	},
}

const UserRatings = {
	total: {
		type: Number,
		required: false,
		default: 0,
	},
	count: {
		type: Number,
		required: false,
		default: 0,
	},
	avg: {
		type: Number,
		required: false,
		default: 0,
	},
}

const UserSchema = new appInstance.dbs.mongo.Schema<UserFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		bio: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		roles: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: {},
		},
		dates: {
			createdAt: {
				type: Number,
				required: false,
				default: Date.now,
			},
			deletedAt: {
				type: Number,
				required: false,
				default: null,
			},
		},
		status: {
			connections: {
				type: [String],
				required: false,
				default: [],
			},
			lastUpdatedAt: {
				type: Number,
				required: false,
				default: 0,
			},
		},
		account: {
			rankings: Rankings,
			meta: Meta,
			streak: UserStreak,
			ratings: UserRatings,
			organizationsIn: {
				type: [appInstance.dbs.mongo.Schema.Types.Mixed],
				required: false,
				default: [],
			},
			settings: {
				notifications: {
					type: Boolean,
					required: false,
					default: true,
				},
			},
			editing: {
				type: appInstance.dbs.mongo.Schema.Types.Mixed,
				required: false,
				default: () => ({}),
			},
			saved: Object.fromEntries(['classes'].map((key) => [key, { type: [String], required: false, default: [] }])),
		},
		type: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: null,
		},
		tutor: {
			conversations: {
				type: [String],
				required: false,
				default: [],
			},
			topics: {
				type: [String],
				required: false,
				default: [],
			},
		},
		ai: {
			photo: {
				type: appInstance.dbs.mongo.Schema.Types.Mixed,
				required: false,
				default: null,
			},
			name: {
				type: String,
				required: false,
				default: 'Dr. Stranerd',
			},
			tagline: {
				type: String,
				required: false,
				default: 'AI assistant',
			},
		},
		socials: {
			type: [appInstance.dbs.mongo.Schema.Types.Mixed as any],
			required: false,
			default: [],
		},
		location: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: null,
		},
	},
	{ minimize: false },
)

export const User = appInstance.dbs.mongo.use('users').model<UserFromModel>('User', UserSchema)

export const UserChange = appInstance.dbs.mongo.change(User, UserDbChangeCallbacks, new UserMapper().mapFrom)
