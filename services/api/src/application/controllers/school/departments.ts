import { DepartmentsUseCases, FacultiesUseCases } from '@modules/school'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class DepartmentController {
	private static schema = () => ({
		title: Schema.string().min(3),
	})

	static async find(req: Request) {
		return await DepartmentsUseCases.find(req.params.id)
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await DepartmentsUseCases.get(query)
	}

	static async create(req: Request) {
		const data = validate(
			{
				...this.schema(),
				facultyId: Schema.string().min(1),
			},
			req.body,
		)
		const faculty = await FacultiesUseCases.find(data.facultyId)
		if (!faculty) throw new BadRequestError('faculty not found')

		return await DepartmentsUseCases.add({ ...data, institutionId: faculty.institutionId })
	}

	static async update(req: Request) {
		const data = validate(this.schema(), req.body)
		const updatedDepartment = await DepartmentsUseCases.update({ id: req.params.id, data })
		if (updatedDepartment) return updatedDepartment
		throw new NotAuthorizedError()
	}

	static async delete(req: Request) {
		const isDeleted = await DepartmentsUseCases.delete(req.params.id)

		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
