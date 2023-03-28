import { AuthUsersUseCases } from '@modules/auth'
import { CoursesUseCases, DraftStatus, QuizzesUseCases } from '@modules/study'
import { VerificationSocials, VerificationsUseCases } from '@modules/users'
import {
	BadRequestError,
	Conditions,
	NotAuthorizedError,
	QueryParams,
	Request,
	Schema, validate
} from 'equipped'

export class VerificationsController {
	static async find (req: Request) {
		const verification = await VerificationsUseCases.find(req.params.id)
		if (!verification) return null
		if (verification.userId === req.authUser!.id || req.authUser?.roles.isAdmin) return verification
		return null
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		if (!req.authUser?.roles.isAdmin) query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await VerificationsUseCases.get(query)
	}

	static async create (req: Request) {
		const authUser = req.authUser!
		if (authUser.roles.isVerified) throw new BadRequestError('User is already verified')

		const { socials, content } = validate({
			socials: Schema.object({
				[VerificationSocials.website]: Schema.string().default(''),
				[VerificationSocials.facebook]: Schema.string().default(''),
				[VerificationSocials.twitter]: Schema.string().default(''),
				[VerificationSocials.instagram]: Schema.string().default(''),
				[VerificationSocials.linkedIn]: Schema.string().default(''),
				[VerificationSocials.youtube]: Schema.string().default(''),
				[VerificationSocials.tiktok]: Schema.string().default(''),
			}),
			content: Schema.object({
				courses: Schema.array(Schema.string().min(1)).has(1),
				quizzes: Schema.array(Schema.string().min(1)).has(3),
			}),
		}, req.body)

		const user = await AuthUsersUseCases.findUser(authUser.id)
		if (!user) throw new BadRequestError('User not found')
		if (!user.photo || !user.description) throw new BadRequestError('Complete your bio before applying for verification')

		const validContent = await this.verifyContent(authUser.id, content)
		if (!validContent) throw new BadRequestError('Make sure all content provided belong to you and are published')

		return await VerificationsUseCases.create({
			userId: authUser.id, socials, content,
			pending: true, accepted: false
		})
	}

	static async accept (req: Request) {
		const { accept } = validate({
			accept: Schema.boolean()
		}, req.body)
		const isUpdated = await VerificationsUseCases.accept({ id: req.params.id, accept })
		if (isUpdated) return isUpdated
		throw new NotAuthorizedError()
	}

	private static async verifyContent (userId: string, content: Parameters<typeof VerificationsUseCases.create>[0]['content']) {
		const { results: courses } = await CoursesUseCases.get({
			where: [{ field: 'id', value: content.courses, condition: Conditions.in }],
			all: true
		})

		if (courses.length !== content.courses.length) return false
		const validCourses = courses.every((course) => course.user.id === userId && course.status === DraftStatus.published)
		if (!validCourses) return false

		const { results: quizzes } = await QuizzesUseCases.get({
			where: [{ field: 'id', value: content.quizzes, condition: Conditions.in }],
			all: true
		})

		if (quizzes.length !== content.quizzes.length) return false
		const validQuizzes = quizzes.every((quiz) => quiz.user.id === userId && quiz.status === DraftStatus.published && !quiz.courseId)
		if (!validQuizzes) return false

		return true
	}
}