import type { QueryParams, Request } from 'equipped'
import { NotAuthorizedError, Schema, validate } from 'equipped'

import { InstitutionsUseCases } from '@modules/school'

const schema = () => ({
	title: Schema.string().min(3),
	isGateway: Schema.boolean(),
})
export class InstitutionController {
	static async find(req: Request) {
		return await InstitutionsUseCases.find(req.params.id)
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await InstitutionsUseCases.get(query)
	}

	static async create(req: Request) {
		const data = validate(schema(), req.body)
		return await InstitutionsUseCases.add(data)
	}

	static async update(req: Request) {
		const data = validate(schema(), req.body)
		const updatedInstitution = await InstitutionsUseCases.update({ id: req.params.id, data })
		if (updatedInstitution) return updatedInstitution
		throw new NotAuthorizedError()
	}

	static async delete(req: Request) {
		const isDeleted = await InstitutionsUseCases.delete(req.params.id)
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
