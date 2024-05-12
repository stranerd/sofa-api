import { ClassesUseCases, MemberTypes, MembersUseCases, canAccessOrgClasses } from '@modules/organizations'
import { Coursable, FileType, QuizModes, canAccessCoursable } from '@modules/study'
import { makeSet } from '@utils/commons'
import { BadRequestError, Conditions, NotAuthorizedError, Request, Schema, validate } from 'equipped'

export class LessonsController {
	private static schema = () => ({
		title: Schema.string().min(1),
	})

	static async create(req: Request) {
		const data = validate(
			{
				...this.schema(),
				teachers: Schema.array(Schema.string().min(1)),
			},
			req.body,
		)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin') throw new NotAuthorizedError()

		const { results: teachers } = await MembersUseCases.get({
			where: [
				{ field: 'organizationId', value: req.params.organizationId },
				{ field: 'classId', value: req.params.classId },
				{ field: 'type', value: MemberTypes.teacher },
				{ field: 'user.id', condition: Conditions.in, value: data.teachers },
			],
		})

		return await ClassesUseCases.addLesson({
			organizationId: req.params.organizationId,
			classId: req.params.classId,
			data: {
				title: data.title,
				curriculum: [],
				users: {
					students: [],
					teachers: teachers.map((m) => m.user?.id).filter(Boolean) as string[],
				},
			},
		})
	}

	static async update(req: Request) {
		const data = validate(this.schema(), req.body)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin') throw new NotAuthorizedError()

		const lesson = await ClassesUseCases.updateLesson({
			data,
			organizationId: req.params.organizationId,
			classId: req.params.classId,
			lessonId: req.params.id,
		})

		return lesson
	}

	static async delete(req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin') throw new NotAuthorizedError()

		const isDeleted = await ClassesUseCases.deleteLesson({
			lessonId: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId,
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async join(req: Request) {
		const { join } = validate({ join: Schema.boolean() }, req.body)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (!hasAccess?.role) throw new NotAuthorizedError()

		const updated = await ClassesUseCases.manageLessonUsers({
			lessonId: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId,
			type: 'students',
			userIds: [req.authUser!.id],
			add: join,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async manageTeachers(req: Request) {
		const { add, userId } = validate(
			{
				add: Schema.boolean(),
				userId: Schema.string().min(1),
			},
			req.body,
		)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin') throw new NotAuthorizedError()

		if (add) {
			const { results: teachers } = await MembersUseCases.get({
				where: [
					{ field: 'organizationId', value: req.params.organizationId },
					{ field: 'classId', value: req.params.classId },
					{ field: 'type', value: MemberTypes.teacher },
					{ field: 'user.id', value: userId },
				],
			})
			if (!teachers.length) throw new BadRequestError('user not found')
		}

		const updated = await ClassesUseCases.manageLessonUsers({
			lessonId: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId,
			type: 'teachers',
			userIds: [userId],
			add,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async updateCurriculum(req: Request) {
		const { curriculum } = validate(
			{
				curriculum: Schema.array(
					Schema.object({
						label: Schema.string().min(1),
						items: Schema.array(
							Schema.discriminate((d) => d.type, {
								[Coursable.quiz]: Schema.object({
									id: Schema.string().min(1),
									type: Schema.is(Coursable.quiz as const),
									quizMode: Schema.in(Object.values(QuizModes)),
								}),
								[Coursable.file]: Schema.object({
									id: Schema.string().min(1),
									type: Schema.is(Coursable.file as const),
									fileType: Schema.in(Object.values(FileType)),
								}),
							}),
						),
					}),
				),
			},
			req.body,
		)

		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess?.role !== 'admin' && hasAccess?.role !== 'teacher') throw new NotAuthorizedError()
		const lesson = hasAccess.class.getLesson(req.params.id)
		if (!lesson?.users.teachers.includes(req.authUser!.id)) throw new NotAuthorizedError()

		const allFiles = makeSet(
			curriculum.flatMap((s) => s.items.filter((i) => i.type === Coursable.file)),
			(f) => f.id,
		)
		const allQuizzes = makeSet(
			curriculum.flatMap((s) => s.items.filter((i) => i.type === Coursable.quiz)),
			(q) => q.id,
		)

		await Promise.all([
			(async () => {
				const accesses = await Promise.all(
					allFiles.map(async (f) => {
						if (f.type !== Coursable.file) return null
						const access = await canAccessCoursable(Coursable.file, f.id, req.authUser!)
						if (!access || access.type !== f.fileType) return null
						return access
					}),
				)
				if (accesses.every((a) => a)) return
				throw new NotAuthorizedError('you have some invalid files')
			})(),
			(async () => {
				const accesses = await Promise.all(allQuizzes.map((q) => canAccessCoursable(Coursable.quiz, q.id, req.authUser!)))
				if (accesses.every((a) => a)) return
				throw new NotAuthorizedError('you have some invalid quizzes')
			})(),
		])

		const updated = await ClassesUseCases.updateLessonCurriculum({
			lessonId: req.params.id,
			organizationId: req.params.organizationId,
			classId: req.params.classId,
			curriculum,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}
