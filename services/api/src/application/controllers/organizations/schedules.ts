import { SchedulesUseCases, canAccessOrgClasses } from '@modules/organizations'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class ScheduleController {
	private static schema = () => ({
		title: Schema.string().min(1),
		time: Schema.object({ start: Schema.number(), end: Schema.number() })
			.custom((v) => v.end > v.start, 'end must be after start')
	})

	static async find (req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (!hasAccess) throw new NotAuthorizedError()

		const schedule = await SchedulesUseCases.find(req.params.id)
		if (!schedule || schedule.organizationId !== req.params.organizationId || schedule.classId !== req.params.classId) return null
		return schedule
	}

	static async get (req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (!hasAccess) throw new NotAuthorizedError()

		const query = req.query as QueryParams
		query.authType = QueryKeys.and
		query.auth = [{ field: 'organizationId', value: req.params.organizationId }, { field: 'classId', value: req.params.classId }]
		return await SchedulesUseCases.get(query)
	}

	static async create (req: Request) {
		const data = validate({
			...this.schema(),
			lessonId: Schema.string().min(1)
		}, req.body)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (!hasAccess) throw new NotAuthorizedError()
		if (hasAccess !== 'admin' && hasAccess !== 'teacher') throw new NotAuthorizedError()
		// TODO: verify user is teacher in lesson

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		const schedule = await SchedulesUseCases.add({
			...data, user: user.getEmbedded(),
			organizationId: req.params.organizationId, classId: req.params.classId
		})

		return schedule
	}

	static async update (req: Request) {
		const data = validate(this.schema(), req.body)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (!hasAccess) throw new NotAuthorizedError()
		if (hasAccess !== 'admin' && hasAccess !== 'teacher') throw new NotAuthorizedError()
		// TODO: verify user is teacher in lesson

		const schedule = await SchedulesUseCases.update({
			data, id: req.params.id,
			organizationId: req.params.organizationId, classId: req.params.classId
		})

		return schedule
	}

	static async delete (req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (!hasAccess) throw new NotAuthorizedError()
		if (hasAccess !== 'admin' && hasAccess !== 'teacher') throw new NotAuthorizedError()

		const isDeleted = await SchedulesUseCases.delete({
			id: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}