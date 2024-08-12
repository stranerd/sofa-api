import { CoursesUseCases, DepartmentsUseCases, InstitutionsUseCases } from '@modules/school'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

const schema = () => ({
	title: Schema.string().min(3),
})

export class CourseController {
	static async find(req: Request) {
		return await CoursesUseCases.find(req.params.id)
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await CoursesUseCases.get(query)
	}

	static async create(req: Request) {
		const data = validate(
			{
				...schema(),
				institutionId: Schema.string().min(1),
				departmentId: Schema.string().min(1).nullable(),
			},
			req.body,
		)
		const institution = await InstitutionsUseCases.find(data.institutionId)
		const department = !data.departmentId ? null : await DepartmentsUseCases.find(data.departmentId)
		if (!institution) throw new BadRequestError('institution not found')
		if (data.departmentId) {
			if (!department) throw new BadRequestError('department not found')
			if (department.institutionId !== institution.id) throw new BadRequestError('mismatched department and institution')
		}

		return await CoursesUseCases.add({
			...data,
			departmentId: department?.id ?? null,
			facultyId: department?.facultyId ?? null,
		})
	}

	static async update(req: Request) {
		const data = validate(schema(), req.body)
		const updatedCourse = await CoursesUseCases.update({ id: req.params.id, data })
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}

	static async delete(req: Request) {
		const isDeleted = await CoursesUseCases.delete(req.params.id)
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
