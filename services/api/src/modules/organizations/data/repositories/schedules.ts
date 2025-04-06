import type { QueryParams } from 'equipped'

import { appInstance } from '@utils/types'

import type { IScheduleRepository } from '../../domain/irepositories/schedules'
import type { EmbeddedUser } from '../../domain/types'
import { ScheduleStatus } from '../../domain/types'
import { createLiveStream, endLiveStream } from '../../utils/livestreams'
import { ScheduleMapper } from '../mappers/schedules'
import type { ScheduleFromModel, ScheduleToModel } from '../models/schedules'
import { Schedule } from '../mongooseModels/schedules'

export class ScheduleRepository implements IScheduleRepository {
	private static instance: ScheduleRepository
	private mapper: ScheduleMapper

	private constructor() {
		this.mapper = new ScheduleMapper()
	}

	static getInstance() {
		if (!ScheduleRepository.instance) ScheduleRepository.instance = new ScheduleRepository()
		return ScheduleRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Schedule, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async add(data: ScheduleToModel) {
		const schedule = await new Schedule(data).save()
		return this.mapper.mapFrom(schedule)!
	}

	async find(id: string) {
		const schedule = await Schedule.findById(id)
		return this.mapper.mapFrom(schedule)
	}

	async update(organizationId: string, classId: string, id: string, data: Partial<ScheduleToModel>, lessons: string[] | undefined) {
		const schedule = await Schedule.findOneAndUpdate(
			{
				_id: id,
				organizationId,
				classId,
				...(lessons ? { lessonId: { $in: lessons } } : {}),
			},
			{ $set: data },
			{ new: true },
		)
		return this.mapper.mapFrom(schedule)
	}

	async updateUserBio(user: EmbeddedUser) {
		const schedules = await Schedule.updateMany({ 'user.id': user.id }, { $set: { user } })
		return schedules.acknowledged
	}

	async delete(organizationId: string, classId: string, id: string, lessons: string[] | undefined) {
		const schedule = await Schedule.findOneAndDelete({
			_id: id,
			organizationId,
			classId,
			...(lessons ? { lessonId: { $in: lessons } } : {}),
		})
		return !!schedule
	}

	async start(organizationId: string, classId: string, id: string, lessons: string[] | undefined) {
		let res = null as ScheduleFromModel | null
		await Schedule.collection.conn.transaction(async (session) => {
			const schedule = this.mapper.mapFrom(
				await Schedule.findOne(
					{
						_id: id,
						organizationId,
						classId,
						...(lessons ? { lessonId: { $in: lessons } } : {}),
					},
					{},
					{ session },
				),
			)
			if (!schedule || schedule.status !== ScheduleStatus.created) return res
			return (res = await Schedule.findByIdAndUpdate(
				schedule.id,
				{ $set: { status: ScheduleStatus.started, stream: await createLiveStream(schedule) } },
				{ session, new: true },
			))
		})
		return this.mapper.mapFrom(res)
	}

	async end(organizationId: string, classId: string, id: string, lessons: string[] | undefined) {
		let res = null as ScheduleFromModel | null
		await Schedule.collection.conn.transaction(async (session) => {
			const schedule = this.mapper.mapFrom(
				await Schedule.findOne(
					{
						_id: id,
						organizationId,
						classId,
						...(lessons ? { lessonId: { $in: lessons } } : {}),
					},
					{},
					{ session },
				),
			)
			if (!schedule || schedule.status !== ScheduleStatus.started) return res
			const canWatch = await endLiveStream(schedule).catch(() => null)
			return (res = await Schedule.findByIdAndUpdate(
				schedule.id,
				{ $set: { status: ScheduleStatus.ended, 'stream.canRewatch': canWatch } },
				{ session, new: true },
			))
		})
		return this.mapper.mapFrom(res)
	}

	async deleteLessonSchedules(organizationId: string, classId: string, lessonId: string) {
		const schedules = await Schedule.deleteMany({ organizationId, classId, lessonId })
		return schedules.acknowledged
	}
}
