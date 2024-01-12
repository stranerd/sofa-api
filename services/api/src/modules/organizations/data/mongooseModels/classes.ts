import { appInstance } from '@utils/types'
import { ClassDbChangeCallbacks } from '../../utils/changes/classes'
import { ClassMapper } from '../mappers/classes'
import { ClassFromModel } from '../models/classes'

const ClassSchema = new appInstance.dbs.mongo.Schema<ClassFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	organizationId: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false
	},
	photo: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	user: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	frozen: {
		type: Boolean,
		required: false,
		default: false
	},
	price: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	lessons: {
		type: [appInstance.dbs.mongo.Schema.Types.Mixed] as unknown as ClassFromModel['lessons'],
		required: false,
		default: () => []
	},
	members: {
		students: {
			type: [String],
			required: false,
			default: () => []
		}
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

export const Class = appInstance.dbs.mongo.use('organizations').model<ClassFromModel>('Class', ClassSchema)

export const ClassChange = appInstance.dbs.mongo.change(Class, ClassDbChangeCallbacks, new ClassMapper().mapFrom)