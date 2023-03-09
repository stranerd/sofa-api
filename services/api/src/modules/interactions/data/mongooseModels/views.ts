import { appInstance } from '@utils/types'
import { ViewDbChangeCallbacks } from '../../utils/changes/views'
import { ViewFromModel } from '../models/views'
import { ViewMapper } from './../mappers/views'

const ViewSchema = new appInstance.dbs.mongo.Schema<ViewFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	entity: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	user: {
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

export const View = appInstance.dbs.mongo.use('interactions').model<ViewFromModel>('View', ViewSchema)

export const ViewChange = appInstance.dbs.mongo.change(View, ViewDbChangeCallbacks, new ViewMapper().mapFrom)