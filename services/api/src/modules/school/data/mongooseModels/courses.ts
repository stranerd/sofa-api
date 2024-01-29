import { appInstance } from '@utils/types'
import { CourseDbChangeCallbacks } from '../../utils/changes/courses'
import { CourseMapper } from '../mappers/courses'
import { CourseFromModel } from '../models/courses'

const Schema = new appInstance.dbs.mongo.Schema<CourseFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		title: {
			type: String,
			required: true,
		},
		institutionId: {
			type: String,
			required: true,
		},
		facultyId: {
			type: String,
			required: false,
			default: null,
		},
		departmentId: {
			type: String,
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

export const Course = appInstance.dbs.mongo.use('school').model<CourseFromModel>('Course', Schema)

export const CourseChange = appInstance.dbs.mongo.change(Course, CourseDbChangeCallbacks, new CourseMapper().mapFrom)
