import { BaseMapper } from 'equipped'
import { ScheduleEntity } from '../../domain/entities/schedules'
import { ScheduleFromModel, ScheduleToModel } from '../models/schedules'

export class ScheduleMapper extends BaseMapper<ScheduleFromModel, ScheduleToModel, ScheduleEntity> {
	mapFrom (model: ScheduleFromModel | null) {
		if (!model) return null
		const { _id, organizationId, classId, lessonId, user, title, status, time, createdAt, updatedAt } = model
		return new ScheduleEntity({
			id: _id.toString(), organizationId, classId, lessonId, user,
			title, status, time, createdAt, updatedAt
		})
	}

	mapTo (entity: ScheduleEntity) {
		return {
			title: entity.title,
			classId: entity.classId,
			organizationId: entity.organizationId,
			lessonId: entity.lessonId,
			time: entity.time,
			user: entity.user
		}
	}
}
