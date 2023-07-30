import { appInstance } from '@utils/types'
import { TutorRequestDbChangeCallbacks } from '../../utils/changes/tutorRequests'
import { TutorRequestMapper } from '../mappers/tutorRequests'
import { TutorRequestFromModel } from '../models/tutorRequests'

const TutorRequestSchema = new appInstance.dbs.mongo.Schema<TutorRequestFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	userId: {
		type: String,
		required: true
	},
	topicId: {
		type: String,
		required: true
	},
	verification: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	qualification: {
		type: [appInstance.dbs.mongo.Schema.Types.Mixed] as unknown as TutorRequestFromModel['qualification'],
		required: true
	},
	pending: {
		type: Boolean,
		required: false,
		default: true
	},
	accepted: {
		type: Boolean,
		required: false,
		default: false
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

export const TutorRequest = appInstance.dbs.mongo.use('users').model<TutorRequestFromModel>('TutorRequest', TutorRequestSchema)

export const TutorRequestChange = appInstance.dbs.mongo.change(TutorRequest, TutorRequestDbChangeCallbacks, new TutorRequestMapper().mapFrom)