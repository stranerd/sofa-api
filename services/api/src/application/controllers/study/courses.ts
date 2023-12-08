import { Currencies } from '@modules/payment'
import { UploaderUseCases } from '@modules/storage'
import { Coursable, CoursesUseCases, DraftStatus } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { AuthUser, BadRequestError, Conditions, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'
import { verifyTags } from './tags'

export class CourseController {
	private static schema = (user: AuthUser | null) => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		photo: Schema.file().image().nullable(),
		topic: Schema.string().min(1),
		tags: Schema.array(Schema.string().min(1).lower().trim()).set(),
		price: Schema.object({
			amount: Schema.number().gte(0).lte(user?.roles.isVerified ? Number.POSITIVE_INFINITY : 0).default(0),
			currency: Schema.in(Object.values(Currencies)).default(Currencies.NGN)
		})
	})

	static async find (req: Request) {
		const course = await CoursesUseCases.find(req.params.id)
		return course
	}

	static async similar (req: Request) {
		const course = await CoursesUseCases.find(req.params.id)
		if (!course) return []
		const { results } = await CoursesUseCases.get({
			authType: QueryKeys.or,
			auth: [
				{ field: 'topicId', value: course.topicId },
				{ field: 'status',  value: DraftStatus.published },
				{ field: 'tagIds', condition: Conditions.in, value: course.tagIds },
			],
			limit: 10
		})
		return results
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await CoursesUseCases.get(query)
	}

	static async update (req: Request) {
		const uploadedPhoto = req.files.photo?.at(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { title, description, price, topic, tags } = validate(this.schema(req.authUser), { ...req.body, photo: uploadedPhoto })

		const utags = await verifyTags(topic, tags)

		const photo = uploadedPhoto ? await UploaderUseCases.upload('study/courses', uploadedPhoto) : undefined

		const updatedCourse = await CoursesUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data: {
				...utags, title, description, price,
				...(changedPhoto ? { photo } : {})
			}
		})
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const data = validate({
			...this.schema(req.authUser)
		}, { ...req.body, photo: req.files.photo?.at(0) ?? null })

		const tags = await verifyTags(data.topic, data.tags)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const photo = data.photo ? await UploaderUseCases.upload('study/courses', data.photo) : null

		return await CoursesUseCases.add({
			...data, ...tags, user: user.getEmbedded(),
			photo, status: DraftStatus.draft,
			frozen: false
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

	static async updateSections (req: Request) {
		const { sections } = validate({
			sections: Schema.array(Schema.object({
				label: Schema.string().min(1),
				items: Schema.array(Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(Coursable))
				}))
			}))
		}, req.body)

		const updatedCourse = await CoursesUseCases.updateSections({
			id: req.params.id, userId: req.authUser!.id, sections
		})
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}
}