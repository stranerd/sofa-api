import type { QueryParams, Request } from 'equipped'
import { Conditions } from 'equipped'

import { InteractionEntities, ViewsUseCases } from '@modules/interactions'
import { CoursesUseCases, DraftStatus, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'

export class MyStudyController {
	static async recent(req: Request) {
		const { results: views } = await ViewsUseCases.get({
			where: [
				{ field: 'user.id', value: req.authUser!.id },
				{ field: 'entity.type', condition: Conditions.in, value: [InteractionEntities.courses, InteractionEntities.quizzes] },
			],
			sort: [{ field: 'createdAt', desc: true }],
			limit: 30,
		})
		const courseIds = views.filter((view) => view.entity.type === InteractionEntities.courses).map((view) => view.entity.id)
		const quizIds = views.filter((view) => view.entity.type === InteractionEntities.quizzes).map((view) => view.entity.id)
		const [courses, quizzes] = await Promise.all([
			CoursesUseCases.get({ where: [{ field: 'id', condition: Conditions.in, value: courseIds }], all: true }),
			QuizzesUseCases.get({ where: [{ field: 'id', condition: Conditions.in, value: quizIds }], all: true }),
		])
		return views
			.map((view) => {
				if (view.entity.type === InteractionEntities.courses) return courses.results.find((course) => course.id === view.entity.id)
				if (view.entity.type === InteractionEntities.quizzes) return quizzes.results.find((quiz) => quiz.id === view.entity.id)
				return null
			})
			.filter(Boolean)
	}

	static async byMyOrgs(req: Request) {
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) return []
		const query: QueryParams = {
			where: [
				{ field: 'user.id', condition: Conditions.in, value: user.account.organizationsIn },
				{ field: 'status', value: DraftStatus.published },
			],
			sort: [{ field: 'createdAt', desc: true }],
			limit: 15,
		}
		const [courses, quizzes] = await Promise.all([
			CoursesUseCases.get(query),
			QuizzesUseCases.get({
				...query,
				where: [...query.where!, { field: 'courseId', value: null }, { field: 'isForTutors', value: false }],
			}),
		])
		return [...courses.results, ...quizzes.results].sort((a, b) => b.createdAt - a.createdAt)
	}

	static async suggested(req: Request) {
		const query: QueryParams = {
			where: [
				{ field: 'user.id', condition: Conditions.ne, value: req.authUser!.id },
				{ field: 'status', value: DraftStatus.published },
			],
			sort: [{ field: 'ratings.avg', desc: true }],
			limit: 15,
		}
		const [courses, quizzes] = await Promise.all([
			CoursesUseCases.get(query),
			QuizzesUseCases.get({
				...query,
				where: [...query.where!, { field: 'courseId', value: null }, { field: 'isForTutors', value: false }],
			}),
		])
		return [...courses.results, ...quizzes.results].sort((a, b) => b.ratings.avg - a.ratings.avg)
	}

	static async latest(_req: Request) {
		const query: QueryParams = {
			where: [{ field: 'status', value: DraftStatus.published }],
			sort: [{ field: 'createdAt', desc: true }],
			limit: 15,
		}
		const [courses, quizzes] = await Promise.all([
			CoursesUseCases.get(query),
			QuizzesUseCases.get({
				...query,
				where: [...query.where!, { field: 'courseId', value: null }, { field: 'isForTutors', value: false }],
			}),
		])
		return [...courses.results, ...quizzes.results].sort((a, b) => b.createdAt - a.createdAt)
	}

	static async rated(_req: Request) {
		const query: QueryParams = {
			where: [{ field: 'status', value: DraftStatus.published }],
			sort: [{ field: 'ratings.avg', desc: true }],
			limit: 15,
		}
		const [courses, quizzes] = await Promise.all([
			CoursesUseCases.get(query),
			QuizzesUseCases.get({
				...query,
				where: [...query.where!, { field: 'courseId', value: null }, { field: 'isForTutors', value: false }],
			}),
		])
		return [...courses.results, ...quizzes.results].sort((a, b) => b.ratings.avg - a.ratings.avg)
	}

	static async popular(_req: Request) {
		const query: QueryParams = {
			where: [{ field: 'status', value: DraftStatus.published }],
			sort: [{ field: 'meta.total', desc: true }],
			limit: 15,
		}
		const [courses, quizzes] = await Promise.all([
			CoursesUseCases.get(query),
			QuizzesUseCases.get({
				...query,
				where: [...query.where!, { field: 'courseId', value: null }, { field: 'isForTutors', value: false }],
			}),
		])
		return [...courses.results, ...quizzes.results].sort((a, b) => b.meta.total - a.meta.total)
	}
}
