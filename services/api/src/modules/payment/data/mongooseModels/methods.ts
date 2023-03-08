import { appInstance } from '@utils/types'
import { MethodDbChangeCallbacks } from '../../utils/changes/methods'
import { MethodMapper } from '../mappers/methods'
import { MethodFromModel } from '../models/methods'

const MethodSchema = new appInstance.dbs.mongo.Schema<MethodFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	userId: {
		type: String,
		required: true
	},
	primary: {
		type: Boolean,
		required: true,
		default: false
	},
	token: {
		type: String,
		required: true
	},
	data: {
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

export const Method = appInstance.dbs.mongo.use('payment').model<MethodFromModel>('Method', MethodSchema)

export const MethodChange = appInstance.dbs.mongo.change(Method, MethodDbChangeCallbacks, new MethodMapper().mapFrom)