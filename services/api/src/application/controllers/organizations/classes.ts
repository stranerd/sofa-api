import { ClassesUseCases, canAccessOrg } from '@modules/organizations'
import { Currencies } from '@modules/payment'
import { UploaderUseCases } from '@modules/storage'
import { NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class ClassController {
	private static schema = () => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		photo: Schema.file().image().nullable(),
		price: Schema.object({
			amount: Schema.number().gte(0),
			currency: Schema.in(Object.values(Currencies)).default(Currencies.NGN)
		})
	})

	static async find (req: Request) {
		const classIns = await ClassesUseCases.find(req.params.id)
		if (!classIns || classIns.organizationId !== req.params.organizationId) return null
		return classIns
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.and
		query.auth = [{ field: 'organizationId', value: req.params.organizationId }]
		return await ClassesUseCases.get(query)
	}

	static async update (req: Request) {
		const uploadedPhoto = req.files.photo?.at(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { title, description } = validate(this.schema(), { ...req.body, photo: uploadedPhoto })

		const photo = uploadedPhoto ? await UploaderUseCases.upload('organizations/classes', uploadedPhoto) : undefined

		const updatedClass = await ClassesUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data: {
				title, description,
				...(changedPhoto ? { photo } : {})
			}
		})
		if (updatedClass) return updatedClass
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const data = validate(this.schema(), { ...req.body, photo: req.files.photo?.at(0) ?? null })

		const hasAccess = await canAccessOrg(req.authUser!.id, req.params.organizationId)
		if (!hasAccess) throw new NotAuthorizedError()

		const photo = data.photo ? await UploaderUseCases.upload('organizations/classes', data.photo) : null

		const classIns = await ClassesUseCases.add({
			...data, photo, user: hasAccess.getEmbedded(), frozen: false,
			organizationId: hasAccess.id,
		})

		return classIns
	}

	static async delete (req: Request) {
		const isDeleted = await ClassesUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}