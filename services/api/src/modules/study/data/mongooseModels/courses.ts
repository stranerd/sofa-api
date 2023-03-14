import { appInstance } from '@utils/types'
import { CourseDbChangeCallbacks } from '../../utils/changes/courses'
import { CourseMapper } from '../mappers/courses'
import { CourseFromModel } from '../models/courses'

const Schema = new appInstance.dbs.mongo.Schema<CourseFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false,
		default: ''
	},
	photo: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	isPublic: {
		type: Boolean,
		required: false,
		default: false
	},
	user: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	tagId: {
		type: String,
		required: true
	},
	price: {
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

export const Course = appInstance.dbs.mongo.use('study').model<CourseFromModel>('Course', Schema)

export const CourseChange = appInstance.dbs.mongo.change(Course, CourseDbChangeCallbacks, new CourseMapper().mapFrom)