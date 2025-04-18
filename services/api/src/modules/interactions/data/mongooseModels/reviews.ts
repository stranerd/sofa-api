import { appInstance } from '@utils/types'

import { ReviewDbChangeCallbacks } from '../../utils/changes/reviews'
import { ReviewMapper } from '../mappers/reviews'
import type { ReviewFromModel } from '../models/reviews'

const ReviewSchema = new appInstance.dbs.mongo.Schema<ReviewFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		entity: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		user: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
		message: {
			type: String,
			required: false,
			default: '',
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
	{ minimize: false },
)

export const Review = appInstance.dbs.mongo.use('interactions').model<ReviewFromModel>('Review', ReviewSchema)

export const ReviewChange = appInstance.dbs.mongo.change(Review, ReviewDbChangeCallbacks, new ReviewMapper().mapFrom)
