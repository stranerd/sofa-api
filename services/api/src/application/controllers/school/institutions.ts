import { InstitutionsUseCases } from '@modules/school'
import { NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class InstitutionController {
	static async FindInstitution (req: Request) {
		return await InstitutionsUseCases.find(req.params.id)
	}

	static async GetInstitutions (req: Request) {
		const query = req.query as QueryParams
		return await InstitutionsUseCases.get(query)
	}

	static async CreateInstitution (req: Request) {
		const data = validateReq({
			name: Schema.string().min(3),
			isGateway: Schema.boolean()
		}, req.body)

		return await InstitutionsUseCases.add(data)
	}

	static async UpdateInstitution (req: Request) {
		const data = validateReq({
			name: Schema.string().min(3),
			isGateway: Schema.boolean()
		}, req.body)

		const updatedInstitution = await InstitutionsUseCases.update({ id: req.params.id, data })
		if (updatedInstitution) return updatedInstitution
		throw new NotAuthorizedError()
	}

	static async DeleteInstitution (req: Request) {
		const isDeleted = await InstitutionsUseCases.delete(req.params.id)
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}