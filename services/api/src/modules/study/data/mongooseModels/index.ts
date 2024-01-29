import { appInstance } from '@utils/types'

export const PublishableSchema = {
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString(),
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
		default: '',
	},
	photo: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null,
	},
	user: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	topicId: {
		type: String,
		required: true,
	},
	tagIds: {
		type: [String],
		required: true,
		default: [],
	},
	ratings: {
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
}

export const SaleableSchema = {
	frozen: {
		type: Boolean,
		required: false,
		default: false,
	},
	price: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true,
	},
}

export const CoursableDataSchema = {
	...PublishableSchema,
	courseId: {
		type: String,
		required: false,
		default: null,
	},
}
