import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IScheduleRepository } from '../../domain/irepositories/schedules'
import { ClassLessonable, EmbeddedUser, ScheduleStatus } from '../../domain/types'
import { createLiveStream, endLiveStream } from '../../utils/livestreams'
import { ScheduleMapper } from '../mappers/schedules'
import { ScheduleFromModel, ScheduleToModel } from '../models/schedules'
import { Class } from '../mongooseModels/classes'
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
		let res = false
		await Schedule.collection.conn.transaction(async (session) => {
			const schedule = await Schedule.findOneAndDelete(
				{
					_id: id,
					organizationId,
					classId,
					...(lessons ? { lessonId: { $in: lessons } } : {}),
				},
				{ session },
			)
			if (schedule) {
				const classInst = await Class.findOne({ _id: classId, organizationId }, {}, { session })
				if (classInst) {
					const updatedLessons = classInst.lessons.map((l) => ({
						...l,
						curriculum: l.curriculum.map((c) => ({
							...c,
							items: c.items.filter((i) => !(i.id === id && i.type === ClassLessonable.schedule)),
						})),
					}))
					await Class.findByIdAndUpdate(classId, { $set: { lessons: updatedLessons } }, { session })
				}
			}
			res = !!schedule
			return res
		})
		return res
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
			const stream = await endLiveStream(schedule)
			return (res = await Schedule.findByIdAndUpdate(
				schedule.id,
				{ $set: { status: ScheduleStatus.ended, 'stream.canRewatch': !!stream?.duration } },
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
