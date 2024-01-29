import { CoursesUseCases, DraftStatus, QuizzesUseCases } from '@modules/study'
import { UsersUseCases, VerificationsUseCases } from '@modules/users'
import { BadRequestError, Conditions, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class VerificationsController {
	static async find(req: Request) {
		return await VerificationsUseCases.find(req.params.id)
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await VerificationsUseCases.get(query)
	}

	static async create(req: Request) {
		const authUser = req.authUser!
		if (authUser.roles.isVerified) throw new BadRequestError('User is already verified')

		const { content } = validate(
			{
				content: Schema.object({
					courses: Schema.array(Schema.string().min(1)).max(5),
					quizzes: Schema.array(Schema.string().min(3)).max(5),
				}),
			},
			req.body,
		)

		const user = await UsersUseCases.find(authUser.id)
		if (!user || user.isDeleted()) throw new BadRequestError('User not found')
		if (!user.isBioComplete()) throw new BadRequestError('Complete your bio before applying for verification')
		if (user.socials.length < 1) throw new BadRequestError('Add at least one social media account before applying for verification')

		const validContent = await this.verifyContent(authUser.id, content)
		if (!validContent) throw new BadRequestError('Make sure all content provided belong to you and are published')

		return await VerificationsUseCases.create({ userId: authUser.id, content })
	}

	static async accept(req: Request) {
		const { accept } = validate(
			{
				accept: Schema.boolean(),
			},
			req.body,
		)
		const isUpdated = await VerificationsUseCases.accept({ id: req.params.id, accept })
		if (isUpdated) return isUpdated
		throw new NotAuthorizedError()
	}

	private static async verifyContent(userId: string, content: Parameters<typeof VerificationsUseCases.create>[0]['content']) {
		const { results: courses } = await CoursesUseCases.get({
			where: [{ field: 'id', value: content.courses, condition: Conditions.in }],
			all: true,
		})

		if (courses.length !== content.courses.length) return false
		const validCourses = courses.every((course) => course.user.id === userId && course.status === DraftStatus.published)
		if (!validCourses) return false

		const { results: quizzes } = await QuizzesUseCases.get({
			where: [{ field: 'id', value: content.quizzes, condition: Conditions.in }],
			all: true,
		})

		if (quizzes.length !== content.quizzes.length) return false
		const validQuizzes = quizzes.every((quiz) => quiz.user.id === userId && quiz.status === DraftStatus.published)
		if (!validQuizzes) return false

		return true
	}
}
