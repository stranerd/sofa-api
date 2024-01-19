import { ClassesUseCases, canAccessOrgClasses, canModOrgs } from '@modules/organizations'
import { Currencies, Subscription, cancelSubscriptionTo, createSubscriptionTo } from '@modules/payment'
import { UploaderUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class ClassesController {
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

	static async get (req: Request, explore = false) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.and
		if (!explore) query.auth = [{ field: 'organizationId', value: req.params.organizationId }]
		return await ClassesUseCases.get(query)
	}

	static async update (req: Request) {
		const uploadedPhoto = req.files.photo?.at(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { title, description } = validate(this.schema(), { ...req.body, photo: uploadedPhoto })

		const hasAccess = await canModOrgs(req.authUser!, req.params.organizationId)
		if (!hasAccess) throw new NotAuthorizedError()

		const photo = uploadedPhoto ? await UploaderUseCases.upload('organizations/classes', uploadedPhoto) : undefined

		const updatedClass = await ClassesUseCases.update({
			id: req.params.id, organizationId: req.params.organizationId,
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

		const hasAccess = await canModOrgs(req.authUser!, req.params.organizationId)
		if (!hasAccess) throw new NotAuthorizedError()
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		const photo = data.photo ? await UploaderUseCases.upload('organizations/classes', data.photo) : null

		return await ClassesUseCases.add({
			...data, photo, user: user.getEmbedded(), frozen: false,
			organizationId: req.params.organizationId,
		})
	}

	static async delete (req: Request) {
		const hasAccess = await canModOrgs(req.authUser!, req.params.organizationId)
		if (!hasAccess) throw new NotAuthorizedError()
		const isDeleted = await ClassesUseCases.delete({ id: req.params.id, organizationId: req.params.organizationId })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async purchase (req: Request) {
		const hasAccess = await canAccessOrgClasses(req.authUser!, req.params.organizationId, req.params.classId)
		if (hasAccess) throw new BadRequestError('you already have access to the class, no need to purchase it')

		const data: Subscription['data'] = { type: 'classes', classId: req.params.id, organizationId: req.params.organizationId }
		const wallet = await createSubscriptionTo(req.authUser!.id, data)
		const sub = wallet.getSubscription(data)
		return !!sub?.active
	}

	static async cancelPurchase (req: Request) {
		const data: Subscription['data'] = { type: 'classes', classId: req.params.id, organizationId: req.params.organizationId }
		const wallet = await cancelSubscriptionTo(req.authUser!.id, data)
		const sub = wallet.getSubscription(data)
		return !sub || !sub.active
	}
}