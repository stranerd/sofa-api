import { CoursesUseCases, DepartmentsUseCases } from '@modules/school'
import { UploaderUseCases } from '@modules/storage'
import { UserSchoolType, UsersUseCases, UserType } from '@modules/users'
import { BadRequestError, Conditions, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class UsersController {
	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'dates.deletedAt', value: null }]
		return await UsersUseCases.get(query)
	}

	static async find (req: Request) {
		const user = await UsersUseCases.find(req.params.id)
		if (user?.isDeleted()) return null
		return user
	}

	static async updateType (req: Request) {
		const { data } = validate({
			data: Schema.or([
				Schema.object({
					type: Schema.is(UserType.student as const),
					school: Schema.or([
						Schema.object({
							type: Schema.is(UserSchoolType.college as const),
							departmentId: Schema.string().min(1)
						}),
						Schema.object({
							type: Schema.is(UserSchoolType.aspirant as const),
							exams: Schema.array(
								Schema.object({
									institutionId: Schema.string().min(1),
									startDate: Schema.time().asStamp(),
									endDate: Schema.time().asStamp(),
									courseIds: Schema.array(Schema.string().min(1))
								}).custom((exam) => exam.endDate >= exam.startDate, 'end date cannot be less than start date')
							)
						})
					])
				}),
				Schema.object({
					type: Schema.is(UserType.teacher as const),
					school: Schema.string().min(1)
				})
			])
		}, req.body)

		if (data.type === UserType.student) {
			if (data.school.type === UserSchoolType.college) {
				const department = await DepartmentsUseCases.find(data.school.departmentId)
				if (!department) throw new BadRequestError('department not found')
				return await UsersUseCases.updateType({
					userId: req.authUser!.id, data: {
						...data,
						school: {
							...data.school,
							institutionId: department.institutionId,
							facultyId: department.facultyId,
						}
					}
				})
			} else if (data.school.type === UserSchoolType.aspirant) {
				for (const exam of data.school.exams) {
					const { results: courses } = await CoursesUseCases.get({
						where: [{ field: 'id', condition: Conditions.in, value: exam.courseIds }],
						all: true
					})
					if (courses.length !== exam.courseIds.length) throw new BadRequestError('courses not found')
					if (courses.find((c) => c.institutionId !== exam.institutionId)) throw new BadRequestError('mismatched courses and institutions')
				}
				return await UsersUseCases.updateType({
					userId: req.authUser!.id,
					data: { ...data, school: data.school }
				})
			}
		} else if (data.type === UserType.teacher) return await UsersUseCases.updateType({ userId: req.authUser!.id, data })
		throw new BadRequestError('invalid data')
	}

	static async updateAi (req: Request) {
		const uploadedPhoto = req.files.photo?.at(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { name, tagline } = validate({
			name: Schema.string().min(1),
			tagline: Schema.string().min(1),
			photo: Schema.file().image().nullable()
		}, { ...req.body, photo: uploadedPhoto })

		const photo = uploadedPhoto ? await UploaderUseCases.upload('users/ai', uploadedPhoto) : undefined
		const user = await UsersUseCases.updateAi({
			userId: req.authUser!.id,
			ai: {
				name, tagline,
				...(changedPhoto ? { photo } : {})
			}
		})
		if (user) return user
		throw new NotAuthorizedError('')
	}
}