import { ClassesUseCases, MemberTypes, MembersUseCases, canAccessOrgClasses } from '@modules/organizations'
import { BadRequestError, NotAuthorizedError, Request, Schema, validate } from 'equipped'

export class LessonsController {
	private static schema = () => ({
		title: Schema.string().min(1)
	})

	static async create (req: Request) {
		const data = validate({
			...this.schema(),
			teachers: Schema.array(Schema.string().min(1))
		}, req.body)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess !== 'admin') throw new NotAuthorizedError()

		const { results: teachers } = await MembersUseCases.get({
			where: [
				{ field: 'organizationId', value: req.params.organizationId },
				{ field: 'classId', value: req.params.classId },
				{ field: 'type', value: MemberTypes.teacher },
			]
		})

		return await ClassesUseCases.addLesson({
			organizationId: req.params.organizationId, classId: req.params.classId,
			data: {
				...data,
				users: {
					students: [],
					teachers: teachers.map((m) => m.user?.id).filter(Boolean) as string[]
				}
			}
		})
	}

	static async update (req: Request) {
		const data = validate(this.schema(), req.body)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess !== 'admin') throw new NotAuthorizedError()

		const lesson = await ClassesUseCases.updateLesson({
			data, organizationId: req.params.organizationId, classId: req.params.classId, lessonId: req.params.id
		})

		return lesson
	}

	static async delete (req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess !== 'admin') throw new NotAuthorizedError()

		const isDeleted = await ClassesUseCases.deleteLesson({
			lessonId: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async join (req: Request) {
		const { join } = validate({ join: Schema.boolean() }, req.body)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess) throw new NotAuthorizedError()

		const updated = await ClassesUseCases.manageLessonUsers({
			lessonId: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId,
			type: 'students',
			userIds: [req.authUser!.id],
			add: join
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async manageTeachers (req: Request) {
		const { add, userId } = validate({
			add: Schema.boolean(),
			userId: Schema.string().min(1)
		}, req.body)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess !== 'admin') throw new NotAuthorizedError()

		if (add) {
			const { results: teachers } = await MembersUseCases.get({
				where: [
					{ field: 'organizationId', value: req.params.organizationId },
					{ field: 'classId', value: req.params.classId },
					{ field: 'type', value: MemberTypes.teacher },
					{ field: 'user.id', value: userId },
				]
			})
			if (!teachers.length) throw new BadRequestError('user not found')
		}

		const updated = await ClassesUseCases.manageLessonUsers({
			lessonId: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId,
			type: 'teachers',
			userIds: [userId],
			add
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}