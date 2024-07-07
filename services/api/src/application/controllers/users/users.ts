import { ClassesUseCases } from '@modules/organizations'
import { CoursesUseCases, DepartmentsUseCases } from '@modules/school'
import { UploaderUseCases } from '@modules/storage'
import { Coursable, canAccessCoursable } from '@modules/study'
import { UserSchoolType, UserSocials, UserType, UsersUseCases } from '@modules/users'
import { BadRequestError, Conditions, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class UsersController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'dates.deletedAt', value: null }]
		return await UsersUseCases.get(query)
	}

	static async find(req: Request) {
		const user = await UsersUseCases.find(req.params.id)
		if (user?.isDeleted()) return null
		return user
	}

	static async updateType(req: Request) {
		const { data } = validate(
			{
				data: Schema.discriminate((d) => d.type, {
					[UserType.student]: Schema.object({
						type: Schema.is(UserType.student as const),
						school: Schema.discriminate((s) => s.type, {
							[UserSchoolType.college]: Schema.object({
								type: Schema.is(UserSchoolType.college as const),
								departmentId: Schema.string().min(1),
							}),
							[UserSchoolType.aspirant]: Schema.object({
								type: Schema.is(UserSchoolType.aspirant as const),
								exams: Schema.array(
									Schema.object({
										institutionId: Schema.string().min(1),
										startDate: Schema.time().asStamp(),
										endDate: Schema.time().asStamp(),
										courseIds: Schema.array(Schema.string().min(1)),
									}).custom((exam) => exam.endDate >= exam.startDate, 'end date cannot be less than start date'),
								),
							}),
							[UserSchoolType.university]: Schema.object({
								type: Schema.is(UserSchoolType.university as const),
							}),
						}),
					}),
					[UserType.teacher]: Schema.object({
						type: Schema.is(UserType.teacher as const),
						school: Schema.string().min(1),
					}),
					[UserType.organization]: Schema.object({
						type: Schema.is(UserType.organization as const),
						name: Schema.string().min(1),
						code: Schema.string().min(6),
					}),
				}),
			},
			req.body,
		)

		if (data.type === UserType.student) {
			if (data.school.type === UserSchoolType.college) {
				const department = await DepartmentsUseCases.find(data.school.departmentId)
				if (!department) throw new BadRequestError('department not found')
				const updated = await UsersUseCases.updateType({
					userId: req.authUser!.id,
					data: {
						...data,
						school: {
							...data.school,
							institutionId: department.institutionId,
							facultyId: department.facultyId,
						},
					},
				})
				if (updated) return updated
			} else if (data.school.type === UserSchoolType.aspirant) {
				for (const exam of data.school.exams) {
					const { results: courses } = await CoursesUseCases.get({
						where: [{ field: 'id', condition: Conditions.in, value: exam.courseIds }],
						all: true,
					})
					if (courses.length !== exam.courseIds.length) throw new BadRequestError('courses not found')
					if (courses.find((c) => c.institutionId !== exam.institutionId))
						throw new BadRequestError('mismatched courses and institutions')
				}
				const updated = await UsersUseCases.updateType({
					userId: req.authUser!.id,
					data: { ...data, school: data.school },
				})
				if (updated) return updated
			} else if (data.school.type === UserSchoolType.university) {
				const updated = await UsersUseCases.updateType({ userId: req.authUser!.id, data: { ...data, school: data.school } })
				if (updated) return updated
			}
		} else {
			const updated = await UsersUseCases.updateType({ userId: req.authUser!.id, data })
			if (updated) return updated
		}
		throw new NotAuthorizedError('cannot update user type')
	}

	static async updateOrgCode(req: Request) {
		const { code } = validate(
			{
				code: Schema.string().min(6),
			},
			req.body,
		)

		const user = await UsersUseCases.updateOrgCode({ userId: req.authUser!.id, code })
		if (user) return user
		throw new NotAuthorizedError()
	}

	static async updateAi(req: Request) {
		const uploadedPhoto = req.body.photo?.at(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { name, tagline } = validate(
			{
				name: Schema.string().min(1),
				tagline: Schema.string().min(1),
				photo: Schema.file().image().nullable(),
			},
			{ ...req.body, photo: uploadedPhoto },
		)

		const photo = uploadedPhoto ? await UploaderUseCases.upload('users/ai', uploadedPhoto) : undefined
		const user = await UsersUseCases.updateAi({
			userId: req.authUser!.id,
			ai: {
				name,
				tagline,
				...(changedPhoto ? { photo } : {}),
			},
		})
		if (user) return user
		throw new NotAuthorizedError()
	}

	static async updateSocials(req: Request) {
		const { socials } = validate(
			{
				socials: Schema.array(
					Schema.object({
						ref: Schema.in(Object.values(UserSocials)),
						link: Schema.string().url(),
					}),
				),
			},
			req.body,
		)

		const updated = await UsersUseCases.updateSocials({ userId: req.authUser!.id, socials })

		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async updateLocation(req: Request) {
		const { location } = validate(
			{
				location: Schema.object({
					country: Schema.string().min(1),
					state: Schema.string().min(1),
				}),
			},
			req.body,
		)

		const updated = await UsersUseCases.updateLocation({ userId: req.authUser!.id, location })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async updateEditingQuizzes(req: Request) {
		const { quizzes } = validate(
			{
				quizzes: Schema.object({
					id: Schema.string().min(1),
					questionId: Schema.string().min(1),
				}).nullable(),
			},
			req.body,
		)

		if (quizzes) {
			const hasAccess = await canAccessCoursable(Coursable.quiz, quizzes.id, req.authUser!)
			if (!hasAccess) throw new NotAuthorizedError('cannot access this quiz')
		}

		const updated = await UsersUseCases.updateEditing({ userId: req.authUser!.id, editing: { quizzes } })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async updateSavedClasses(req: Request) {
		const { classes, add } = validate(
			{
				classes: Schema.array(Schema.string().min(1)),
				add: Schema.boolean(),
			},
			req.body,
		)

		if (add) {
			const allClasses = await ClassesUseCases.get({ where: [{ field: 'id', condition: Conditions.in, value: classes }] })
			classes.splice(0, classes.length, ...allClasses.results.map((c) => c.id))
		}

		const updated = await UsersUseCases.updateSaved({ userId: req.authUser!.id, key: 'classes', values: classes, add })
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}
