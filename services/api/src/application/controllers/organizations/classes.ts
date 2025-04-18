import type { QueryParams, Request } from 'equipped'
import { BadRequestError, Conditions, NotAuthorizedError, QueryKeys, Schema, validate, Validation } from 'equipped'

import { canModOrgs, ClassesUseCases } from '@modules/organizations'
import type { Subscription } from '@modules/payment'
import { Currencies, Subscriptions } from '@modules/payment'
import { UploaderUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import { makeSet } from '@utils/commons'

import { SelectedPaymentMethodSchema } from '../payment'

const schema = () => ({
	title: Schema.string().min(1),
	description: Schema.string().min(1),
	photo: Schema.file().image().nullable(),
	price: Schema.object({
		amount: Schema.number().gte(0),
		currency: Schema.in(Object.values(Currencies)).default(Currencies.NGN),
	}),
})

export class ClassesController {
	static async find(req: Request) {
		const classIns = await ClassesUseCases.find(req.params.id)
		if (!classIns || classIns.organizationId !== req.params.organizationId) return null
		return classIns
	}

	static async similar(req: Request) {
		const classIns = await ClassesUseCases.find(req.params.id)
		if (!classIns || classIns.organizationId !== req.params.organizationId) return []
		const valuesToSearchAgainst = [classIns.title, classIns.description, ...classIns.lessons.map((l) => l.title)]
		const classes = await Promise.all(
			valuesToSearchAgainst.map(async (value) => {
				const { results } = await ClassesUseCases.get({
					authType: QueryKeys.or,
					auth: [{ field: 'id', condition: Conditions.ne, value: classIns.id }],
					search: {
						fields: ['title', 'description', 'lessons.title'],
						value,
					},
					limit: 10,
				})
				return results
			}),
		)
		return Validation.getRandomSample(
			makeSet(classes.flat(), (c) => c.id),
			10,
		)
	}

	static async get(req: Request, explore = false) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.and
		if (!explore) query.auth = [{ field: 'organizationId', value: req.params.organizationId }]
		return await ClassesUseCases.get(query)
	}

	static async update(req: Request) {
		const uploadedPhoto = req.body.photo?.at?.(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { photo: _, ...rest } = validate(schema(), { ...req.body, photo: uploadedPhoto })

		const hasAccess = await canModOrgs(req.authUser!, req.params.organizationId)
		if (!hasAccess) throw new NotAuthorizedError()

		const photo = uploadedPhoto ? await UploaderUseCases.upload('organizations/classes', uploadedPhoto) : undefined

		const updatedClass = await ClassesUseCases.update({
			id: req.params.id,
			organizationId: req.params.organizationId,
			data: {
				...rest,
				...(changedPhoto ? { photo } : {}),
			},
		})
		if (updatedClass) return updatedClass
		throw new NotAuthorizedError()
	}

	static async create(req: Request) {
		const data = validate(schema(), { ...req.body, photo: req.body.photo?.at?.(0) ?? null })

		const hasAccess = await canModOrgs(req.authUser!, req.params.organizationId)
		if (!hasAccess) throw new NotAuthorizedError()
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')
		if (!user.isOrg()) throw new BadRequestError('only organizations can create classes')

		const photo = data.photo ? await UploaderUseCases.upload('organizations/classes', data.photo) : null

		return await ClassesUseCases.add({
			...data,
			photo,
			user: user.getEmbedded(),
			frozen: false,
			organizationId: req.params.organizationId,
		})
	}

	static async delete(req: Request) {
		const hasAccess = await canModOrgs(req.authUser!, req.params.organizationId)
		if (!hasAccess) throw new NotAuthorizedError()
		const isDeleted = await ClassesUseCases.delete({ id: req.params.id, organizationId: req.params.organizationId })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async purchase(req: Request) {
		const { methodId } = validate(
			{
				methodId: SelectedPaymentMethodSchema,
			},
			req.body,
		)
		const data: Subscription['data'] = { type: 'classes', classId: req.params.id, organizationId: req.params.organizationId }
		const wallet = await Subscriptions.createGeneric(req.authUser!.id, data, methodId)
		const sub = wallet.getSubscription(data)
		return !!sub?.active
	}

	static async cancelPurchase(req: Request) {
		const data: Subscription['data'] = { type: 'classes', classId: req.params.id, organizationId: req.params.organizationId }
		const wallet = await Subscriptions.cancelGeneric(req.authUser!.id, data)
		const sub = wallet.getSubscription(data)
		return !sub || !sub.active
	}
}
