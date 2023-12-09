import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IScheduleRepository } from '../../domain/irepositories/schedules'
import { EmbeddedUser } from '../../domain/types'
import { ScheduleMapper } from '../mappers/schedules'
import { ScheduleToModel } from '../models/schedules'
import { Schedule } from '../mongooseModels/schedules'

export class ScheduleRepository implements IScheduleRepository {
	private static instance: ScheduleRepository
	private mapper: ScheduleMapper

	private constructor () {
		this.mapper = new ScheduleMapper()
	}

	static getInstance () {
		if (!ScheduleRepository.instance) ScheduleRepository.instance = new ScheduleRepository()
		return ScheduleRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Schedule, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: ScheduleToModel) {
		const schedule = await new Schedule(data).save()
		return this.mapper.mapFrom(schedule)!
	}

	async find (id: string) {
		const schedule = await Schedule.findById(id)
		return this.mapper.mapFrom(schedule)
	}

	async update (id: string, organizationId: string, classId: string, data: Partial<ScheduleToModel>) {
		const schedule = await Schedule.findOneAndUpdate({ _id: id, organizationId, classId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(schedule)
	}

	async updateUserBio (user: EmbeddedUser) {
		const schedules = await Schedule.updateMany({ 'user.id': user.id }, { $set: { user } })
		return schedules.acknowledged
	}

	async delete (id: string, organizationId: string, classId: string) {
		const schedule = await Schedule.findOneAndDelete({ _id: id, organizationId, classId })
		return !!schedule
	}

	async deleteLessonSchedules (organizationId: string, classId: string, lessonId: string) {
		const schedules = await Schedule.deleteMany({ organizationId, classId, lessonId })
		return schedules.acknowledged
	}
}
