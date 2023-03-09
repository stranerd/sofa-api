import { DepartmentsUseCases, FacultiesUseCases } from '@modules/school'
import { BadRequestError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class DepartmentController {
	static async FindDepartment (req: Request) {
		return await DepartmentsUseCases.find(req.params.id)
	}

	static async GetDepartments (req: Request) {
		const query = req.query as QueryParams
		return await DepartmentsUseCases.get(query)
	}

	static async CreateDepartment (req: Request) {
		const data = validateReq({
			name: Schema.string().min(3),
			facultyId: Schema.string().min(1),
		}, req.body)
		const faculty = await FacultiesUseCases.find(data.facultyId)
		if (!faculty) throw new BadRequestError('faculty not found')

		return await DepartmentsUseCases.add({ ...data, institutionId: faculty.institutionId })
	}

	static async UpdateDepartment (req: Request) {
		const data = validateReq({
			name: Schema.string().min(3),
		}, req.body)

		const updatedDepartment = await DepartmentsUseCases.update({ id: req.params.id, data })
		if (updatedDepartment) return updatedDepartment
		throw new BadRequestError('department not found')
	}

	static async DeleteDepartment (req: Request) {
		const isDeleted = await DepartmentsUseCases.delete(req.params.id)

		if (isDeleted) return isDeleted
		throw new BadRequestError('department not found')
	}
}