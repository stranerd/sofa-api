import type { QueryParams, Request } from 'equipped'
import { BadRequestError, NotAuthorizedError, QueryKeys, Schema, validate } from 'equipped'

import { AnnouncementsUseCases, MemberTypes, canAccessOrgClasses } from '@modules/organizations'
import { UsersUseCases } from '@modules/users'

const schema = (role: 'teacher' | 'admin') => {
	const lessonIds = Schema.array(Schema.string().min(1))
	const userTypes = Schema.array(Schema.in(Object.values(MemberTypes)))
	const isAdmin = role === 'admin'
	return {
		body: Schema.string().min(1),
		filter: Schema.object({
			lessonIds: isAdmin ? lessonIds.nullable() : lessonIds.min(1),
			userTypes: isAdmin ? userTypes.nullable() : userTypes.min(1),
		}),
	}
}

export class AnnouncementsController {
	static async find(req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (!hasAccess?.role) throw new NotAuthorizedError()

		const announcement = await AnnouncementsUseCases.find(req.params.id)
		if (!announcement || announcement.organizationId !== req.params.organizationId || announcement.classId !== req.params.classId)
			return null
		return announcement
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
		return await AnnouncementsUseCases.get(query)
	}

	static async create(req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin' && hasAccess?.role !== 'teacher') throw new NotAuthorizedError()

		const data = validate(schema(hasAccess.role), req.body)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		data.filter.lessonIds?.forEach((lessonId) => {
			const lesson = hasAccess.class.getLesson(lessonId)
			if (!lesson) throw new BadRequestError('lesson not found')
			if (hasAccess.role === 'teacher' && !lesson.users.teachers.includes(req.authUser!.id)) throw new NotAuthorizedError()
		})

		return await AnnouncementsUseCases.add({
			...data,
			user: user.getEmbedded(),
			organizationId: req.params.organizationId,
			classId: req.params.classId,
		})
	}

	static async delete(req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin') throw new NotAuthorizedError()

		const isDeleted = await AnnouncementsUseCases.delete({
			id: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId,
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async markRead(req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (!hasAccess?.role) throw new NotAuthorizedError()

		return await AnnouncementsUseCases.markRead({
			organizationId: req.params.organizationId,
			classId: req.params.classId,
			userId: req.authUser!.id,
		})
	}
}
