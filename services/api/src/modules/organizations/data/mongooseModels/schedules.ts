import { appInstance } from '@utils/types'
import { ScheduleStatus } from '../../domain/types'
import { ScheduleDbChangeCallbacks } from '../../utils/changes/schedules'
import { ScheduleMapper } from '../mappers/schedules'
import { ScheduleFromModel } from '../models/schedules'

const ScheduleSchema = new appInstance.dbs.mongo.Schema<ScheduleFromModel>({
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
	lessonId: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	user: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	time: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	status: {
		type: String,
		required: true,
		default: ScheduleStatus.created
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

export const Schedule = appInstance.dbs.mongo.use('organizations').model<ScheduleFromModel>('Schedule', ScheduleSchema)

export const ScheduleChange = appInstance.dbs.mongo.change(Schedule, ScheduleDbChangeCallbacks, new ScheduleMapper().mapFrom)