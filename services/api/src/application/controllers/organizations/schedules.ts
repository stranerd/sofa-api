import { ClassesUseCases, SchedulesUseCases, canAccessOrgClasses } from '@modules/organizations'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class SchedulesController {
	private static schema = () => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		time: Schema.object({ start: Schema.number(), end: Schema.number() }).custom((v) => v.end > v.start, 'end must be after start'),
	})

	static async find(req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (!hasAccess?.role) throw new NotAuthorizedError()

		const schedule = await SchedulesUseCases.find(req.params.id)
		if (!schedule || schedule.organizationId !== req.params.organizationId || schedule.classId !== req.params.classId) return null
		return schedule
	}

	static async get(req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (!hasAccess?.role) throw new NotAuthorizedError()

		const query = req.query as QueryParams
		query.authType = QueryKeys.and
		query.auth = [
			{ field: 'organizationId', value: req.params.organizationId },
			{ field: 'classId', value: req.params.classId },
		]
		return await SchedulesUseCases.get(query)
	}

	static async create(req: Request) {
		const data = validate(
			{
				...this.schema(),
				lessonId: Schema.string().min(1),
			},
			req.body,
		)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin' && hasAccess?.role !== 'teacher') throw new NotAuthorizedError()
		const classIns = await ClassesUseCases.find(req.params.classId)
		const lesson = classIns?.getLesson(data.lessonId) ?? null
		if (!lesson || !lesson.users.teachers.includes(req.authUser!.id)) throw new NotAuthorizedError()

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await SchedulesUseCases.add({
			...data,
			user: user.getEmbedded(),
			organizationId: req.params.organizationId,
			classId: req.params.classId,
		})
	}

	static async update(req: Request) {
		const data = validate(this.schema(), req.body)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin' && hasAccess?.role !== 'teacher') throw new NotAuthorizedError()
		// TODO: check if user is teacher of lesson

		const schedule = await SchedulesUseCases.update({
			data,
			id: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId,
		})

		return schedule
	}

	static async delete(req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin' && hasAccess?.role !== 'teacher') throw new NotAuthorizedError()
		// TODO: check if user is teacher of lesson

		const isDeleted = await SchedulesUseCases.delete({
			id: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId,
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async start(req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin' && hasAccess?.role !== 'teacher') throw new NotAuthorizedError()
		// TODO: check if user is teacher of lesson

		const updated = await SchedulesUseCases.start({
			organizationId: req.params.organizationId,
			classId: req.params.classId,
			id: req.params.id,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async end(req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin' && hasAccess?.role !== 'teacher') throw new NotAuthorizedError()
		// TODO: check if user is teacher of lesson

		const updated = await SchedulesUseCases.end({
			organizationId: req.params.organizationId,
			classId: req.params.classId,
			id: req.params.id,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}
