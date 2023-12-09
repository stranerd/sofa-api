import { appInstance } from '@utils/types'
import { LessonDbChangeCallbacks } from '../../utils/changes/lessons'
import { LessonMapper } from '../mappers/lessons'
import { LessonFromModel } from '../models/lessons'

const LessonSchema = new appInstance.dbs.mongo.Schema<LessonFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	organizationId: {
		type: String,
		required: true
	},
	classId: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	users: {
		teachers: {
			type: [String],
			required: false,
			default: []
		},
		students: {
			type: [String],
			required: false,
			default: []
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

export const Lesson = appInstance.dbs.mongo.use('organizations').model<LessonFromModel>('Lesson', LessonSchema)

export const LessonChange = appInstance.dbs.mongo.change(Lesson, LessonDbChangeCallbacks, new LessonMapper().mapFrom)