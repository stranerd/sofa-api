import { CoursesUseCases, DepartmentsUseCases } from '@modules/school'
import { UserSchoolType, UsersUseCases } from '@modules/users'
import { BadRequestError, Conditions, QueryParams, Request, Schema, validate } from 'equipped'

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

	static async updateSchool (req: Request) {
		const { school } = validate({
			school: Schema.or([
				Schema.object({
					type: Schema.is(UserSchoolType.college as const),
					departmentId: Schema.string().min(1)
				}),
				Schema.object({
					type: Schema.is(UserSchoolType.aspirant as const),
					exams: Schema.array(Schema.any().custom((exam) => {
						const matches = [Schema.string().parse(exam?.institutionId).valid]
						matches.push(Schema.number().parse(exam?.startDate).valid)
						matches.push(Schema.number().gte(exam?.startDate).parse(exam?.endDate).valid)
						matches.push(Schema.array(Schema.string().min(1)).parse(exam?.courseIds).valid)
						return matches.every((m) => m)
					}))
				})
			])
		}, req.body)

		if (school.type === UserSchoolType.college) {
			const department = await DepartmentsUseCases.find(school.departmentId)
			if (!department) throw new BadRequestError('department not found')
			return await UsersUseCases.updateSchool({
				userId: req.authUser!.id, data: {
					...school,
					institutionId: department.institutionId,
					facultyId: department.facultyId,
				}
			})
		} else {
			for (const exam of school.exams) {
				const { results: courses } = await CoursesUseCases.get({
					where: [{ field: 'id', condition: Conditions.in, value: exam.courseIds }],
					all: true
				})
				if (courses.length !== exam.courseIds.length) throw new BadRequestError('courses not found')
				if (courses.find((c) => c.institutionId !== exam.institutionId)) throw new BadRequestError('mismatched courses and institutions')
			}
			return await UsersUseCases.updateSchool({ userId: req.authUser!.id, data: school })
		}
	}
}