import type { QueryParams, Request } from 'equipped'
import { BadRequestError, NotAuthorizedError, Schema, validate } from 'equipped'

import { FacultiesUseCases, InstitutionsUseCases } from '@modules/school'

const schema = () => ({
	title: Schema.string().min(3),
})
export class FacultyController {
	static async find(req: Request) {
		return await FacultiesUseCases.find(req.params.id)
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await FacultiesUseCases.get(query)
	}

	static async create(req: Request) {
		const data = validate(
			{
				...schema(),
				institutionId: Schema.string().min(1),
			},
			req.body,
		)
		const institution = await InstitutionsUseCases.find(data.institutionId)
		if (!institution) throw new BadRequestError('institution not found')
		if (institution.isGateway) throw new BadRequestError('institution is a gateway body')

		return await FacultiesUseCases.add(data)
	}

	static async update(req: Request) {
		const data = validate(schema(), req.body)
		const updatedFaculty = await FacultiesUseCases.update({ id: req.params.id, data })
		if (updatedFaculty) return updatedFaculty
		throw new NotAuthorizedError()
	}

	static async delete(req: Request) {
		const isDeleted = await FacultiesUseCases.delete(req.params.id)
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
