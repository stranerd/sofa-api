import { TagsUseCases } from '@modules/interactions'
import { Currencies } from '@modules/payment'
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
		price: Schema.or([
			Schema.is(false as const),
			...(user?.roles.isVerified ? [
				Schema.object({
					amount: Schema.number().gt(0),
					currency: Schema.in(Object.values(Currencies)).default(Currencies.NGN)
				})
			] : [])
		]).default(false)
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
}