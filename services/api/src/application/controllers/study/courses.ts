import { TagsUseCases } from '@modules/interactions'
import { Currencies, FlutterwavePayment, MethodsUseCases, Purchasables, PurchasesUseCases, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { UploaderUseCases } from '@modules/storage'
import { Coursable, CoursesUseCases, DraftStatus } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { AuthUser, BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class CourseController {
	private static schema = (user: AuthUser | null) => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		photo: Schema.file().image().nullable(),
		isPublic: Schema.boolean(),
		price: Schema.object({
			amount: Schema.number().gte(0).lte(user?.roles.isVerified ? Number.POSITIVE_INFINITY : 0).default(0),
			currency: Schema.in(Object.values(Currencies)).default(Currencies.NGN)
		})
	})

	static async find (req: Request) {
		return await CoursesUseCases.find(req.params.id)
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await CoursesUseCases.get(query)
	}

	static async update (req: Request) {
		const uploadedPhoto = req.files.photo?.[0] ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { title, description, isPublic, price } = validate(this.schema(req.authUser), { ...req.body, photo: uploadedPhoto })

		const photo = uploadedPhoto ? await UploaderUseCases.upload('study/courses', uploadedPhoto) : undefined

		const updatedCourse = await CoursesUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data: {
				title, description, isPublic, price,
				...(changedPhoto ? { photo } : {})
			}
		})
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const data = validate({
			...this.schema(req.authUser),
			tagId: Schema.string().min(1)
		}, { ...req.body, photo: req.files.photo?.[0] ?? null })

		const tag = await TagsUseCases.find(data.tagId)
		if (!tag) throw new BadRequestError('tag not found')

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const photo = data.photo ? await UploaderUseCases.upload('study/courses', data.photo) : null

		return await CoursesUseCases.add({
			...data, user: user.getEmbedded(),
			photo, status: DraftStatus.draft
		})
	}

	static async delete (req: Request) {
		const isDeleted = await CoursesUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async publish (req: Request) {
		const updatedCourse = await CoursesUseCases.publish({ id: req.params.id, userId: req.authUser!.id })
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}

	static async freeze (req: Request) {
		const updatedCourse = await CoursesUseCases.freeze({ id: req.params.id, userId: req.authUser!.id })
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}

	static async move (req: Request) {
		const { coursableId, type, add } = validate({
			type: Schema.in(Object.values(Coursable)),
			coursableId: Schema.string().min(1),
			add: Schema.boolean()
		}, req.body)

		const updatedCourse = await CoursesUseCases.move({
			id: req.params.id, userId: req.authUser!.id, add, type, coursableId
		})
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}

	static async purchase (req: Request) {
		const userId = req.authUser!.id
		const course = await CoursesUseCases.find(req.params.id)
		if (!course) throw new BadRequestError('course not found')
		const purchase = await PurchasesUseCases.for({
			userId, type: Purchasables.courses, itemId: course.id,
		})
		if (purchase) return true

		const user = await UsersUseCases.find(userId)
		if (!user) throw new BadRequestError('profile not found')

		const transaction = await TransactionsUseCases.create({
			userId: user.id,
			email: user.bio.email,
			amount: 0 - course.price.amount,
			currency: course.price.currency,
			status: TransactionStatus.initialized,
			title: `Purchasing course: ${course.title}`,
			data: {
				type: TransactionType.purchase,
				purchase: {
					price: course.price,
					user: user.getEmbedded(),
					data: { type: Purchasables.courses, id: course.id, userId: course.user.id }
				}
			}
		})
		let successful = false

		if (course.isFree()) successful = true
		else {
			const { methodId } = validate({ methodId: Schema.string().min(1) }, req.body)
			const method = await MethodsUseCases.find(methodId)
			if (!method || method.userId !== userId) throw new BadRequestError('invalid method')
			successful = await FlutterwavePayment.chargeCard({
				email: transaction.email, amount: Math.abs(transaction.amount), currency: transaction.currency,
				token: method.token, id: transaction.id
			})
		}

		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed }
		})

		return successful
	}
}