import { Currencies } from '@modules/payment'
import { UploaderUseCases } from '@modules/storage'
import { CoursesUseCases, DraftStatus, SectionsSchema, verifySections } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { AuthUser, BadRequestError, Conditions, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'
import { verifyTags } from './tags'

const schema = (user: AuthUser | null) => ({
	title: Schema.string().min(1),
	description: Schema.string().min(1),
	photo: Schema.file().image().nullable(),
	topic: Schema.string().min(1),
	tags: Schema.array(Schema.string().min(1).lower().trim()).set(),
	price: Schema.object({
		amount: Schema.number()
			.gte(0)
			.lte(user?.roles.isVerified ? Number.POSITIVE_INFINITY : 0)
			.default(0),
		currency: Schema.in(Object.values(Currencies)).default(Currencies.NGN),
	}),
})
export class CourseController {
	static async find(req: Request) {
		const course = await CoursesUseCases.find(req.params.id)
		return course
	}

	static async similar(req: Request) {
		const course = await CoursesUseCases.find(req.params.id)
		if (!course) return []
		const { results } = await CoursesUseCases.get({
			where: [{ field: 'id', value: course.id, condition: Conditions.ne }],
			authType: QueryKeys.or,
			auth: [
				{ field: 'topicId', value: course.topicId },
				{ field: 'status', value: DraftStatus.published },
				{ field: 'tagIds', condition: Conditions.in, value: course.tagIds },
			],
			limit: 10,
		})
		return results
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await CoursesUseCases.get(query)
	}

	static async update(req: Request) {
		const uploadedPhoto = req.body.photo?.at?.(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { photo: _, topic, tags, ...rest } = validate(schema(req.authUser), { ...req.body, photo: uploadedPhoto })

		const utags = await verifyTags(topic, tags)

		const photo = uploadedPhoto ? await UploaderUseCases.upload('study/courses', uploadedPhoto) : undefined

		const updatedCourse = await CoursesUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data: {
				...utags,
				...rest,
				...(changedPhoto ? { photo } : {}),
			},
		})
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}

	static async create(req: Request) {
		const data = validate(
			{
				...schema(req.authUser),
			},
			{ ...req.body, photo: req.body.photo?.at?.(0) ?? null },
		)

		const tags = await verifyTags(data.topic, data.tags)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const photo = data.photo ? await UploaderUseCases.upload('study/courses', data.photo) : null

		return await CoursesUseCases.add({
			...data,
			...tags,
			user: user.getEmbedded(),
			photo,
			status: DraftStatus.draft,
			frozen: false,
		})
	}

	static async delete(req: Request) {
		const isDeleted = await CoursesUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async publish(req: Request) {
		const updatedCourse = await CoursesUseCases.publish({ id: req.params.id, userId: req.authUser!.id })
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}

	static async freeze(req: Request) {
		const updatedCourse = await CoursesUseCases.freeze({ id: req.params.id, userId: req.authUser!.id })
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}

	static async updateSections(req: Request) {
		const { sections } = validate({ sections: SectionsSchema }, req.body)

		await verifySections(sections, req.authUser!, { courseId: req.params.id })

		const updatedCourse = await CoursesUseCases.updateSections({
			id: req.params.id,
			userId: req.authUser!.id,
			sections,
		})
		if (updatedCourse) return updatedCourse
		throw new NotAuthorizedError()
	}
}
